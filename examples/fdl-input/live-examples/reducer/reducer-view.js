import { record } from './reducer-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';
export function reducerView() {
    return html`
        <fdl-field .record=${record} field="firstAmount"></fdl-field>
        <fdl-field .record=${record} field="secondAmount"></fdl-field>
        <fdl-field .record=${record} field="thirdAmount"></fdl-field>
    `;
}

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export function aggregateView(reducerType) {
    return html`<p class="computed" role="status"
        >Sum:
        ${currency.format(reducerType.valueOf().aggregate([record.getField('firstAmount'), record.getField('secondAmount'), record.getField('thirdAmount')]))}</p
    >`;
}
