import { defineConfig } from 'vite';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const documentation = createRequire(import.meta.url)('../../scripts/documentation-pages.cjs');
const directory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        {
            name: 'fdl-documentation',
            resolveId(id) {
                if (id === 'virtual:fdl-documentation') return '\0' + id;
            },
            load(id) {
                if (id !== '\0virtual:fdl-documentation') return;
                const pages = documentation.loadDocumentation();
                for (const page of pages)
                    this.addWatchFile(resolve(directory, '../..', page.file));
                return `export default ${JSON.stringify(pages)}`;
            },
        },
    ],
    build: {
        rollupOptions: {
            input: {
                home: resolve(directory, 'index.html'),
            },
        },
    },
});
