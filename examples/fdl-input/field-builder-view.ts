import { html } from 'lit';
import type { Record as FdlRecord } from '@pmcelhaney/bizallele';
import '@pmcelhaney/bizallele/lit/fdl-field';
import '@pmcelhaney/bizallele/lit/fdl-record';

export function fieldBuilderView(record: FdlRecord<any>, fieldName: string) {
    return html`<fdl-record .record=${record}>
        <fdl-field field="condition"></fdl-field>
        <fdl-field field=${fieldName}></fdl-field>
    </fdl-record>`;
}
