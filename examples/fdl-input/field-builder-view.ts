import { html } from 'lit';
import type { Record as FdlRecord } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';

export function fieldBuilderView(record: FdlRecord<any>, fieldName: string) {
    return html`
        <fdl-field .record=${record} field="condition"></fdl-field>
        <fdl-field
            .record=${record}
            field=${fieldName}
            .showValidationErrors=${true}
        ></fdl-field>
    `;
}
