import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type Record from '../record.js';

/** Internal subscription protocol; composed requests cross component shadow roots. */
export class RecordRequest extends Event {
    constructor(
        public readonly receive: (record: Record<any> | undefined) => void,
        public readonly subscribe: (unsubscribe: () => void) => void
    ) {
        super('fdl-record-request', { bubbles: true, composed: true });
    }
}

/** Shared record binding for field adapters and other record consumers. */
export class RecordElement extends LitElement {
    private explicitRecord?: Record<any>;
    private inheritedRecord?: Record<any>;
    private unsubscribeRecord?: () => void;

    @property({ attribute: false })
    get record(): Record<any> | undefined {
        return this.explicitRecord ?? this.inheritedRecord;
    }

    set record(value: Record<any> | undefined) {
        const previous = this.record;
        this.explicitRecord = value;
        this.requestUpdate('record', previous);
    }

    connectedCallback() {
        super.connectedCallback();
        const previous = this.record;
        this.inheritedRecord = undefined;
        this.dispatchEvent(
            new RecordRequest(
                record => {
                    const oldRecord = this.record;
                    this.inheritedRecord = record;
                    this.requestUpdate('record', oldRecord);
                },
                unsubscribe => {
                    this.unsubscribeRecord = unsubscribe;
                }
            )
        );
        this.requestUpdate('record', previous);
    }

    disconnectedCallback() {
        this.unsubscribeRecord?.();
        this.unsubscribeRecord = undefined;
        super.disconnectedCallback();
    }
}
