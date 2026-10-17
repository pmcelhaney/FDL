import { css, html } from 'lit';
import type { Record } from '@pmcelhaney/fdl';
import { exampleTheme } from './example-theme';
import '@pmcelhaney/fdl/lit/fdl-field';

export function deliveryView(record: Record<any>) {
    const pickup = record.getField('fulfillment') === 'pickup';
    return html`
        <div class="editor">
            <fdl-field .record=${record} field="fulfillment"></fdl-field>
            <fdl-field .record=${record} field="address"></fdl-field>
            <fdl-field .record=${record} field="pickupZip"></fdl-field>
            <fdl-field
                .record=${record}
                field="store"
                select-prompt="Select a store"
            ></fdl-field>
            ${
                pickup
                    ? html`<p class="sample-note">
                          Sample store lookup (2-second delay): try ZIP code
                          <strong>28202</strong> or <strong>10001</strong>.
                      </p>`
                    : ''
            }
        </div>
    `;
}

export const deliveryStyles = css`
    :host {
        display: block;
    }
    * {
        box-sizing: border-box;
    }
    .editor {
        padding: 20px;
        border: 1px solid var(--example-border);
        border-radius: var(--example-radius);
        background: white;
    }
    .sample-note {
        font-size: 0.875rem;
        color: #475569;
    }
    .editor fdl-field:last-child {
        margin-bottom: 0;
    }
    fdl-field {
        --field-label-width: 100%;
        --field-control-width: 100%;
    }
    @media (max-width: 480px) {
        .editor {
            padding: 16px;
        }
    }
    ${exampleTheme}
`;
