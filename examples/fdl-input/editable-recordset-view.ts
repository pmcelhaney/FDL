import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { Record } from '@pmcelhaney/fdl';
import { createShipments, shipmentCharge } from './editable-recordset-model';
import '@pmcelhaney/fdl/lit/fdl-field';
export function editableRecordsetView(
    shipments: ReturnType<typeof createShipments>,
    selected: Record<any> | undefined,
    onSelect: (row: Record<any>) => void
) {
    return html`<table
        ><caption>Editable shipments — use Tab to move between controls</caption
        ><thead
            ><tr
                ><th>Shipment</th><th>Quantity</th><th>Unit price</th
                ><th>Status</th><th>Hold reason</th><th>Charge</th
                ><th>Validation</th></tr
            ></thead
        ><tbody>
            ${repeat(
                shipments.currentPage,
                row => row,
                row =>
                    html`<tr
                        ><th
                            ><button
                                @click=${() => onSelect(row)}
                                aria-pressed=${selected === row}
                                >${row.getField('id')}</button
                            ></th
                        >
                        ${(['quantity', 'unitPrice', 'status', 'reason'] as const).map(name => html`<td><fdl-field .record=${row} field=${name} .showValidationErrors=${true}></fdl-field></td>`)}
                        <td class="numeric"
                            >${shipmentCharge(row).toFixed(2)}</td
                        ><td
                            >${row.isValid() ? 'Valid' : row.readableRecordErrors().join('. ')}</td
                        ></tr
                    >`
            )}
        </tbody></table
    >`;
}
export function shipmentDetailView(record: Record<any>) {
    return html`<fdl-field
            .record=${record}
            field="quantity"
            .showValidationErrors=${true}
        ></fdl-field
        ><fdl-field
            .record=${record}
            field="reason"
            .showValidationErrors=${true}
        ></fdl-field>`;
}
