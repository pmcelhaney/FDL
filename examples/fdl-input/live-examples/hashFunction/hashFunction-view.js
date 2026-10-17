import { record } from './hashFunction-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function hashFunctionView(
    fields = ['firstId', 'secondId'],
    showErrors = false
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${showErrors}></fdl-field>`)}`;
}

export function hashComparisonView(hashType) {
    return html`<p class="computed" role="status"
        >Hash comparison:
        ${hashType.valueOf().hashFunction()({ id: record.getField('firstId') }) === hashType.valueOf().hashFunction()({ id: record.getField('secondId') }) ? 'same identity' : 'different identities'}.
        Separate objects match when their IDs match.</p
    >`;
}
