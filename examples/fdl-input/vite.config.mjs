import { defineConfig } from 'vite';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const documentation = createRequire(import.meta.url)(
    '../../scripts/documentation-pages.cjs'
);
const directory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    resolve: {
        alias: [
            {
                find: /^@pmcelhaney\/bizallele\/lit$/,
                replacement: resolve(directory, '../../src/lit/index.ts'),
            },
            {
                find: /^@pmcelhaney\/bizallele$/,
                replacement: resolve(directory, '../../src/index.js'),
            },
            {
                find: '@pmcelhaney/bizallele',
                replacement: resolve(directory, '../../src'),
            },
        ],
    },
    plugins: [
        {
            name: 'example-playground-sources',
            resolveId(id) {
                if (id === 'virtual:example-sources') return '\0' + id;
            },
            load(id) {
                if (id !== '\0virtual:example-sources') return;
                const sources = {};
                const context = this;
                function collect(folder, prefix = './') {
                    for (const entry of readdirSync(folder, {
                        withFileTypes: true,
                    })) {
                        if (
                            ['dist', 'node_modules', '.git'].includes(
                                entry.name
                            )
                        )
                            continue;
                        if (entry.isDirectory())
                            collect(
                                resolve(folder, entry.name),
                                prefix + entry.name + '/'
                            );
                        else if (
                            /\.(js|ts|css)$/.test(entry.name) &&
                            !entry.name.endsWith('.d.ts')
                        ) {
                            const path = resolve(folder, entry.name);
                            context.addWatchFile(path);
                            sources[prefix + entry.name] = readFileSync(
                                path,
                                'utf8'
                            );
                        }
                    }
                }
                collect(directory);
                return `export default ${JSON.stringify(sources)}`;
            },
        },
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
                preview: resolve(directory, 'example-preview.html'),
            },
        },
    },
});
