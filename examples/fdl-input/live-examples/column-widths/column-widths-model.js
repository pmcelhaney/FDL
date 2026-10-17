import { LitElement } from 'lit';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
import Recordset from '../../../../src/recordset.js';
import '../../fdl-example';
import '../../fdl-field';
import '../../fdl-table';
export class ExampleModel extends LitElement {
    settings = new Record(
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
    table = this.createTable();
    createTable() {
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
    refresh = () => {
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
}
