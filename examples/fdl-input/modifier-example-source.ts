import { liveExamples } from './live-example-modules';

// These strings come from the same files imported to register the live views.
// Source tabs never reconstruct a separate model or rendering implementation.
export function exampleSource(name: string) {
    const source = liveExamples[name];
    if (!source) throw new Error('Missing example: ' + name);
    return source;
}
