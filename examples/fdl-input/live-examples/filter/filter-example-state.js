import { createModel } from './filter-model.js';
// Tutorial state for the .filter() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';

export class ExampleModel extends ExampleController {
    modifier = 'filter';
    filterRecordset = createModel(() => this.probes.getField('matchRule'));
    probes = new Record(
        {
            filterProbe: field.label('Search names'),
            matchRule: field.label('Filter matching rule').options([
                { text: 'Starts with', value: 'prefix' },
                { text: 'Contains', value: 'contains' },
            ]),
        },
        { filterProbe: 'ar', matchRule: 'prefix' }
    );
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
