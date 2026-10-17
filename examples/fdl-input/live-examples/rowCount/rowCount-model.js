import { field, Record } from '@pmcelhaney/fdl';

export function commentType(rows = 4) {
    return field.label('Comments').rowCount(rows);
}
export function createModel(rows = 4) {
    return new Record({ comments: commentType(rows) }, { comments: '' });
}
