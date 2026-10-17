import { optionsView as renderExample } from './options-view.js';
import { ExampleModel } from './options-example-state.js';
import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../fdl-record-inspector';
export class ExampleView extends ExampleModel {
    createRenderRoot() {
        return this;
    }
    clearSelections() {
        return html`<div class="selection-controls">
            ${['assignee', 'asyncAssignee'].map(
                field =>
                    html`<button
                        class="clear-selection"
                        ?disabled=${!this.record.getField(field)}
                        @click=${() => this.record.setField(field, '')}
                        >Clear
                        ${field === 'assignee' ? 'function' : 'async function'}
                        selection</button
                    >`
            )}
        </div>`;
    }
    renderDemo() {
        return html`<p class="try"
                >Change Department; Assignee choices refresh.</p
            >${keyed(this.record.field('asyncAssignee'), renderExample())}${this.clearSelections()}`;
    }
    render() {
        return html`<div class="focused" data-modifier="options"
            ><div class="focused-demo">${this.renderDemo()}</div
            ><fdl-record-inspector
                .record=${this.record}
                .fields=${['department', 'assignee', 'asyncAssignee']}
            ></fdl-record-inspector
        ></div>`;
    }
}
customElements.define('fdl-live-options', ExampleView);
