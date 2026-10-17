import { field, Record } from '@pmcelhaney/fdl';
export const record = new Record(
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
