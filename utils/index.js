import { createDom, Fiber, JSXElement } from "../src/react-diff.js";

/**
 * 
 * @param {string[]} list 
 * @returns {Fiber}
 */
export const createFiberList = (list) => {
    const dummyHead = new Fiber('#', '#');
    let p = dummyHead;
    for (let i = 0; i < list.length; i++) {
        const fiber = new Fiber(list[i], 'div', i, createDom('div'));
        p.sibling = fiber;
        p = p.sibling;
    }
    return dummyHead.sibling;
};

/**
 * 
 * @param {string[]} list 
 * @returns {JSXElement[]}
 */
export const createJSXList = (list) => {
    return list.map(key => {
        return key === null ? null : new JSXElement(key, 'div')
    });
};

/**
 * 
 * @param {Fiber} fiber 
 * @returns {any[]}
 */
export const convertFiberListToArray = (fiber) => {
    const ret = [];
    while (fiber !== null) {
        ret.push({
            key: fiber.key,
            flags: fiber.flags,
            index: fiber.index
        });
        fiber = fiber.sibling;
    }
    return ret;
};