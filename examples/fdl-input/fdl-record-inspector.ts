import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import Record from '../../src/record.js';
import { exampleTheme } from './example-theme';

const statusPaths = {
    Hidden: 'M3 3l18 18 M10 5a12 12 0 0 1 12 7s-1 2-3 4 M14 19C6 20 2 12 2 12s1-2 4-4 M10 10a3 3 0 0 0 4 4',
    Disabled: 'M8 11V7a4 4 0 0 1 8 0v4 M5 11h14v10H5z M12 15v2',
    'Read-only': 'M3 17v4h4L20 8l-4-4z M14 6l4 4 M3 3l18 18',
    Required: 'M12 4v16 M5 8l14 8 M5 16l14-8',
    Invalid: 'M12 3L2 21h20z M12 9v5 M12 17v1',
};

export function statusIcon(status: keyof typeof statusPaths) {
    return html`<span
        class="status-icon"
        role="img"
        aria-label=${status}
        title=${status}
    >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d=${statusPaths[status]}></path>
        </svg>
    </span>`;
}

export function storedValue(value: unknown): string {
    if (value === '') return '(empty string)';
    if (value === undefined) return '(undefined)';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' && !Number.isFinite(value))
        return String(value);
    try {
        return JSON.stringify(value) ?? String(value);
    } catch {
        return String(value);
    }
}

export function fieldStatus(record: Record<any>, name: string) {
    const field = record.field(name);
    return html`<span class="field-status">
        ${!field.visible ? statusIcon('Hidden') : ''}
        ${field.disabled ? statusIcon('Disabled') : ''}
        ${field.readOnly ? statusIcon('Read-only') : ''}
        ${field.required ? statusIcon('Required') : ''}
        ${!record.isValid(name) ? statusIcon('Invalid') : ''}
    </span>`;
}

export function statusLegend() {
    return html`<div class="legend" aria-label="Status icon legend">
        <p>Icon legend</p>
        <ul
            >${Object.keys(statusPaths).map(status => html`<li>${statusIcon(status as keyof typeof statusPaths)}<span>${status}</span></li>`)}</ul
        >
    </div>`;
}

function nestedRecord(
    definitions: Record<any>['fieldTypes'],
    value: unknown
): Record<any> {
    return value instanceof Record
        ? value
        : new Record(
              definitions,
              (value as { [key: string]: unknown }) ?? {}
          );
}

type InspectorView =
    | { kind: 'record'; label: string; record: Record<any> }
    | {
          kind: 'recordset';
          label: string;
          definitions: Record<any>['fieldTypes'];
          values: unknown[];
      };

/** Read-only inspection of an FDL record, independent of its form or page. */
export class FdlRecordInspector extends LitElement {
    static properties = {
        record: { attribute: false },
        fields: { attribute: false },
        collapsed: { type: Boolean, reflect: true },
    };

    record?: Record<any>;
    fields?: readonly string[];
    collapsed = false;
    private navigation: InspectorView[] = [];
    private observedRecord?: Record<any>;
    private readonly handleChange = this.refresh.bind(this);

    connectedCallback() {
        super.connectedCallback();
        this.observeRecord();
        this.requestUpdate();
    }

    disconnectedCallback() {
        this.observedRecord?.removeEventListener('change', this.handleChange);
        this.observedRecord = undefined;
        super.disconnectedCallback();
    }

    protected willUpdate(changed: PropertyValues<this>) {
        if (changed.has('record')) this.navigation = [];
        this.observeRecord();
    }

    private observeRecord() {
        if (this.observedRecord === this.record) return;
        this.observedRecord?.removeEventListener('change', this.handleChange);
        this.observedRecord = this.record;
        this.observedRecord?.addEventListener('change', this.handleChange);
    }

    private refresh() {
        this.requestUpdate();
    }

    private toggle() {
        this.collapsed = !this.collapsed;
    }

    private openNestedRecord(record: Record<any>, label: string) {
        this.navigation = [...this.navigation, { kind: 'record', label, record }];
        this.requestUpdate();
    }

