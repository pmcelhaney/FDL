import { html } from 'lit';
import '../../fdl-field';
export function hashFunctionView(
    record,
    fields = ['firstId', 'secondId'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}

export function hashComparisonView(record, hashType) {
    return html`<p class="computed" role="status"
        >Hash comparison:
        ${hashType.valueOf().hashFunction()({ id: record.getField('firstId') }) === hashType.valueOf().hashFunction()({ id: record.getField('secondId') }) ? 'same identity' : 'different identities'}.
        Separate objects match when their IDs match.</p
    >`;
}
