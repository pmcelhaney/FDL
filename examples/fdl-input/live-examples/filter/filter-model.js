import { field, Recordset } from '@pmcelhaney/fdl';

import { prefixFilter, substringFilter } from '../../comparison-examples';
export function createModel(getMatchingRule = () => 'prefix') {
    return new Recordset(
        {
            name: field
                .label('Name')
                .filter((text, value) =>
                    (getMatchingRule() === 'contains'
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
}
