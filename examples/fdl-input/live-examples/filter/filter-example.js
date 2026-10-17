import { filterView as renderExample } from './filter-view.js';
import { ExampleModel } from './filter-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-field';
import '../../fdl-table';
import '../../fdl-recordset-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderField(field, record, showValidationErrors = false) {
        return keyed(
            record.field(field),
            html`<fdl-field
                field=${field}
                .record=${record}
                .showValidationErrors=${showValidationErrors}
            ></fdl-field>`
        );
    }
    renderDemo() {
        return html`<p class="try"
                >Choose a matching rule and enter search text to filter the
                table.</p
            >${this.renderField('matchRule', this.probes)}${this.renderField('filterProbe', this.probes)}${renderExample(
                this.filterRecordset,
                { name: this.probes.getField('filterProbe') },
                event => {
                    const text = event.detail.name ?? '';
                    if (text !== this.probes.getField('filterProbe'))
                        this.probes.setField('filterProbe', text);
                }
            )}`;
    }
    render() {
        return html`<div class="focused full-width" data-modifier="filter"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-recordset-inspector
                .recordset=${this.filterRecordset}
            ></fdl-recordset-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-filter', ExampleView);
