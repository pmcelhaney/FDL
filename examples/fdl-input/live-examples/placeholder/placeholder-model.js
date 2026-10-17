import { field, Record } from '@pmcelhaney/fdl';
export function createModel() {
    return new Record(
        {
            projectName: field
                .label('Project name')
                .placeholder('For example, Apollo migration'),
        },
        { projectName: '' }
    );
}
