import { record } from './hashFunction-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function hashFunctionView() {
    return html`
        <fdl-field .record=${record} field="firstId"></fdl-field>
        <fdl-field .record=${record} field="secondId"></fdl-field>
    `;
}

export function hashComparisonView(hashType) {
    return html`<p class="computed" role="status"
        >Hash comparison:
        ${hashType.valueOf().hashFunction()({ id: record.getField('firstId') }) === hashType.valueOf().hashFunction()({ id: record.getField('secondId') }) ? 'same identity' : 'different identities'}.
        Separate objects match when their IDs match.</p
    >`;
}
