import { LitElement, css, html, nothing } from 'lit';
import type Record from '../../record.js';
import Recordset from '../../recordset.js';

type SortDirection = 'ascending' | 'descending';
type SortColumn = {
    field: string;
    sort: SortDirection;
};

type ColumnWidthLimits = {
    min: number;
    max?: number;
};

/**
 * Moves a divider while keeping the table's total width constant.  Space is
 * borrowed from (or returned to) columns on the right in display order.
 */
export function resizeColumnWidths(
    widths: number[],
    limits: ColumnWidthLimits[],
    leftIndex: number,
    requestedDelta: number
) {
    const next = [...widths];
    const left = limits[leftIndex];
    if (!left || !Number.isFinite(requestedDelta)) return next;

    const leftMinimumDelta = left.min - widths[leftIndex];
    const leftMaximumDelta = (left.max ?? Infinity) - widths[leftIndex];
    let delta = Math.max(leftMinimumDelta, Math.min(leftMaximumDelta, requestedDelta));

    const available = limits.slice(leftIndex + 1).reduce((total, limit, index) => {
        const width = widths[leftIndex + index + 1];
        return total + (delta > 0 ? width - limit.min : (limit.max ?? Infinity) - width);
    }, 0);
    delta = delta > 0 ? Math.min(delta, available) : Math.max(delta, -available);
    if (!delta) return next;

    next[leftIndex] += delta;
    let remaining = Math.abs(delta);
    const shrink = delta > 0;
    for (let index = leftIndex + 1; index < next.length && remaining > 0; index += 1) {
        const limit = limits[index];
        const capacity = shrink
            ? next[index] - limit.min
            : (limit.max ?? Infinity) - next[index];
        const adjustment = Math.min(remaining, capacity);
        next[index] += shrink ? -adjustment : adjustment;
        remaining -= adjustment;
    }
    return next;
}

export class FdlColumn extends HTMLElement {
    get field() {
        return this.getAttribute('field') ?? '';
    }

    set field(value: string) {
        this.setAttribute('field', value);
    }

    get label() {
        return this.getAttribute('label') ?? '';
    }

    set label(value: string) {
        this.setAttribute('label', value);
    }

}

export class FdlTable extends LitElement {
    static properties = {
        recordset: { attribute: false },
    };

    recordset?: Recordset<any>;

    private observedRecordset?: Recordset<any>;

    private columnWidths?: number[];

    private resizing?: { leftIndex: number; startX: number; widths: number[] };

    private columnObserver = new MutationObserver(() => this.requestUpdate());

    private onRecordsetChange = () => this.requestUpdate();

