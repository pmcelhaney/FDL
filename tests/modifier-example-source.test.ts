/// <reference types="node" />
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { exampleSource } from '../examples/fdl-input/modifier-example-source';
import { explorerRecipes } from '../examples/fdl-input/fdl-modifier-explorer';
import { tableExampleStyles } from '../examples/fdl-input/table-example-styles';
import { disabledFieldStyles } from '../examples/fdl-input/field-example-styles';

it.each(explorerRecipes.map(recipe => recipe.name))(
    'shows the exact executable model and view files for .%s()',
    name => {
        const source = exampleSource(name);
        const directory = resolve('examples/fdl-input/live-examples', name);
        expect(source.definition).toBe(readFileSync(resolve(directory, source.modelFile), 'utf8'));
        expect(source.ui).toBe(readFileSync(resolve(directory, source.uiFile), 'utf8'));
        expect(source.definition).not.toContain('fdl-modifier-explorer');
        if (!explorerRecipes.find(recipe => recipe.name === name)!.limitation) {
            expect(customElements.get(`fdl-live-${name.toLowerCase()}`)).toBeDefined();
        }
        if (source.styles) {
            expect(source.styles).toBe(readFileSync(resolve(directory, 'example.css'), 'utf8'));
        }
    }
);
it.each(['columnClass', 'cellClass', 'template', 'rowClass'] as const)(
    'uses the displayed %s stylesheet in the live adapter',
    name => expect(tableExampleStyles[name].cssText).toBe(exampleSource(name).styles)
);
it('uses the displayed disabled stylesheet in the live field adapter', () => {
    expect(disabledFieldStyles.cssText).toBe(exampleSource('disabled').styles);
});

import { ExampleModel as RequiredModel } from '../examples/fdl-input/live-examples/required/required-model.js';
import { ExampleModel as ExpenseModel } from '../examples/fdl-input/live-examples/cellClass/cellClass-model.js';

afterEach(() => document.body.replaceChildren());
it('renders the requiredness view using its imported model instance', async () => {
    const demo = document.createElement('fdl-live-required') as any;
    document.body.append(demo);
    await demo.updateComplete;
    expect(demo).toBeInstanceOf(RequiredModel);
    const control = demo.querySelector('fdl-field[field="name"]');
    expect(control.record).toBe(demo.person);
});
it('renders the expense table using its imported model instance', async () => {
    const demo = document.createElement('fdl-live-cellclass') as any;
    document.body.append(demo);
    await demo.updateComplete;
    expect(demo).toBeInstanceOf(ExpenseModel);
    expect(demo.querySelector('fdl-table').recordset).toBe(demo.cellClassRecordset);
});
