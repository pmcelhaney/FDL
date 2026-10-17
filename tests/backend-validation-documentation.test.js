/** @jest-environment node */
import fs from 'fs';
import path from 'path';
import { Record, string } from '../src/index';

const markdown = fs.readFileSync(path.join(__dirname, '../docs/backend-validation.md'), 'utf8');
const blocks = [...markdown.matchAll(/```js\n([\s\S]*?)```/g)].map(match => match[1]);

function loadExample(index, exports, dependencies = {}) {
    const source = blocks[index].replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
    return new Function(
        'Record',
        'string',
        ...Object.keys(dependencies),
        `${source}\nreturn { ${exports} };`
    )(Record, string, ...Object.values(dependencies));
}

const { validateAccount } = loadExample(0, 'validateAccount');

it('validates the published request example in Node with already-parsed values', () => {
    expect(validateAccount({ country: 'US' })).toEqual({
        ok: true,
        values: { country: 'US', taxId: '' },
    });
    expect(validateAccount({ country: 'CA', taxId: 'CA123', admin: true })).toEqual({
        ok: true,
        values: { country: 'CA', taxId: 'CA123' },
    });
    expect(validateAccount({ country: 'CA' }).errors).toEqual([
        { field: 'taxId', message: 'is required' },
    ]);
    expect(validateAccount({}).errors.map(error => error.field)).toEqual([
        'country',
        'country',
        'taxId',
    ]);
    expect(validateAccount({ country: 42, taxId: 123 }).errors.map(error => error.field)).toEqual([
        'country',
        'taxId',
    ]);
    for (const body of [null, [], 'US', undefined]) {
        expect(validateAccount(body)).toEqual({
            ok: false,
            errors: [{ field: null, message: 'Expected a JSON object' }],
        });
    }
});

it('saves only validated values and forwards persistence failures in the documented handler', async () => {
    const { createAccountHandler } = loadExample(1, 'createAccountHandler', { validateAccount });
    const save = jest.fn().mockResolvedValue({ id: 1 });
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    const handler = createAccountHandler(save);
    await handler({ body: { country: 'CA' } }, res, next);
    expect(res.status).toHaveBeenLastCalledWith(422);
    expect(save).not.toHaveBeenCalled();
    await handler({ body: { country: 'US', admin: true } }, res, next);
    expect(save).toHaveBeenCalledWith({ country: 'US', taxId: '' });
    expect(res.status).toHaveBeenLastCalledWith(201);
    const failure = new Error('storage unavailable');
    save.mockRejectedValueOnce(failure);
    await handler({ body: { country: 'US' } }, res, next);
    expect(next).toHaveBeenCalledWith(failure);
});

it('awaits the documented async validator and propagates lookup failures', async () => {
    const { validateUsername } = loadExample(2, 'validateUsername');
    expect(await validateUsername('ada', async () => true)).toEqual([]);
    expect(await validateUsername('ada', async () => false)).toEqual([
        { field: 'username', message: 'must be an available username' },
    ]);
    const lookup = jest.fn();
    expect(await validateUsername('', lookup)).toHaveLength(2);
    expect(lookup).not.toHaveBeenCalled();
    const failure = new Error('lookup unavailable');
    await expect(
        validateUsername('ada', async () => {
            throw failure;
        })
    ).rejects.toThrow(failure);
});
