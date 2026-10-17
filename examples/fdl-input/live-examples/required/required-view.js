import { person } from './required-model.js';
import { html } from 'lit';
import '@pmcelhaney/fdl/lit/fdl-field';

export function requiredView(showErrors = false) {
    return html`
        <fdl-field
            .record=${person}
            field="name"
            .showValidationErrors=${showErrors}
        ></fdl-field>
        <fdl-field .record=${person} field="followUp"></fdl-field>
        <fdl-field
            .record=${person}
            field="followUpNotes"
            .showValidationErrors=${showErrors}
        ></fdl-field>
    `;
}
