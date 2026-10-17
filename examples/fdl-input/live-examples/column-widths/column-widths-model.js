import { field, Recordset } from '@pmcelhaney/fdl';
export function createModel({
    minimum = 110,
    preferred = 160,
    maximum = 260,
} = {}) {
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
