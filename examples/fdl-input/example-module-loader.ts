import ts from 'typescript';

/** A fresh module cache per preview keeps edited models and their views together. */
export function createExampleLoader(
    sources: Record<string, string>,
    external: Record<string, unknown>
) {
    const cache = new Map<string, { exports: any }>();

    function resolve(specifier: string, importer: string) {
        const parts = importer.split('/');
        parts.pop();
        for (const part of specifier.split('/')) {
            if (part === '..') parts.pop();
            else if (part !== '.') parts.push(part);
        }
        const path = parts.join('/');
        const found = [path, `${path}.ts`, `${path}.js`].find(
            candidate => candidate in sources
        );
        if (!found)
            throw new Error(`Cannot find ${specifier} imported by ${importer}`);
        return found;
    }

    function load(path: string): any {
        if (cache.has(path)) return cache.get(path)!.exports;
        const source = sources[path];
        if (source === undefined)
            throw new Error(`Source unavailable: ${path}`);
        const result = ts.transpileModule(source, {
            fileName: path,
            reportDiagnostics: true,
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020,
                esModuleInterop: true,
                experimentalDecorators: true,
                useDefineForClassFields: false,
            },
        });
        const errors =
            result.diagnostics?.filter(
                diagnostic =>
                    diagnostic.category === ts.DiagnosticCategory.Error
            ) ?? [];
        if (errors.length) {
            throw new Error(
                errors
                    .map(diagnostic => {
                        const position =
                            diagnostic.file && diagnostic.start !== undefined
                                ? diagnostic.file.getLineAndCharacterOfPosition(
                                      diagnostic.start
                                  )
                                : undefined;
                        return `${path}${position ? `:${position.line + 1}:${position.character + 1}` : ''}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;
                    })
                    .join('\n')
            );
        }
        const module = { exports: {} };
        cache.set(path, module);
        function requireModule(specifier: string) {
            if (specifier in external) return external[specifier];
            if (!specifier.startsWith('.'))
                throw new Error(`Unsupported import: ${specifier}`);
            if (specifier.endsWith('?raw')) {
                return {
                    default: sources[resolve(specifier.slice(0, -4), path)],
                    __esModule: true,
                };
            }
            return load(resolve(specifier, path));
        }
        try {
            new Function('require', 'module', 'exports', result.outputText)(
                requireModule,
                module,
                module.exports
            );
        } catch (error) {
            cache.delete(path);
            throw new Error(
                `${path}: ${error instanceof Error ? error.message : String(error)}`
            );
        }
        return module.exports;
    }
    return load;
}
