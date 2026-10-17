import { recordset, probes } from './cellClass-model.js';
// Tutorial state for the .cellClass() example.
import { ExampleController } from '../../example-controller';
export class ExampleModel extends ExampleController {
    modifier = 'cellClass';
    cellClassRecordset = recordset;
    probes = probes;
    onProbeChange = () => {
        {
            const threshold = this.probes.getField('classThreshold');
            void this.cellClassRecordset.requestImmediateUpdate();
            this.dispatchEvent(
                new CustomEvent('example-settings-change', {
                    detail: { threshold },
                    bubbles: true,
                    composed: true,
                })
            );
        }
        this.requestUpdate();
    };
}
