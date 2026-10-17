const fs = require('fs');
const path = require('path');
function register(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory() && !['dist', 'node_modules'].includes(entry.name)) register(file);
        else if (/\.(ts|js|css)$/.test(entry.name))
            jest.doMock(
                file + '?raw',
                () => ({
                    __esModule: true,
                    default: fs.readFileSync(file, 'utf8'),
                }),
                { virtual: true }
            );
    }
}
register(path.resolve(__dirname, '../../examples/fdl-input'));
jest.mock(
    'virtual:fdl-documentation',
    () => ({
        __esModule: true,
        default: require('../../scripts/documentation-pages.cjs').loadDocumentation(),
    }),
    { virtual: true }
);
