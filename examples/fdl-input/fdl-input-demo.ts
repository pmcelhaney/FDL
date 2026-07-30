import { LitElement, css, html } from 'lit';
import './fdl-modifier-catalog';

export class FdlInputDemo extends LitElement {
    render() {
        return html`
            <main>
                <header class="hero">
                    <img class="brand-wordmark" src="./d-cut-02.png" alt="FDL" />
                    <p class="eyebrow">Field Definition Language</p>
                    <h1>Forms that adapt to the work.</h1>
                    <p class="lede">
                        Define meaning once, then let forms, tables, and other consumers interpret
                        the same rules consistently.
                    </p>
                    <p class="rule-note"><span class="rule-dot"></span> Small definitions. Consistent behavior.</p>
                    <nav aria-label="Demo sections">
                        <a href="#cookbook">Modifier cookbook</a>
                    </nav>
                </header>

                <section id="cookbook" class="reference">
                    <fdl-modifier-catalog></fdl-modifier-catalog>
                </section>
            </main>
        `;
    }

    static styles = css`
        :host { display: block; min-height: 100vh; color: #172033; background: #f7f8fb; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        main { max-width: 72rem; margin: 0 auto; padding: 0 1.25rem 5rem; }
        .hero { padding: 4.5rem 0 4rem; max-width: 52rem; }
        .brand-wordmark { display: block; width: 8.75rem; height: auto; margin-bottom: 2.5rem; }
        .eyebrow { margin: 0 0 .6rem; color: #7657ff; font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        h1, h2, h3, p { margin-top: 0; } h1 { max-width: 42rem; margin-bottom: 1rem; color: #10233f; font-size: clamp(2.7rem, 7vw, 5.4rem); font-weight: 750; letter-spacing: -.065em; line-height: .98; }
        h2 { margin-bottom: .6rem; color: #10233f; font-size: clamp(2rem, 4vw, 3rem); font-weight: 750; letter-spacing: -.05em; } h3 { font-size: .9rem; margin-bottom: .35rem; }
        .lede, .section-heading > p:not(.eyebrow) { color: #586174; font-size: 1.1rem; line-height: 1.65; } .rule-note { display: flex; align-items: center; gap: .55rem; color: #10233f; font-size: .88rem; font-weight: 750; margin: 1.5rem 0 0; } .rule-dot { width: .55rem; height: .55rem; border-radius: 50%; background: #ff695b; } nav { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: 1.7rem; } nav a { border: 1px solid #d6daea; border-radius: .45rem; color: #343b53; padding: .5rem .8rem; text-decoration: none; } nav a:hover { border-color: #7657ff; color: #7657ff; }
        code { color: #7657ff; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .88em; }
        .reference { padding: 3.5rem 0 0; border-top: 1px solid #dfe3ee; }
        @media (max-width: 42rem) { .hero { padding: 3.5rem 0 2.5rem; } }
    `;
}

customElements.define('fdl-input-demo', FdlInputDemo);
