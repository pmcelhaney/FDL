import { field, Record } from '@pmcelhaney/fdl';
export const record = new Record(
    {
        projectName: field
            .label('Project name')
            .placeholder('For example, Apollo migration'),
    },
    { projectName: '' }
);
