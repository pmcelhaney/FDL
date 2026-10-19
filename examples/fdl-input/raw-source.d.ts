declare module '*?raw' {
    const source: string;
    export default source;
}

declare module 'virtual:fdl-documentation' {
    const pages: {
        id: string;
        file: string;
        title: string;
        html: string;
        headings: { id: string; title: string; level: number }[];
    }[];
    export default pages;
}

declare module 'virtual:example-sources' {
    const sources: Record<string, string>;
    export default sources;
}
