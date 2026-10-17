import { html } from 'lit';
import type { Record as FdlRecord } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';
import '@pmcelhaney/fdl/lit/fdl-record';

export function fieldBuilderView(record: FdlRecord<any>, fieldName: string) {
    return html`<fdl-record .record=${record}>
        <fdl-field field="condition"></fdl-field>
        <fdl-field field=${fieldName}></fdl-field>
    </fdl-record>`;
}
