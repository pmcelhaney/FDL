import { createModel } from './column-widths-model.js';
import { LitElement } from 'lit';
import { field, Record, Recordset } from '@pmcelhaney/fdl';
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
        return createModel(this.settings.values);
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
