import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { exampleTheme } from '../../example-theme';
import '../../fdl-example';
import '../../fdl-field';
import '../../fdl-table';
import { ExampleModel } from './column-widths-model.js';
import model from './column-widths-model.js?raw';
import view from './column-widths-view.js?raw';
export class ExampleView extends ExampleModel {
    render() {
        const { minimum, preferred, maximum } = this.settings.values;
        return html`<fdl-example
            heading="Resize one column"
            .filenames=${['column-widths-model.js', 'column-widths-view.js']}
            .sources=${{ 'column-widths-model.js': model, 'column-widths-view.js': view }}
        >
            <p
                >Choose the three widths, then drag the divider or focus it and
                use the arrow keys. Changing a setting restores the initial
                layout.</p
            >
            ${['minimum', 'preferred', 'maximum'].map(name => html`<fdl-field .record=${this.settings} field=${name}></fdl-field>`)}
            ${keyed(
                this.table,
                html`<fdl-table .recordset=${this.table} show-width-diagnostics>
                    <fdl-column field="constrained"></fdl-column
                    ><fdl-column field="flexible"></fdl-column>
                </fdl-table>`
            )}
        </fdl-example>`;
    }
    static styles = [exampleTheme];
}
customElements.define('fdl-column-widths', ExampleView);
