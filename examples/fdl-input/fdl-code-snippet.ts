import { LitElement, css, html, svg } from 'lit';

/** Adds a copy control without changing the snippet's text or highlighting. */
export class FdlCodeSnippet extends LitElement {
    static properties = {
        status: { state: true },
    };

    private status = '';
    private resetTimer?: ReturnType<typeof setTimeout>;

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this.resetTimer);
    }

    private async copy() {
        const source = this.querySelector('code') ?? this.querySelector('pre');
        if (!source) return;
        clearTimeout(this.resetTimer);
        try {
            await navigator.clipboard.writeText(source.textContent ?? '');
            this.status = 'Copied!';
        } catch {
            this.status = 'Copy failed. Select and copy the code manually.';
        }
        this.resetTimer = setTimeout(() => {
            this.status = '';
        }, 2500);
    }

    render() {
        const copied = this.status === 'Copied!';
        return html`<slot></slot>
            <button
                type="button"
                aria-label="Copy code"
                title=${this.status || 'Copy code'}
                class=${copied ? 'copied' : ''}
                @click=${this.copy}
            >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                    ${
                        copied
                            ? svg`<path d="m3 8 3 3 7-7" />`
                            : svg`<rect
                                      x="5.5"
                                      y="5.5"
                                      width="8"
                                      height="8"
                                      rx="1.5"
                                  />
                                  <path
                                      d="M10.5 3.5v-1a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1"
                                  />`
                    }
                </svg>
            </button>
            <span role="status">${this.status}</span>`;
    }

    static styles = css`
        :host {
            display: block;
            position: relative;
            min-width: 0;
        }
        ::slotted(pre) {
            padding-right: 56px;
        }
        button {
            position: absolute;
            top: 8px;
            right: 8px;
            display: grid;
            place-items: center;
            width: 32px;
            height: 32px;
            padding: 7px;
            border: 1px solid #64748b;
            border-radius: 6px;
            background: #1e293b;
            color: #e2e8f0;
            cursor: pointer;
            opacity: 0;
        }
        :host(:hover) button,
        :host(:focus-within) button,
        button.copied {
            opacity: 1;
        }
        button:hover {
            background: #334155;
        }
        button:focus-visible {
            outline: 2px solid #60a5fa;
            outline-offset: 2px;
        }
        button.copied {
            color: #86efac;
            border-color: #86efac;
        }
        svg {
            width: 16px;
            height: 16px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        [role='status'] {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
        }
        @media (hover: none), (pointer: coarse) {
            button {
                opacity: 1;
            }
        }
        @media (forced-colors: active) {
            button {
                border-color: ButtonText;
                color: ButtonText;
                background: ButtonFace;
            }
        }
        @media print {
            button {
                display: none;
            }
        }
    `;
}

customElements.define('fdl-code-snippet', FdlCodeSnippet);
