import { FdlCodeSnippet } from '../examples/fdl-input/fdl-code-snippet';

describe('documentation code copying', () => {
    let snippet: FdlCodeSnippet;
    let writeText: jest.Mock;

    beforeEach(async () => {
        writeText = jest.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText },
        });
        snippet = new FdlCodeSnippet();
        snippet.innerHTML =
            '<pre><code><span>const</span> value = &quot;&lt;test&gt;&quot;;\n  run(value);</code></pre>';
        document.body.append(snippet);
        await snippet.updateComplete;
    });

    afterEach(() => {
        snippet.remove();
    });

    async function copy() {
        snippet.shadowRoot!.querySelector('button')!.click();
        await new Promise(resolve => setTimeout(resolve, 0));
        await snippet.updateComplete;
    }

    it('copies plain source with whitespace intact and announces success', async () => {
        await copy();
        expect(writeText).toHaveBeenCalledWith('const value = "<test>";\n  run(value);');
        expect(snippet.shadowRoot!.querySelector('[role="status"]')!.textContent).toBe('Copied!');
        expect(snippet.shadowRoot!.querySelector('button')!.classList.contains('copied')).toBe(
            true
        );
    });

    it('reads the current snippet on every click, including plain preformatted text', async () => {
        await copy();
        snippet.innerHTML = '<pre>{\n  "count": 2\n}</pre>';
        await copy();
        expect(writeText).toHaveBeenLastCalledWith('{\n  "count": 2\n}');
    });

    it('announces clipboard errors and allows a retry', async () => {
        writeText.mockRejectedValueOnce(new Error('Permission denied'));
        await copy();
        expect(snippet.shadowRoot!.querySelector('[role="status"]')!.textContent).toContain(
            'Copy failed'
        );
        expect(snippet.shadowRoot!.querySelector('button')!.classList.contains('copied')).toBe(
            false
        );
        await copy();
        expect(snippet.shadowRoot!.querySelector('[role="status"]')!.textContent).toBe('Copied!');
    });
});
