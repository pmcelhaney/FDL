import { field } from '../../../../src/index';
import Record from '../../../../src/record.js';
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
