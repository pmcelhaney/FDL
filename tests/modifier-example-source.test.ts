/// <reference types="node" />
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { exampleSource } from '../examples/fdl-input/modifier-example-source';
import { explorerRecipes } from '../examples/fdl-input/fdl-modifier-explorer';
import { FdlTable } from '@pmcelhaney/fdl/lit/fdl-table';
import { FdlField } from '@pmcelhaney/fdl/lit/fdl-field';

it.each(explorerRecipes.map(recipe => recipe.name))(
    'shows the exact executable model and view files for .%s()',
    name => {
        const source = exampleSource(name);
        const directory = resolve('examples/fdl-input/live-examples', source.directory);
        expect(source.definition).toBe(readFileSync(resolve(directory, source.modelFile), 'utf8'));
        expect(source.ui).toBe(readFileSync(resolve(directory, source.uiFile), 'utf8'));
        expect(source.definition).not.toContain('fdl-modifier-explorer');
        if (!explorerRecipes.find(recipe => recipe.name === name)!.limitation) {
            const tag =
                source.directory === 'text-length'
                    ? 'fdl-text-length'
                    : source.directory === 'column-widths'
                      ? 'fdl-column-widths'
                      : `fdl-live-${name.toLowerCase()}`;
            expect(customElements.get(tag)).toBeDefined();
        }
        if (source.styles) {
            expect(source.styles).toBe(readFileSync(resolve(directory, 'example.css'), 'utf8'));
        }
    }
);
it.each(['columnClass', 'cellClass', 'template', 'rowClass'] as const)(
    'uses the displayed %s stylesheet in the live adapter',
    name =>
        expect(FdlTable.styles.cssText.replace(/\s+/g, '')).toContain(
            exampleSource(name).styles.replace(/\s+/g, '')
        )
);
it('uses the displayed disabled stylesheet in the live field adapter', () => {
    expect(FdlField.styles.cssText.replace(/\s+/g, '')).toContain(
        exampleSource('disabled').styles.replace(/\s+/g, '')
    );
});

import { createPerson } from '../examples/fdl-input/live-examples/required/required-model.js';
import { createModel as createExpenses } from '../examples/fdl-input/live-examples/cellClass/cellClass-model.js';

afterEach(() => document.body.replaceChildren());
it('renders the requiredness view using its imported model instance', async () => {
    const demo = document.createElement('fdl-live-required') as any;
    document.body.append(demo);
    await demo.updateComplete;
    expect(demo.person.values).toEqual(createPerson().values);
    const control = demo.querySelector('fdl-field[field="name"]');
    expect(control.record).toBe(demo.person);
});
it('renders the expense table using its imported model instance', async () => {
    const demo = document.createElement('fdl-live-cellclass') as any;
    document.body.append(demo);
    await demo.updateComplete;
    const reference = createExpenses();
    await reference.requestImmediateUpdate();
    expect(demo.cellClassRecordset.allRecords.map((record: any) => record.values)).toEqual(
        reference.allRecords.map(record => record.values)
    );
    expect(demo.querySelector('fdl-table').recordset).toBe(demo.cellClassRecordset);
});
