import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import type { Record as FdlRecord } from '../../src/index';
import { recordSummary } from './model-summary';
import './fdl-field';

export function fieldBuilderView(record: FdlRecord<any>, fieldName: string) {
    return html`${keyed(
        record,
        html`
            <fdl-field .record=${record} field="condition"></fdl-field>
            <fdl-field
                .record=${record}
                field=${fieldName}
                .showValidationErrors=${true}
            ></fdl-field>
        `
    )}${recordSummary(record, [fieldName])}`;
}
