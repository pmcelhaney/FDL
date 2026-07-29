import { LitElement, css, html } from 'lit';
import './fdl-modifier-catalog';

export class FdlInputDemo extends LitElement {
    render() {
        return html`
            <main>
                <header class="hero">
                    <p class="eyebrow">Digital FDL · field-type modifiers</p>
                    <h1>Forms that adapt to the work.</h1>
                    <p class="lede">
                        Three realistic workflows show how a field definition can control input,
                        validation, conditional behavior, and data-table presentation.
                    </p>
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
        :host { display: block; min-height: 100vh; color: #172033; background: #f6f8fc; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        main { max-width: 72rem; margin: 0 auto; padding: 0 1.25rem 5rem; }
        .hero { padding: 5.5rem 0 4rem; max-width: 48rem; }
        .eyebrow { margin: 0 0 .6rem; color: #5b52d6; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        h1, h2, h3, p { margin-top: 0; } h1 { max-width: 42rem; margin-bottom: 1rem; color: #111a31; font-family: Georgia, serif; font-size: clamp(2.7rem, 7vw, 5.4rem); font-weight: 500; letter-spacing: -.055em; line-height: .98; }
        h2 { margin-bottom: .6rem; color: #111a31; font-family: Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; letter-spacing: -.035em; } h3 { font-size: .9rem; margin-bottom: .35rem; }
        .lede, .section-heading > p:not(.eyebrow) { color: #586174; font-size: 1.1rem; line-height: 1.65; } nav { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: 1.7rem; } nav a { border: 1px solid #d6daea; border-radius: 100px; color: #343b53; padding: .5rem .8rem; text-decoration: none; }
        .scenario { padding: 3.5rem 0; border-top: 1px solid #dfe3ee; } .section-heading { max-width: 42rem; margin-bottom: 1.5rem; }
        .card, .table-card { box-sizing: border-box; border: 1px solid #dfe3ee; border-radius: 1rem; background: white; box-shadow: 0 12px 34px rgba(34, 45, 78, .06); padding: 1.5rem; } .field { margin-bottom: .8rem; } .field:last-of-type { margin-bottom: 0; }
        .actions { display: flex; gap: .6rem; margin-top: 1.25rem; } button { border: 0; border-radius: .5rem; background: #4438c7; color: #fff; cursor: pointer; font: inherit; font-weight: 700; padding: .7rem 1rem; } button.secondary { background: #eceef8; color: #303850; } .errors { color: #b42318; font-size: .85rem; margin: -.45rem 0 .65rem 9rem; } .success { color: #067647; font-weight: 700; margin: 1rem 0 0; } .hint { color: #6b7384; font-size: .82rem; margin: .6rem 0 0 9rem; }
        .callout { margin-top: 1rem; color: #636b7b; font-size: .83rem; line-height: 1.6; } code { color: #4539bf; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .88em; } .callout code { color: #5d6474; }
        .code-panel { margin-top: 1.25rem; border: 1px solid #dfe3ee; border-radius: .75rem; background: #101629; color: #d8def0; } .code-panel summary { cursor: pointer; color: #d8def0; font-size: .85rem; font-weight: 700; padding: .8rem 1rem; } .code-panel pre { overflow-x: auto; margin: 0; border-top: 1px solid #29314a; padding: 1rem; } .code-panel code { color: #d8def0; font-size: .76rem; line-height: 1.65; white-space: pre; }
        .table-card { overflow-x: auto; padding: .5rem; } table { width: 100%; border-collapse: collapse; min-width: 38rem; } th, td { border-bottom: 1px solid #edf0f5; padding: 1rem; text-align: left; } th { color: #737b8b; font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; } td { font-size: .94rem; } .amount { text-align: right; font-variant-numeric: tabular-nums; } .numeric { background: #f7f8ff; color: #34308f; } .high-value { background: #fff4d6; color: #8a4b00; font-weight: 800; } .status { border-radius: 100px; background: #edf0f6; color: #485065; font-size: .78rem; font-weight: 800; padding: .3rem .55rem; white-space: nowrap; } .status.danger { background: #ffebe9; color: #b42318; } .status.warning { background: #fff2d8; color: #a15c00; } .disputed-row { background: #fffdf7; box-shadow: inset .25rem 0 #d89b24; } tfoot td { border: 0; color: #182136; font-weight: 800; }
        .reference { padding: 3.5rem 0 0; border-top: 1px solid #dfe3ee; }
        @media (max-width: 42rem) { .hero { padding: 3.5rem 0 2.5rem; } .scenario { padding: 2.5rem 0; } .card { padding: 1rem; } .errors, .hint { margin-left: 0; } }
    `;
}

customElements.define('fdl-input-demo', FdlInputDemo);
