import ts from 'typescript';
import { html, render } from 'lit';
import { field, Record, Recordset } from '../src/index';
import '../examples/fdl-input/fdl-column-widths';
import '../examples/fdl-input/fdl-text-length';

afterEach(() => document.body.replaceChildren());

it.each([
    ['fdl-column-widths', 'column-widths', 'rows', 'fdl-table'],
    ['fdl-text-length', 'text-length', 'record', 'fdl-field'],
])(
    'runs the displayed model and view together for %s',
    async (tag, filename, exported, consumer) => {
        const demo = document.createElement(tag) as any;
        document.body.append(demo);
        await demo.updateComplete;
        const frame = demo.shadowRoot.querySelector('fdl-example') as any;
        await frame.updateComplete;
        const model: { [key: string]: any } = {};
        const container = document.createElement('div');
        document.body.append(container);
        const run = (source: string, require: (name: string) => any, exports = {}) => {
            const compiled = ts.transpileModule(source, {
                compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
            }).outputText;
            new Function('require', 'exports', compiled)(require, exports);
        };
        run(
            frame.sources[`${filename}-model.js`],
            name => {
                if (name === '@pmcelhaney/fdl') return { field, Record, Recordset };
                throw new Error(`Unexpected model import: ${name}`);
            },
            model
        );
        run(frame.sources[`${filename}-view.js`], name => {
            if (name === 'lit') return { html, render: (view: any) => render(view, container) };
            if (name === `./${filename}-model.js`) return model;
            if (name === `./${consumer}`) return {};
            throw new Error(`Unexpected view import: ${name}`);
        });
        const control = container.querySelector(consumer) as any;
        await control.updateComplete;
        expect(control.record ?? control.recordset).toBe(model[exported]);
        render(null, container);
    }
);

it('applies numeric width selections to the table and displayed source', async () => {
    const demo = document.createElement('fdl-column-widths') as any;
    document.body.append(demo);
    await demo.updateComplete;
    const maximum = demo.shadowRoot.querySelector('fdl-field[field="maximum"]') as any;
    maximum.record.parseAndSetField('maximum', '320');
    await demo.updateComplete;
    const table = demo.shadowRoot.querySelector('fdl-table') as any;
    expect(table.recordset.column('constrained').maxColumnWidth()).toBe(320);
    const frame = demo.shadowRoot.querySelector('fdl-example') as any;
    await frame.updateComplete;
    expect(frame.sources['column-widths-model.js']).toContain('.maxColumnWidth(320)');
});
