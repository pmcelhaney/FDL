/**
 * Deeply clone data while preserving common built-ins and class prototypes.
 * Functions are retained by reference, matching normal configuration-object semantics.
 *
 * @template T
 * @param {T} value
 * @param {WeakMap<object, object>} [seen]
 * @returns {T}
 */
export default function clone(value, seen = new WeakMap()) {
    if (value === null || typeof value !== 'object') return value;
    if (seen.has(value)) return /** @type {T} */ (seen.get(value));

    if (value instanceof Date) return /** @type {T} */ (new Date(value.getTime()));
    if (value instanceof RegExp) return /** @type {T} */ (new RegExp(value.source, value.flags));

    if (value instanceof Map) {
        const result = new Map();
        seen.set(value, result);
        value.forEach((mapValue, key) => result.set(clone(key, seen), clone(mapValue, seen)));
        return /** @type {T} */ (result);
    }

    if (value instanceof Set) {
        const result = new Set();
        seen.set(value, result);
        value.forEach(item => result.add(clone(item, seen)));
        return /** @type {T} */ (result);
    }

    const result = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
    seen.set(value, result);
    Reflect.ownKeys(value).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor) return;
        if ('value' in descriptor) descriptor.value = clone(descriptor.value, seen);
        Object.defineProperty(result, key, descriptor);
    });
    return result;
}
