import { codeType, record } from './text-length-model.js';
import { LitElement } from 'lit';
import { resetExampleRecord } from '../../example-controller';
import { field, Record } from '@pmcelhaney/bizallele';
import '../../fdl-example';
import '@pmcelhaney/bizallele/lit/fdl-field';
import '../../fdl-record-inspector';
export class ExampleModel extends LitElement {
    settings = new Record(
        {
            minimum: field
                .label('Minimum length')
                .parser(Number)
                .options(
                    [2, 4, 8].map(value => ({
                        text: `${value} characters`,
                        value,
                    }))
                ),
            maximum: field
                .label('Maximum length')
                .parser(Number)
                .options(
                    [12, 16, 24].map(value => ({
                        text: `${value} characters`,
                        value,
                    }))
                ),
        },
        { minimum: 4, maximum: 12 }
    );
    codeType() {
        return codeType(
            this.settings.values.minimum,
            this.settings.values.maximum
        );
    }
    record = record;
    checked = false;
    refresh = () => this.requestUpdate();
    changeRules = () => {
        this.record.addField(
            'code',
            this.codeType(),
            this.record.getField('code')
        );
        this.requestUpdate();
    };
    connectedCallback() {
        super.connectedCallback();
        resetExampleRecord(this.record);
        this.settings.addEventListener('change', this.changeRules);
        this.record.addEventListener('change', this.refresh);
    }
    disconnectedCallback() {
        this.settings.removeEventListener('change', this.changeRules);
        this.record.removeEventListener('change', this.refresh);
        super.disconnectedCallback();
    }
}
