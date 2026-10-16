/** @jest-environment node */
const { execFileSync } = require('child_process');
const { mkdtempSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

it('packs the declared runtime and type entry points, including documented adapter subpaths', () => {
    const destination = mkdtempSync(join(tmpdir(), 'fdl-package-test-'));
    try {
        const [archive] = JSON.parse(
            execFileSync(
                'npm',
                [
                    'pack',
                    '--json',
                    '--pack-destination',
                    destination,
                    '--cache',
                    join(destination, 'cache'),
                ],
                {
                    cwd: process.cwd(),
                    encoding: 'utf8',
                    stdio: ['ignore', 'pipe', 'pipe'],
                }
            )
        );
        const files = new Set(archive.files.map(file => file.path));
        const manifest = require('../package.json');
        expect(files.has(manifest.main)).toBe(true);
        expect(files.has(manifest.types)).toBe(true);
        expect(files.has(manifest.exports['.'].default.replace(/^\.\//, ''))).toBe(true);
        expect(files.has(manifest.exports['.'].types.replace(/^\.\//, ''))).toBe(true);
        for (const module of ['form-element', 'example-recordset']) {
            expect(files.has(`dist/${module}.js`)).toBe(true);
            expect(files.has(`dist/${module}.d.ts`)).toBe(true);
        }
    } finally {
        rmSync(destination, { recursive: true, force: true });
    }
}, 60000);
