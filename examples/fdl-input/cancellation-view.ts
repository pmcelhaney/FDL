import { html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import '@pmcelhaney/fdl/lit/fdl-field';

export function cancellationView(
    record: Record<any>,
    fields: string[] = ['status', 'reason']
) {
    return html`${fields.map(field => html`<fdl-field .record=${record} field=${field} .showValidationErrors=${true}></fdl-field>`)}`;
}
