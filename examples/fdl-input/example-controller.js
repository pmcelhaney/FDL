import { LitElement } from 'lit';
import { Record, Recordset } from '@pmcelhaney/fdl';

// Shared lifecycle for the small live examples. Rules and rendering stay in
// each example's model and view files.
export class ExampleController extends LitElement {
    refreshExample = () => {
        if (this.modifier === 'options') this.loadAssigneeChoices();
        this.requestUpdate();
    };
    connectedCallback() {
        super.connectedCallback();
        this.listenToModels('addEventListener');
        if (this.modifier === 'options') this.loadAssigneeChoices();
    }
    disconnectedCallback() {
        this.listenToModels('removeEventListener');
        super.disconnectedCallback();
    }
    listenToModels(method) {
        for (const value of Object.values(this)) {
            if (value instanceof Record) {
                value[method](
                    'change',
                    value === this.probes
                        ? (this.onProbeChange ?? this.refreshExample)
                        : this.refreshExample
                );
            }
            if (value instanceof Recordset)
                value[method]('page-changed', this.refreshExample);
        }
    }
}