    private openNestedRecordset(
        definitions: Record<any>['fieldTypes'],
        values: unknown[],
        label: string
    ) {
        this.navigation = [
            ...this.navigation,
            { kind: 'recordset', definitions, label, values },
        ];
        this.requestUpdate();
    }

    private goBack() {
        this.navigation = this.navigation.slice(0, -1);
        this.requestUpdate();
    }

    private renderRecordTable(record: Record<any>, nested = false): unknown {
        const fields = Object.keys(record.fieldTypes);
        return html`<div class="${nested ? 'nested-table-scroll' : 'table-scroll'}" role="region" aria-label="Record fields" tabindex="0">
                <table aria-label="Field state">
                    <thead>
                        <tr>
                            <th scope="col" class="status-column"></th>
                            <th scope="col">Field</th>
                            <th scope="col">Label</th>
                            <th scope="col">Stored value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fields.map(name => {
                            const field = record.field(name);
                            return html`<tr
                                data-field=${nested ? nothing : name}
                                data-nested-field=${nested ? name : nothing}
                            >
                                <td class="status-column">${fieldStatus(record, name)}</td>
                                <th scope="row" class="field-name">${name}</th>
                                <td class="field-label">${field.label}</td>
                                <td class="stored-value">
                                    ${storedValue(field.rawValue)}
                                    ${this.renderNestedValue(field, field.rawValue)}
                                </td>
                            </tr>`;
                        })}
                    </tbody>
                </table>
            </div>`;
    }

    private renderNestedValue(
        field: ReturnType<Record<any>['field']>,
        value: unknown
    ): unknown {
        if (field.recordDefinition) {
            const child = nestedRecord(field.recordDefinition, value);
            return html`<button
                type="button"
                class="nested-inspect"
                @click=${() => this.openNestedRecord(child, 'Nested record')}
            >Inspect nested record</button>`;
        }
        if (field.recordsetDefinition) {
            const values = Array.isArray(value) ? value : [];
            return html`<button
                type="button"
                class="nested-inspect"
                @click=${() =>
                    this.openNestedRecordset(
                        field.recordsetDefinition!,
                        values,
                        'Nested recordset'
                    )}
            >Inspect nested recordset (${values.length} rows)</button>`;
        }
        return '';
    }

    private renderNestedRecordView(view: Extract<InspectorView, { kind: 'record' }>) {
        return html`<div class="nested-view">
            ${this.renderRecordTable(view.record, true)}
            <p class="nested-validation" role="status">
                ${view.record.isValid() ? 'Valid' : 'Invalid'} nested record
            </p>
        </div>`;
    }

    private renderNestedRecordsetView(
        view: Extract<InspectorView, { kind: 'recordset' }>
    ) {
        return html`<div class="nested-view">
            <div class="nested-table-scroll" role="region" aria-label="Nested recordset" tabindex="0">
                <table aria-label="Nested recordset">
                    <thead><tr><th scope="col">Row</th><th scope="col">Stored value</th><th scope="col">Action</th></tr></thead>
                    <tbody>${view.values.map((value, index) => html`<tr data-nested-row=${index + 1}>
                        <th scope="row">${index + 1}</th>
                        <td class="stored-value">${storedValue(value)}</td>
                        <td><button type="button" class="nested-inspect" @click=${() => this.openNestedRecord(nestedRecord(view.definitions, value), `Nested row ${index + 1}`)}>Inspect row</button></td>
                    </tr>`)}</tbody>
                </table>
            </div>
            ${view.values.length ? '' : html`<p class="nested-empty">No nested rows.</p>`}
            <p class="nested-validation" role="status">
                ${view.values.every(value => nestedRecord(view.definitions, value).isValid()) ? 'Valid' : 'Invalid'} nested recordset
            </p>
        </div>`;
    }

    private renderCurrentNestedView() {
        const view = this.navigation[this.navigation.length - 1];
        if (!view) return '';
        return view.kind === 'record'
            ? this.renderNestedRecordView(view)
            : this.renderNestedRecordsetView(view);
    }

