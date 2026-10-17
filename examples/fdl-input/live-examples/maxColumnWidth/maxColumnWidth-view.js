import { ExampleModel } from './maxColumnWidth-model.js';
import { html } from 'lit';
import '../../fdl-table';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    renderWidth(name) {
        const instructions = {
            maxColumnWidth:
                'Drag the divider right. The Maximum column stops at 180px.',
            minColumnWidth:
                'Drag the divider left. The Minimum column stops at 110px.',
            targetColumnWidth:
                'Drag the divider to resize this preferred-width column; its minimum and maximum still apply.',
        };
        return html`<p class="try">${instructions[name]}</p>
            <fdl-table
                show-width-diagnostics
                class="width-table"
                .recordset=${this.widthRecordsets[name]}
            >
                <fdl-column field="constrained"></fdl-column>
                <fdl-column field="flexible"></fdl-column>
            </fdl-table>`;
    }
    renderDemo() {
        return this.renderWidth('maxColumnWidth');
    }
    render() {
        return html`<div
            class="focused full-width"
            data-modifier="maxColumnWidth"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><div class="focused-state"
                ><p>Stored values</p
                ><pre>${JSON.stringify(this.probes?.values)}</pre>
            </div></div
        >`;
    }
}
customElements.define('fdl-live-maxcolumnwidth', ExampleView);
