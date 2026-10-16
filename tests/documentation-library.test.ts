/// <reference types="node" />
import '../examples/fdl-input/fdl-modifier-explorer';
import type { FdlModifierExplorer } from '../examples/fdl-input/fdl-modifier-explorer';
import { documentationPages } from '../examples/fdl-input/reference-pages';
import { readdirSync } from 'fs';
import { join } from 'path';

beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
});
afterEach(() => {
    document.body.replaceChildren();
    window.location.hash = '';
});

async function openRoute(route: string) {
    window.location.hash = route;
    const page = document.createElement('fdl-modifier-explorer') as FdlModifierExplorer;
    document.body.append(page);
    await page.updateComplete;
    await Promise.resolve();
    return page;
}

it('includes every document under docs, including architecture decisions', () => {
    function files(directory: string): string[] {
        return readdirSync(directory, { withFileTypes: true }).flatMap(function (entry): string[] {
            const file = join(directory, entry.name);
            return entry.isDirectory() ? files(file) : file.endsWith('.md') ? [file] : [];
        });
    }
    const sourceFiles = files('docs').sort();
    expect(
        documentationPages
            .filter(page => page.file.startsWith('docs/'))
            .map(page => page.file)
            .sort()
    ).toEqual(sourceFiles);
});

it('resolves every reference link and section to a bundled page and heading', () => {
    for (const page of documentationPages) {
        const container = document.createElement('div');
        container.innerHTML = page.html;
        expect(container.querySelectorAll('h1')).toHaveLength(1);
        expect(container.querySelector('h1')?.getAttribute('tabindex')).toBe('-1');
        for (const link of Array.from(
            container.querySelectorAll<HTMLAnchorElement>('a[href^="#reference/"]')
        )) {
            const [route, query] = link.getAttribute('href')!.slice(1).split('?');
            const destination = documentationPages.find(page => page.id === route);
            expect(destination).toBeDefined();
            const section = new URLSearchParams(query).get('section');
            if (section)
                expect(destination!.headings.map(heading => heading.id)).toContain(section);
        }
    }
});

it('opens every bundled reference directly inside the site with its page title', async () => {
    const page = await openRoute('reference');
    for (const reference of documentationPages) {
        window.location.hash = reference.id;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        await page.updateComplete;
        await Promise.resolve();
        expect(page.shadowRoot!.querySelector('.reference-content h1')!.textContent).toBe(
            reference.title
        );
        expect(document.title).toBe(`${reference.title} — FDL`);
        expect(page.shadowRoot!.activeElement).toBe(page.shadowRoot!.querySelector('h1'));
    }
});

it('keeps API cards local and supports section navigation on initial load and history changes', async () => {
    const page = await openRoute('integration');
    const cards = Array.from(
        page.shadowRoot!.querySelectorAll<HTMLAnchorElement>('.integration-reference')
    );
    expect(cards).toHaveLength(6);
    expect(cards.every(link => link.getAttribute('href')!.startsWith('#reference/docs/'))).toBe(
        true
    );
    const route = 'reference/docs/adapter-contract?section=current-limits';
    window.location.hash = route;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await page.updateComplete;
    await Promise.resolve();
    expect(page.shadowRoot!.activeElement?.id).toBe('current-limits');
    page.remove();
    const direct = await openRoute(route);
    expect(direct.shadowRoot!.activeElement?.id).toBe('current-limits');
});
