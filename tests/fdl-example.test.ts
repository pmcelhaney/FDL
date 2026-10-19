import { FdlExample } from '../examples/fdl-input/fdl-example';

afterEach(() => {
    document.body.replaceChildren();
    jest.restoreAllMocks();
});

it('shows the live example and all files inline in fullscreen, then restores the selected tab', async () => {
    // A nested shadow root matches how documentation pages host examples.
    const host = document.createElement('div');
    const container = host.attachShadow({ mode: 'open' });
    const frame = new FdlExample();
    frame.filenames = ['model.ts', 'view.ts'];
    frame.sources = { 'model.ts': 'const count = 1;', 'view.ts': 'render(count);' };
    const input = document.createElement('input');
    input.value = 'preserved';
    frame.append(input);
    container.append(frame);
    document.body.append(host);
    let fullscreenElement: Element | null = null;
    Object.defineProperty(container, 'fullscreenElement', { get: () => fullscreenElement });
    frame.requestFullscreen = jest.fn(async () => {
        fullscreenElement = frame;
        frame.dispatchEvent(new Event('fullscreenchange'));
    });
    Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: jest.fn(async () => {
        fullscreenElement = null;
        frame.dispatchEvent(new Event('fullscreenchange'));
    }) });
    await frame.updateComplete;
    const root = frame.shadowRoot!;
    root.querySelector<HTMLButtonElement>('#example-tab-2')!.click();
    await frame.updateComplete;
    const button = root.querySelector<HTMLButtonElement>('.fullscreen-button')!;
    button.click();
    await frame.updateComplete;
    expect(frame.requestFullscreen).toHaveBeenCalledTimes(1);
    expect(button.textContent).toContain('Exit full screen');
    expect(root.querySelector('.tabs')!.hasAttribute('hidden')).toBe(true);
    expect(root.querySelectorAll('.tab-panel[hidden]')).toHaveLength(0);
    expect(Array.from(root.querySelectorAll('h3')).map(heading => heading.textContent)).toEqual([
        'Interactive example', 'model.ts', 'view.ts',
    ]);
    button.click();
    await frame.updateComplete;
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    expect(root.querySelector('#example-panel-2')!.hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('#example-panel-0')!.hasAttribute('hidden')).toBe(true);
    expect(frame.querySelector('input')).toBe(input);
    expect(input.value).toBe('preserved');
    // Escape/browser exit produces the same fullscreenchange notification.
    button.click();
    await frame.updateComplete;
    fullscreenElement = null;
    frame.dispatchEvent(new Event('fullscreenchange'));
    await frame.updateComplete;
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(root.querySelector('.tabs')!.hasAttribute('hidden')).toBe(false);
});

it('reports a rejected fullscreen request without changing views', async () => {
    const frame = new FdlExample();
    frame.requestFullscreen = jest.fn().mockRejectedValue(new Error('Denied'));
    document.body.append(frame);
    await frame.updateComplete;
    frame.shadowRoot!.querySelector<HTMLButtonElement>('.fullscreen-button')!.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    await frame.updateComplete;
    expect(frame.shadowRoot!.querySelector('[role="status"]')!.textContent).toContain('Full screen is unavailable');
    expect(frame.shadowRoot!.querySelector('.tabs')!.hasAttribute('hidden')).toBe(false);
});
