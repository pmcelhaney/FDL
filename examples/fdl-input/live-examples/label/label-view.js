import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';

export function labelView(record) {
    return html`
        <fdl-field .record=${record} field="expenseType"></fdl-field>
        <fdl-field .record=${record} field="dynamicAmount"></fdl-field>
    `;
}