    render() {
        const record = this.record;
        const fields = this.fields ?? Object.keys(record?.fieldTypes ?? {});
        const currentView = this.navigation[this.navigation.length - 1];
        const action = this.collapsed
            ? 'Inspect record'
            : 'Collapse record inspector';
        return html`<section aria-label="Record Inspector">
            <header>
                <span
                    class="inspector-icon"
                    aria-hidden="true"
                    ?hidden=${this.collapsed}
                >
                    <svg viewBox="0 0 24 24" focusable="false">
                        <circle cx="10" cy="10" r="6"></circle>
                        <path d="m15 15 6 6"></path>
                    </svg>
                </span>
                <div class="inspector-heading" ?hidden=${this.collapsed}>
                    <h3>${currentView?.label ?? 'Record Inspector'}</h3>
                    <p>Stored values · Field state</p>
                </div>
                ${currentView
                    ? html`<button
                          type="button"
                          class="back-button"
                          aria-label="Back to parent record"
                          title="Back to parent record"
                          @click=${this.goBack}
                      >
                          ← Back
                      </button>`
                    : ''}
                <button
                    type="button"
                    aria-label=${action}
                    title=${action}
                    aria-expanded=${!this.collapsed}
                    aria-controls="record-details"
                    @click=${this.toggle}
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <g ?hidden=${!this.collapsed}>
                            <circle cx="10" cy="10" r="6"></circle>
                            <path d="m15 15 6 6"></path>
                        </g>
                        <path ?hidden=${this.collapsed} d="m6 9 6 6 6-6"></path>
                    </svg>
                </button>
            </header>
            <div id="record-details" ?hidden=${this.collapsed}>
                ${
                    currentView
                        ? this.renderCurrentNestedView()
                        : record
                        ? html`<div
                                  class="table-scroll"
                                  role="region"
                                  aria-label="Record fields"
                                  tabindex="0"
                                  ><table aria-label="Field state">
                                      <thead
                                          ><tr
                                              ><th
                                                  scope="col"
                                                  class="status-column"
                                              ></th
                                              ><th scope="col">Field</th
                                              ><th scope="col">Label</th
                                              ><th scope="col"
                                                  >Stored value</th
                                              ></tr
                                          ></thead
                                      >
                                      <tbody
                                          >${fields.map(name => {
                                              const field = record.field(name);
                                              return html`<tr
                                                  data-field=${name}
                                              >
                                                  <td class="status-column"
                                                      >${fieldStatus(record, name)}</td
                                                  >
                                                  <th
                                                      scope="row"
                                                      class="field-name"
                                                      >${name}</th
                                                  >
                                                  <td class="field-label"
                                                      >${field.label}</td
                                                  >
                                                  <td class="stored-value"
                                                      >${storedValue(field.rawValue)}${this.renderNestedValue(field, field.rawValue)}</td
                                                  >
                                              </tr>`;
                                          })}</tbody
                                      >
                                  </table></div
                              >
                              ${statusLegend()}
                              <p class="validation" role="status"
                                  >${this.fields ? 'Displayed fields validation:' : 'Record validation:'}
                                  <strong
                                      >${(this.fields ? this.fields.every(name => record.isValid(name)) : record.isValid()) ? 'Valid' : 'Invalid'}</strong
                                  ></p
                              >`
                        : html`<p>No record selected.</p>`
                }
            </div>
        </section>`;
    }