    connectedCallback() {
        super.connectedCallback();
        this.columnObserver.observe(this, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    disconnectedCallback() {
        this.columnObserver.disconnect();
        this.stopObservingRecordset();
        super.disconnectedCallback();
    }

    willUpdate() {
        if (this.observedRecordset !== this.recordset) {
            this.stopObservingRecordset();
            this.observedRecordset = this.recordset;
            this.observedRecordset?.addEventListener('page-changed', this.onRecordsetChange);
            void this.observedRecordset?.requestUpdate();
        }
    }

    private stopObservingRecordset() {
        this.observedRecordset?.removeEventListener('page-changed', this.onRecordsetChange);
        this.observedRecordset = undefined;
    }

    private get columns() {
        return [...this.querySelectorAll<FdlColumn>('fdl-column')].filter(column => column.field);
    }

    private get sortColumns() {
        return (this.recordset?.sortColumns ?? []) as SortColumn[];
    }

    private sortFor(field: string) {
        return this.sortColumns.find(column => column.field === field);
    }

    private sortPriority(field: string) {
        const index = this.sortColumns.findIndex(column => column.field === field);
        return index < 0 ? undefined : index + 1;
    }

    private isSortable(column: FdlColumn) {
        return this.recordset?.getFieldType(column.field).sortable() ?? false;
    }

    private columnLimits(column: FdlColumn): ColumnWidthLimits {
        const properties = this.recordset?.getFieldType(column.field).properties;
        return {
            min: properties?.minColumnWidth ?? 30,
            max: properties?.maxColumnWidth,
        };
    }

    updated() {
        if (this.columnWidths) return;
        const columnElements = this.shadowRoot?.querySelectorAll<HTMLTableColElement>('col');
        if (!columnElements?.length) return;

        const widths = [...columnElements].map(column => column.getBoundingClientRect().width);
        // JSDOM does not lay out tables; wait for a real layout before fixing widths.
        if (widths.some(width => width <= 0)) return;

        this.columnWidths = widths.map((width, index) => {
            const limit = this.columnLimits(this.columns[index]);
            return Math.max(limit.min, Math.min(limit.max ?? Infinity, width));
        });
        this.requestUpdate();
    }

    private columnStyle(column: FdlColumn, index: number) {
        const limits = this.columnLimits(column);
        const width = this.columnWidths?.[index];
        return [
            `min-width:${limits.min}px`,
            limits.max === undefined ? '' : `max-width:${limits.max}px`,
            width === undefined ? '' : `width:${width}px`,
        ].filter(Boolean).join(';');
    }

    private startResize(event: PointerEvent, leftIndex: number) {
        const columnElements = this.shadowRoot?.querySelectorAll<HTMLTableColElement>('col');
        if (!columnElements || leftIndex >= columnElements.length - 1) return;

        const widths = [...columnElements].map(column => column.getBoundingClientRect().width);
        this.resizing = { leftIndex, startX: event.clientX, widths };
        this.columnWidths = widths;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        event.preventDefault();
    }

    private resize(event: PointerEvent) {
        if (!this.resizing) return;
        this.columnWidths = resizeColumnWidths(
            this.resizing.widths,
            this.columns.map(column => this.columnLimits(column)),
            this.resizing.leftIndex,
            event.clientX - this.resizing.startX
        );
        this.requestUpdate();
    }

    private endResize(event: PointerEvent) {
        if (!this.resizing) return;
        this.resizing = undefined;
        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    }

    private async sort(column: FdlColumn) {
        if (!this.recordset || !this.isSortable(column)) return;

        const currentSort = this.sortFor(column.field)?.sort;
        const sort =
            currentSort === 'ascending'
                ? 'descending'
                : currentSort === 'descending'
                  ? 'UNSORTED'
                  : 'ascending';

        await this.recordset.sort({ field: column.field, sort });
        await this.recordset.requestUpdate();
    }

    private heading(column: FdlColumn) {
        const record = this.recordset?.currentPage[0];
        const configuredLabel = this.recordset?.getFieldType(column.field).label(record);
        return (
            column.label ||
            configuredLabel ||
            column.field
                .replace(/[-_]+/g, ' ')
                .replace(/\b\w/g, letter => letter.toUpperCase())
        );
    }

    private rowClasses(record: Record<any>) {
        return this.columns
            .flatMap(column => {
                const value = record.getField(column.field);
                return record.fieldTypeForField(column.field).rowClasses(value, record);
            })
            .join(' ');
    }

    private renderHeading(column: FdlColumn, index: number) {
        const activeSort = this.sortFor(column.field);
        const priority = this.sortPriority(column.field);
        const indicator =
            activeSort?.sort === 'ascending'
                ? '↑'
                : activeSort?.sort === 'descending'
                  ? '↓'
                  : '';
        const ariaSort =
            priority === 1 && activeSort
                ? activeSort.sort
                : nothing;

        return html`<th aria-sort=${ariaSort}>
            ${this.isSortable(column)
                ? html`<button
                      type="button"
                      class=${activeSort ? 'sorted' : ''}
                      title=${activeSort
                          ? `${this.heading(column)}: ${activeSort.sort}, sort priority ${priority}`
                          : `Sort by ${this.heading(column)}`}
                      @click=${() => this.sort(column)}
                  >
                      <span>${this.heading(column)}</span>
                      ${indicator
                          ? html`<span class="sort-indicator" aria-hidden="true"
                                >${indicator}<small>${priority}</small></span
                            >`
                          : nothing}
                  </button>`
                : this.heading(column)}
            ${index < this.columns.length - 1
                ? html`<div
                      class="resize-handle"
                      role="separator"
                      aria-label=${`Resize ${this.heading(column)} column`}
                      aria-orientation="vertical"
                      @pointerdown=${(event: PointerEvent) => this.startResize(event, index)}
                      @pointermove=${this.resize}
                      @pointerup=${this.endResize}
                      @pointercancel=${this.endResize}
                  ></div>`
                : nothing}
        </th>`;
    }

    private renderCell(record: Record<any>, column: FdlColumn) {
        const value = record.getField(column.field);
        const fieldType = record.fieldTypeForField(column.field);
        return html`<td
            class=${fieldType.cellClasses(value).join(' ')}
            style=${`text-align:${fieldType.textAlign()}`}
        >
            ${record.print(column.field)}
        </td>`;
    }

    render() {
        const columns = this.columns;
        const records = this.recordset?.currentPage ?? [];

        return html`
            <div class="table-frame">
                <table style=${this.columnWidths ? `width:${this.columnWidths.reduce((total, width) => total + width, 0)}px` : ''}>
                    <colgroup>
                        ${columns.map((column, index) => html`<col style=${this.columnStyle(column, index)} />`)}
                    </colgroup>
                    <thead>
                        <tr>${columns.map((column, index) => this.renderHeading(column, index))}</tr>
                    </thead>
                    <tbody>
                        ${records.map(
                            record => html`<tr class=${this.rowClasses(record)}>
                                ${columns.map(column => this.renderCell(record, column))}
                            </tr>`
                        )}
                    </tbody>
                </table>
            </div>
            <slot></slot>
        `;
    }

    static styles = css`
        :host {
            display: block;
        }

        .table-frame {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border-bottom: 1px solid #dfe3ee;
            padding: 0.65rem;
            text-align: left;
        }

        .numeric-cell {
            background: #f7f8ff;
            color: #34308f;
            font-variant-numeric: tabular-nums;
        }

        .high-value {
            background: #fff4d6;
            color: #8a4b00;
            font-weight: 800;
        }

        tr.disputed-row {
            background: #fffdf7;
            box-shadow: inset 0.25rem 0 #d89b24;
        }

        th {
            position: relative;
            color: #586174;
            font-size: 0.75rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .resize-handle {
            position: absolute;
            z-index: 1;
            top: 0;
            right: -0.4rem;
            width: 0.8rem;
            height: 100%;
            cursor: col-resize;
            touch-action: none;
        }

        .resize-handle::after {
            position: absolute;
            top: 0.35rem;
            bottom: 0.35rem;
            left: calc(50% - 1px);
            width: 2px;
            border-radius: 1px;
            background: transparent;
            content: '';
        }

        .resize-handle:hover::after,
        .resize-handle:focus-visible::after {
            background: #7657ff;
        }

        th button {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            border: 0;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font: inherit;
            font-weight: 800;
            letter-spacing: inherit;
            padding: 0;
            text-align: left;
            text-transform: inherit;
        }

        th button:hover,
        th button:focus-visible,
        th button.sorted {
            color: #4438c7;
        }

        th button:focus-visible {
            border-radius: 0.2rem;
            outline: 2px solid #766de0;
            outline-offset: 0.25rem;
        }

        .sort-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.12rem;
            font-size: 1rem;
            line-height: 1;
        }

        .sort-indicator small {
            min-width: 1.05rem;
            border-radius: 999px;
            background: #eeecff;
            font-size: 0.62rem;
            line-height: 1.05rem;
            text-align: center;
        }

        slot {
            display: none;
        }
    `;
}

if (!customElements.get('fdl-column')) customElements.define('fdl-column', FdlColumn);
if (!customElements.get('fdl-table')) customElements.define('fdl-table', FdlTable);
