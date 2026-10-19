import { LitElement, css, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import type Record from '../record.js';
import { RecordRequest } from './record-context';

/** Supplies one record to descendant Bizallele consumers, including across shadow roots. */
export class FdlRecord extends LitElement {
    static styles = css`
        :host {
            display: contents;
        }
    `;

    @property({ attribute: false })
    record?: Record<any>;

    private readonly consumers = new Set<(record: Record<any> | undefined) => void>();

    constructor() {
        super();
        this.addEventListener('fdl-record-request', event => {
            if (!(event instanceof RecordRequest)) return;
            event.stopPropagation();
            this.consumers.add(event.receive);
            event.subscribe(() => this.consumers.delete(event.receive));
            event.receive(this.record);
        });
    }

    protected updated(changed: PropertyValues<this>) {
        if (changed.has('record')) {
            for (const receive of this.consumers) receive(this.record);
        }
    }

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define('fdl-record', FdlRecord);
