import { recordset, probes } from './filter-model.js';
// Tutorial state for the .filter() example.
import { ExampleController } from '../../example-controller';

export class ExampleModel extends ExampleController {
    modifier = 'filter';
    filterRecordset = recordset;
    probes = probes;
    onProbeChange = () => {
        {
            const filterMode =
                this.probes.getField('matchRule') === 'contains'
                    ? 'contains'
                    : 'prefix';
            this.dispatchEvent(
                new CustomEvent('example-settings-change', {
                    detail: { filterMode },
                    bubbles: true,
                    composed: true,
                })
            );
            this.filterRecordset.requestImmediateUpdate();
        }
        this.requestUpdate();
    };
}
