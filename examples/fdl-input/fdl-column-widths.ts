import { LitElement, html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { field } from '../../src/index';
import Record from '../../src/record.js';
import Recordset from '../../src/recordset.js';
import { exampleTheme } from './example-theme';
import './fdl-example';
import './fdl-field';
import './fdl-table';

export class FdlColumnWidths extends LitElement {
    private settings = new Record(
        {
            minimum: field
                .label('Minimum width')
                .parser(Number)
                .options(
                    [80, 110, 140].map(value => ({ text: `${value}px`, value }))
                ),
            preferred: field
                .label('Preferred width')
                .parser(Number)
                .options(
                    [160, 200, 240].map(value => ({
                        text: `${value}px`,
                        value,
                    }))
                ),
            maximum: field
                .label('Maximum width')
                .parser(Number)
                .options(
                    [260, 320, 400].map(value => ({
                        text: `${value}px`,
                        value,
                    }))
                ),
        },
        { minimum: 110, preferred: 160, maximum: 260 }
    );
    private table = this.createTable();

    private createTable() {
        const { minimum, preferred, maximum } = this.settings.values;
        return new Recordset(
            {
                constrained: field
                    .label('Constrained column')
                    .minColumnWidth(minimum)
                    .targetColumnWidth(preferred)
                    .maxColumnWidth(maximum),
                flexible: field.label('Flexible column').minColumnWidth(80),
            },
            [
                {
                    constrained: 'Resize between the limits',
                    flexible: 'Uses the remaining space',
                },
            ]
        );
    }
    private refresh = () => {
        this.table = this.createTable();
        this.requestUpdate();
    };
    connectedCallback() {
        super.connectedCallback();
        this.settings.addEventListener('change', this.refresh);
    }
    disconnectedCallback() {
        this.settings.removeEventListener('change', this.refresh);
        super.disconnectedCallback();
    }
    render() {
        const { minimum, preferred, maximum } = this.settings.values;
        const model = `import { field, Recordset } from '@pmcelhaney/fdl';
const columns = {
    constrained: field.label('Constrained column')
        .minColumnWidth(${minimum})
        .targetColumnWidth(${preferred})
        .maxColumnWidth(${maximum}),
    flexible: field.label('Flexible column').minColumnWidth(80),
};
export const rows = new Recordset(columns, [
    { constrained: 'Resize between the limits', flexible: 'Uses the remaining space' },
]);`;
        const view = `import { html, render } from 'lit';
import { rows } from './column-widths-model.js';
import './fdl-table';
// Render using the repository's example adapter.
render(html\`<fdl-table .recordset=\${rows} show-width-diagnostics>
    <fdl-column field="constrained"></fdl-column>
    <fdl-column field="flexible"></fdl-column>
</fdl-table>\`, document.body);`;
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
customElements.define('fdl-column-widths', FdlColumnWidths);
