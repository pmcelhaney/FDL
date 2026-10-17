import { LitElement } from 'lit';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
import '../../fdl-example';
import '../../fdl-field';
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
        return field
            .label('Access code')
            .minLength(this.settings.values.minimum)
            .maxLength(this.settings.values.maximum);
    }
    record = new Record({ code: this.codeType() }, { code: '' });
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
        this.settings.addEventListener('change', this.changeRules);
        this.record.addEventListener('change', this.refresh);
    }
    disconnectedCallback() {
        this.settings.removeEventListener('change', this.changeRules);
        this.record.removeEventListener('change', this.refresh);
        super.disconnectedCallback();
    }
}
