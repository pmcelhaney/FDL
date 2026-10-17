import { html } from 'lit';
import '../../fdl-field';

export function requiredView(person, showErrors = false) {
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
