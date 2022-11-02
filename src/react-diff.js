const FiberStatus = {
    PLACEMENT: 'Placement',
    CHILDDELETE: 'ChildDelete'
};

export class Fiber {
    constructor(key, type, index, stateNode, sibling) {
        this.index = index || 0;
        this.sibling = sibling || null;
        this.stateNode = stateNode || null;
        this.key = key;
        this.type = type;
        this.flags = null;
        this.alternate = null;
        this.deletions = [];
        this.return = null;
        this.child = null;
    }
}

export class JSXElement {
    constructor(key, type) {
        this.key = key;
        this.type = type;
    }
}
/**
 * 
 * @param {string} type 
 * @returns {string}
 */
export const createDom = (type) => {
    return type;
};

/**
 * 
 * @param {Fiber | null} node 
 * @param {JSXElement} newChild 
 * @returns {Fiber | null}
 */
const createFiber = (node, newChild) => {
    if (node === null) {
        const newFiber = new Fiber(newChild.key, newChild.type);
        newFiber.flags = FiberStatus.PLACEMENT;
        return newFiber;
    }
    if (newChild.key === node.key) {
        const newFiber = new Fiber(newChild.key, newChild.type);
        if (newChild.type === node.type) {
            newFiber.alternate = node;
            node.alternate = newFiber;
            newFiber.stateNode = node.stateNode;
            return newFiber;
        } else {
            newFiber.stateNode = createDom(newFiber.type);
            return newFiber;
        }
    }
    return null;
};

/**
 * 
 * @param {Map<string, Fiber>} oldFiberMap 
 * @param {JSXElement} newChild 
 * @returns {Fiber}
 */
const createFiberFromMap = (oldFiberMap, newChild) => {
    const key = newChild.key;
    const node = oldFiberMap.get(key) || null;
    const newFiber = createFiber(node, newChild);
    if (oldFiberMap.has(key)) {
        oldFiberMap.delete(key);
    }
    return newFiber;
};

/**
 * @param {number} lastPlacedIndex 
 * @param {Fiber} newFiber 
 * @param {number} newIndex 
 * @returns 
 */
const palceChild = (lastPlacedIndex, newFiber, newIndex) => {
    newFiber.index = newIndex;
    const oldFiber = newFiber.alternate;
    if (oldFiber !== null) {
        if (oldFiber.index < lastPlacedIndex) {
            newFiber.flags = FiberStatus.PLACEMENT;
            return lastPlacedIndex;
        } else {
            return oldFiber.index;
        }
    } else {
        newFiber.flags = FiberStatus.PLACEMENT;
        return lastPlacedIndex;
    }
};
/**
 * 
 * @param {Fiber} node 
 * @returns {Map<string, Fiber>}
 */
const createMapFromOldFiberList = (node) => {
    const map = new Map();
    let tmp = node;
    while (tmp !== null) {
        map.set(tmp.key, tmp);
        tmp = tmp.sibling;
    }
    return map;
};

/**
 * 
 * @param {Fiber} returnFiber 
 * @param {Fiber} child 
 */

const deleteChild = (returnFiber, child) => {
    returnFiber.deletions.push(child);
};
/**
 * @param {Fiber} returnFiber 
 * @param {Fiber} node 
 * @param {JSXElement[]} newChildren 
 * @returns {Fiber}
 */
export const reconcileChildrenArray = (returnFiber, node, newChildren) => {
    let newIndex = 0;
    let lastPlacedIndex = 0;
    let resultNode = null;
    let prevNewNode = null;
    let oldFiber = node;
    const n = newChildren.length;
    for (; newIndex < n && oldFiber !== null; newIndex++) {
        const child = newChildren[newIndex];
        const newFiber = createFiber(oldFiber, child);
        if (newFiber === null) {
            break;
        }
        lastPlacedIndex = palceChild(lastPlacedIndex, newFiber, newIndex);
        if (prevNewNode === null) {
            resultNode = newFiber;
            prevNewNode = newFiber;
            newFiber.return = returnFiber;
            returnFiber.child = newFiber;
        } else {
            prevNewNode.sibling = newFiber;
            prevNewNode = prevNewNode.sibling;
        }
        oldFiber = oldFiber.sibling;
    }
    if (newIndex >= n) {
        returnFiber.flags = FiberStatus.CHILDDELETE;
        while (oldFiber !== null) {
            deleteChild(returnFiber, oldFiber);
            oldFiber = oldFiber.sibling;
        }
        return resultNode;
    }
    if (oldFiber === null) {
        for (; newIndex < n; newIndex++) {
            const newFiber = createFiber(null, newChildren[newIndex]);
            if (prevNewNode === null) {
                resultNode = newFiber;
                prevNewNode = newFiber;
                newFiber.return = returnFiber;
                returnFiber.child = newFiber;
            } else {
                prevNewNode.sibling = newFiber;
                prevNewNode = prevNewNode.sibling;
            }
        }
        return resultNode;
    }
    const oldFiberMap = createMapFromOldFiberList(oldFiber);
    for (; newIndex < n; newIndex++) {
        const child = newChildren[newIndex];
        const newFiber = createFiberFromMap(oldFiberMap, child);
        lastPlacedIndex = palceChild(lastPlacedIndex, newFiber, newIndex);
        if (prevNewNode === null) {
            resultNode = newFiber;
            prevNewNode = newFiber;
            newFiber.return = returnFiber;
            returnFiber.child = newFiber;
        } else {
            prevNewNode.sibling = newFiber;
            prevNewNode = prevNewNode.sibling;
        }
    }
    if (oldFiberMap.size > 0) {
        returnFiber.flags = FiberStatus.CHILDDELETE;
        oldFiberMap.forEach((node) => {
            deleteChild(returnFiber, node);
        });
    }
    return resultNode;
};
