import { convertFiberListToArray, createFiberList, createJSXList } from "../../utils/index.js";
import { reconcileChildrenArray, Fiber} from "../react-diff.js";


const list1 = ['a', 'b', 'c', 'd', 'f'];
const list2 = ['c', 'b', 'a', 'f', 'd'];

const returFiber = new Fiber('parent', 'div');
const oldFiber = createFiberList(list1);
const newChildren = createJSXList(list2);
const newFiber = reconcileChildrenArray(returFiber, oldFiber, newChildren);


console.log({
    oldEle: convertFiberListToArray(oldFiber),
    newEle: convertFiberListToArray(newFiber)
});