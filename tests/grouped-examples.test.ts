/// <reference types="node" />
import '../examples/fdl-input/fdl-column-widths';
import '../examples/fdl-input/fdl-text-length';

afterEach(() => document.body.replaceChildren());

it.each([
    ['fdl-column-widths', 'column-widths'],
    ['fdl-text-length', 'text-length'],
])('shows the executable files for %s', async (tag, filename) => {
    const demo = document.createElement(tag) as any;
    document.body.append(demo);
    await demo.updateComplete;
    const frame = demo.shadowRoot.querySelector('fdl-example') as any;
    const fs = require('fs');
    const path = require('path');
    for (const file of frame.filenames) {
        expect(frame.sources[file]).toBe(
            fs.readFileSync(
                path.resolve('examples/fdl-input/live-examples', filename, file),
                'utf8'
            )
        );
    }
});

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
    expect(frame.sources['column-widths-model.js']).toContain(
        ".maxColumnWidth(() => settings.getField('maximum'))"
    );
});
