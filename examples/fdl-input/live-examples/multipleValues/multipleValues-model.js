import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
export function createModel() {
    return new Record(
        {
            skills: field
                .label('Skills')
                .multipleValues()
                .options([
                    { text: 'Design', value: 'design' },
                    { text: 'Engineering', value: 'engineering' },
                    { text: 'Research', value: 'research' },
                ]),
        },
        { skills: ['design'] }
    );
}
