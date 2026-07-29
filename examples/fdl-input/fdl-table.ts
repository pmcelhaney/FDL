import { LitElement, css, html, nothing } from 'lit';
import type Record from '../../record.js';
import Recordset from '../../recordset.js';

type SortDirection = 'ascending' | 'descending';
type SortColumn = {
    field: string;
    sort: SortDirection;
};

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

    get sortable() {
        const value = this.getAttribute('sortable');
        return value !== null && value !== 'false';
    }

    set sortable(value: boolean) {
        if (value) this.setAttribute('sortable', 'true');
        else this.removeAttribute('sortable');
    }
}

export class FdlTable extends LitElement {
    static properties = {
        recordset: { attribute: false },
    };

    recordset?: Recordset<any>;

    private observedRecordset?: Recordset<any>;

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

    private async sort(column: FdlColumn) {
        if (!this.recordset || !column.sortable) return;

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

    private renderHeading(column: FdlColumn) {
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
            ${column.sortable
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
                <table>
                    <thead>
                        <tr>${columns.map(column => this.renderHeading(column))}</tr>
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
            color: #586174;
            font-size: 0.75rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
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
