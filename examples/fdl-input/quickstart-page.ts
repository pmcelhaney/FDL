import './fdl-code-snippet';
import { html } from 'lit';
import { highlightJavaScript } from './highlight-javascript';

export const firstFormSource = `import { html, render } from 'lit';
import { field, Record } from '@pmcelhaney/fdl';
import FormElement from '@pmcelhaney/fdl/form-element';

// Register a local adapter. Its styles and control semantics belong here.
class AccountField extends FormElement {}
customElements.define('account-field', AccountField);

const account = new Record(
    {
        name: field.label('Account name').required(),
        country: field.label('Country code').defaultValue('US'),
        taxId: field
            .label('Tax ID')
            .required(record => record.getField('country') !== 'US'),
    },
    { name: '', country: 'US', taxId: '' }
);
let checked = false;
const root = document.getElementById('app') || document.body;
const update = () =>
    render(
        html\`
            <account-field
                .record=\${account}
                field="name"
                .showValidationErrors=\${checked}
            ></account-field>
            <account-field .record=\${account} field="country"></account-field>
            <account-field
                .record=\${account}
                field="taxId"
                .showValidationErrors=\${checked}
            ></account-field>
            <button
                @click=\${() => {
                    checked = true;
                    update();
                }}
            >
                Check account
            </button>
            <p role="status">
                \${
                    checked
                        ? account.isValid()
                            ? 'Valid.'
                            : account.readableRecordErrors().join('. ')
                        : 'Not checked yet.'
                }
            </p>
        \`,
        root
    );
account.addEventListener('change', update);
update();`;

export function renderQuickstart() {
    return html`<article class="site-page"
        ><h1 tabindex="-1">Your first form</h1>
        <p class="description"
            >Install the model, register an adapter, and display your first
            validation error.</p
        >
        <p>You’ll build an account form where Name is required and changing
            Country code from US to CA makes Tax ID required. Check the empty
            form, fill the required values, and watch it become valid.</p>
        <h2>Create a local application</h2>
        <p>Start with a fresh checkout so the package and this example use the
            same API. Build an installable package, then create a separate
            application beside the checkout. Lit supplies the example adapter.</p>
        <fdl-code-snippet><pre class="code"><code>git clone https://github.com/pmcelhaney/FDL.git
cd FDL
npm install
npm pack
cd ..
mkdir fdl-first-form
cd fdl-first-form
npm init -y
npm install ../FDL/pmcelhaney-fdl-0.0.1.tgz lit
npm install --save-dev vite@5.4.21 typescript@4.6.4</code></pre></fdl-code-snippet>
        <p><code>npm pack</code> builds the JavaScript and type declarations.
            The archive name above matches this checkout’s package version,
            <code>0.0.1</code>. If that version changes, use the archive name
            printed by <code>npm pack</code>.</p>
        <p>Create an <code>index.html</code> with the following body and save
            the complete script below as <code>main.ts</code> beside it. Add
            the <code>tsconfig.json</code> below, then run <code>npx vite</code>
            and open the local URL it prints. The installed package contains
            compiled JavaScript; your application’s TypeScript is handled by Vite.</p>
        <fdl-code-snippet><pre class="code"><code>&lt;div id="app"&gt;&lt;/div&gt;
&lt;script type="module" src="/main.ts"&gt;&lt;/script&gt;</code></pre></fdl-code-snippet>
        <fdl-code-snippet><pre
            class="code"
        ><code>${highlightJavaScript(firstFormSource)}</code></pre></fdl-code-snippet>
        <h3>tsconfig.json</h3>
        <fdl-code-snippet><pre class="code"><code>{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "types": [],
    "noEmit": true
  },
  "include": ["main.ts"]
}</code></pre></fdl-code-snippet>
        <p
            >Run <code>npx tsc --noEmit</code> to type-check this consumer
            independently of the documentation site.</p
        >
        <p
            >Press Check account with an empty name to expose its error. Enter a
            name, then change Country code to CA: Tax ID becomes required. Enter
            it and check again. Initial values are explicit;
            <code>defaultValue()</code> applies when clearing the record, and
            does not replace constructor values.</p
        >
        <h2>Use the modifier examples in this repository</h2>
        <p
            >The model and view snippets on modifier pages run inside this
            repository’s example environment. Their <code>./fdl-field</code> and
            <code>./fdl-table</code> imports refer to components in
            <code>examples/fdl-input/</code>, including their relative helpers
            and styles. They are not package exports or extra files generated by
            the snippets. Run <code>npm install</code> and
            <code>npm run docs:dev</code> in the checkout to explore them. To
            move an example into another app, supply its adapter and
            dependencies or use the complete adapter registration above for
            single fields.</p
        >
        <h2>Integrate your component stack</h2>
        <p
            >The supplied adapter uses Lit. A React design system needs an
            integration that subscribes to Record changes, sends edits through
            <code>parseAndSetField()</code>, and maps field state to the
            existing components. Keep the field rules; implement that semantic
            integration in your component layer. Read
            <a href="#integration">the adapter and API contracts</a> for state
            mapping, accessibility checks, and current limits.</p
        >
        <p
            >Your application owns submission, routing, persistence,
            server-error mapping, and when errors are shown. The example adapter
            displays synchronous model validation; it does not await
            asynchronous validators or manage pending server requests. Submit
            Record data explicitly: shadow-root controls do not provide
            application form submission.</p
        >
        <p
            >Next: <a href="#required">conditional requiredness</a>,
            <a href="#options">option lists</a>,
            <a href="#formatter">formatting</a>, and
            <a href="#how-it-works">the model and component boundary</a>.</p
        >
    </article>`;
}
