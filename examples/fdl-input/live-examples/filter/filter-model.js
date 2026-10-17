// Field rules and state for the .filter() example.
import { ExampleController } from '../../example-controller';
import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
import Recordset from '../../../../src/recordset.js';
import { prefixFilter, substringFilter } from '../../comparison-examples';
export class ExampleModel extends ExampleController {
    modifier = 'filter';
    filterRecordset = new Recordset(
        {
            name: field
                .label('Name')
                .filter((text, value) =>
                    (this.probes.getField('matchRule') === 'contains'
                        ? substringFilter
                        : prefixFilter
                    )
                        .valueOf()
                        .match(text, value)
                ),
            team: field.label('Team'),
        },
        [
            { name: 'Ada', team: 'Research' },
            { name: 'Grace', team: 'Platform' },
            { name: 'Margaret', team: 'Research' },
        ]
    );
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