    static styles = css`
        :host {
            display: block;
            min-width: 0;
        }
        * {
            box-sizing: border-box;
        }
        [hidden] {
            display: none !important;
        }
        section {
            --example-border: #dedede;
            border: 1px solid #d4d4d4;
            border-radius: 12px;
            background: #fff;
            color: #262626;
            box-shadow: 0 2px 6px #00000008;
        }
        header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 18px 20px;
            border-bottom: 1px solid #d4d4d4;
            border-radius: 11px 11px 0 0;
            background: linear-gradient(110deg, #f5f5f5, #fafafa);
            color: #262626;
        }
        :host([collapsed]) section {
            border: 0;
            background: transparent;
            box-shadow: none;
        }
        :host([collapsed]) header {
            padding: 0;
            border: 0;
            background: transparent;
        }
        .inspector-icon {
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            border: 1px solid #d4d4d4;
            border-radius: 10px;
            background: #fff;
            color: #525252;
        }
        .inspector-icon svg {
            width: 22px;
            height: 22px;
        }
        .inspector-heading {
            flex: 1;
            min-width: 0;
        }
        h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.4;
        }
        .inspector-heading p {
            margin: 4px 0 0;
            font-size: 0.75rem;
            line-height: 1.5;
            color: #666666;
        }
        #record-details,
        #recordset-details {
            padding: 8px 20px 20px;
        }
        header button {
            display: grid;
            place-items: center;
            flex-shrink: 0;
            width: 44px;
            height: 44px;
            border: 1px solid #d4d4d4;
            border-radius: 50%;
            background: white;
            color: #525252;
            cursor: pointer;
        }
        button:hover {
            background: #eeeeee;
            border-color: #525252;
        }
        button:focus-visible {
            outline: 3px solid #525252;
            outline-offset: 3px;
        }
        button svg {
            width: 20px;
            height: 20px;
            transition: transform 160ms;
        }
        button[aria-expanded='true'] svg {
            transform: rotate(180deg);
        }
        svg {
            fill: none;
            stroke: currentColor;
            stroke-width: 1.75;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .table-scroll {
            overflow-x: auto;
        }
        .nested-table-scroll {
            overflow-x: auto;
            margin-top: 12px;
        }
        .nested-inspect,
        .back-button {
            padding: 6px 10px;
            border: 1px solid var(--example-border);
            border-radius: 6px;
            background: #fafafa;
            font-family: inherit;
            cursor: pointer;
        }
        .nested-inspect {
            font-size: 0.8125rem;
            font-weight: 600;
        }
        .back-button {
            margin-left: auto;
            white-space: nowrap;
        }
        .nested-view {
            min-width: 0;
        }
        .nested-view table {
            min-width: 420px;
            margin-top: 8px;
        }
        .nested-validation,
        .nested-empty {
            margin: 8px 0 0;
            font-size: 0.8125rem;
        }
        .table-scroll:focus-visible {
            outline: 3px solid #525252;
            outline-offset: 3px;
        }
        table {
            min-width: 480px;
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        th,
        td {
            padding: 12px 6px;
            border-bottom: 1px solid var(--example-border);
            text-align: left;
            vertical-align: top;
            overflow-wrap: anywhere;
        }
        thead th {
            color: #666666;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-column {
            width: 1%;
            white-space: nowrap;
        }
        .field-name,
        .stored-value {
            font-family: ui-monospace, monospace;
            font-size: 0.8125rem;
        }
        tbody tr:nth-child(even) {
            background: #fafafa;
        }
        .field-status {
            display: inline-flex;
            flex-wrap: nowrap;
            gap: 6px;
            width: max-content;
        }
        .status-icon {
            display: inline-flex;
            flex: 0 0 20px;
            width: 20px;
            height: 20px;
            color: #525252;
        }
        .status-icon svg {
            width: 100%;
            height: 100%;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.75;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .legend {
            padding: 16px;
            border: 1px solid var(--example-border);
            border-radius: 8px;
            background: #fafafa;
            margin-top: 20px;
            font-size: 0.8125rem;
            color: #525252;
        }
        .legend p {
            margin: 0 0 8px;
            font-weight: 600;
        }
        .legend ul {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px 16px;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .legend li {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .validation {
            padding-top: 16px;
            border-top: 1px solid var(--example-border);
            font-size: 0.875rem;
            margin-bottom: 0;
        }
        @media (max-width: 480px) {
            header {
                padding: 16px;
                gap: 10px;
            }
            #record-details,
            #recordset-details {
                padding: 8px 16px 16px;
            }
            .inspector-icon {
                width: 32px;
                height: 32px;
            }
        }
        @media (prefers-reduced-motion: reduce) {
            button svg {
                transition: none;
            }
        }
        @media (forced-colors: active) {
            section,
            header,
            .inspector-icon,
            button {
                border-color: CanvasText;
            }
        }
        ${exampleTheme}
    `;
}

customElements.define('fdl-record-inspector', FdlRecordInspector);

declare global {
    interface HTMLElementTagNameMap {
        'fdl-record-inspector': FdlRecordInspector;
    }
}
