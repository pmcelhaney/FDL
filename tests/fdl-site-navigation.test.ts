import '../examples/fdl-input/fdl-modifier-explorer';
import type { FdlModifierExplorer } from '../examples/fdl-input/fdl-modifier-explorer';

beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
});
afterEach(() => {
    document.body.replaceChildren();
    window.location.hash = '';
});
const open = async () => {
    window.location.hash = 'home';
    const page = document.createElement('fdl-modifier-explorer') as FdlModifierExplorer;
    document.body.append(page);
    await page.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 0));
    return page;
};
it('skips directly to main content without changing the current route', async () => {
    const page = await open();
    const root = page.shadowRoot!;
    expect(root.querySelector('a')).toBe(root.querySelector('.skip-link'));
    root.querySelector<HTMLAnchorElement>('.skip-link')!.click();
    expect(root.activeElement).toBe(root.querySelector('main'));
    expect(window.location.hash).toBe('#home');
});
it('focuses the destination heading after ordinary hash navigation and browser history changes', async () => {
    const page = await open();
    const root = page.shadowRoot!;
    for (const route of ['how-it-works', 'quickstart', 'home']) {
        window.location.hash = route;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        await page.updateComplete;
        await Promise.resolve();
        expect(root.activeElement).toBe(root.querySelector('h1'));
        expect(root.querySelector('h1')!.textContent).toBe(
            route === 'home'
                ? 'Field Definition Library'
                : route === 'quickstart'
                  ? 'Your first form'
                  : 'How it Works'
        );
    }
});

it('ends Home with the first-form call to action', async () => {
    const page = await open();
    const root = page.shadowRoot!;
    const article = root.querySelector('.site-page')!;
    const cta = article.querySelector<HTMLAnchorElement>('.home-cta a')!;
    expect(article.lastElementChild).toBe(cta.parentElement);
    expect(cta.classList.contains('primary')).toBe(true);
    expect(cta.textContent).toContain('Build your first form');
    expect(article.textContent).not.toContain('Try the delivery example');
    cta.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await page.updateComplete;
    expect(window.location.hash).toBe('#quickstart');
    expect(root.querySelector('h1')!.textContent).toBe('Your first form');
});
