import type { FdlExample } from '../examples/fdl-input/fdl-example';
import type { FdlDeliveryExperiment } from '../examples/fdl-input/fdl-delivery-experiment';
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

it('starts the delivery experiment without changing the route', async () => {
    const page = await open();
    const root = page.shadowRoot!;
    const example = root.querySelector<HTMLElement>('#delivery-example')!;
    root.querySelector<HTMLButtonElement>('.home-actions button')!.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(root.activeElement).toBe(example);
    expect(example.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(window.location.hash).toBe('#home');
    expect(root.querySelector('.site-page a[href="#learn"]')).not.toBeNull();
});

it.each(['closed', 'source', 'interactive'])(
    'reveals the delivery controls from %s state and preserves edited values',
    async state => {
        const page = await open();
        const root = page.shadowRoot!;
        const demo = root.querySelector<FdlDeliveryExperiment>('#delivery-example')!;
        await demo.updateComplete;
        const frame = demo.shadowRoot!.querySelector<FdlExample>('fdl-example')!;
        await frame.updateComplete;
        const form = demo.shadowRoot!.querySelector('delivery-form') as any;
        await form.updateComplete;
        const field = form.shadowRoot.querySelector('fdl-field[field="address"]') as any;
        await field.updateComplete;
        const input = field.shadowRoot.querySelector('input') as HTMLInputElement;
        input.value = '99 Maple Road';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await form.updateComplete;
        const details = frame.shadowRoot!.querySelector('details')!;
        if (state === 'closed') details.open = false;
        if (state === 'source') {
            frame.shadowRoot!.querySelector<HTMLButtonElement>('#example-tab-1')!.click();
            await frame.updateComplete;
            expect(frame.shadowRoot!.querySelector<HTMLElement>('#example-panel-0')!.hidden).toBe(true);
        }
        root.querySelector<HTMLButtonElement>('.home-actions button')!.click();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(details.open).toBe(true);
        expect(frame.shadowRoot!.querySelector('#example-tab-0')!.getAttribute('aria-selected')).toBe('true');
        expect(frame.shadowRoot!.querySelector<HTMLElement>('#example-panel-0')!.hidden).toBe(false);
        expect(root.activeElement).toBe(demo);
        expect(demo.shadowRoot!.querySelector('delivery-form')).toBe(form);
        expect(field.record.getField('address')).toBe('99 Maple Road');
        expect(input.value).toBe('99 Maple Road');
        expect(window.location.hash).toBe('#home');
    }
);
