let nextUniqueId = 0;

/** @returns {string} */
export function createUniqueId() {
    nextUniqueId += 1;
    return `fdl-${nextUniqueId}`;
}

/**
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
export function delay(milliseconds = 0) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Test whether a value is neither null nor undefined.
 * @template T
 * @param {T | null | undefined} value
 * @returns {value is T}
 */
export function exists(value) {
    return value !== null && value !== undefined;
}
