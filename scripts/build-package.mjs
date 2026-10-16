import { cpSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

rmSync(new URL('../dist/', import.meta.url), { recursive: true, force: true });
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.build.json'], {
    cwd: new URL('../', import.meta.url),
    stdio: 'inherit',
});
// Preserve the public type-only exports maintained alongside the runtime entry.
cpSync(
    new URL('../src/index.d.ts', import.meta.url),
    new URL('../dist/index.d.ts', import.meta.url)
);
