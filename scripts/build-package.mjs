import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
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

// TypeScript resolves index.js to the hand-maintained index.d.ts and skips
// emitting its runtime entry. Compile that entry explicitly, preserving the
// same module format and target as the rest of the package.
const config = ts.readConfigFile(
    new URL('../tsconfig.build.json', import.meta.url).pathname,
    ts.sys.readFile
);
const { options } = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    new URL('../', import.meta.url).pathname
);
const entry = ts.transpileModule(
    readFileSync(new URL('../src/index.js', import.meta.url), 'utf8'),
    {
        fileName: 'index.js',
        compilerOptions: options,
    }
);
writeFileSync(new URL('../dist/index.js', import.meta.url), entry.outputText);
