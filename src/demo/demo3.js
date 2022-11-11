import { convertFiberListToArray, createFiberList, createJSXList } from "../../utils/index.js";
import { reconcileChildrenArray, Fiber} from "../react-diff.js";


const list1 = ['a', 'b', 'c', 'd'];
const list2 = ['a', 'e', 'c', 'd'];

const returFiber = new Fiber('parent', 'div');
const oldFiber = createFiberList(list1);
const newChildren = createJSXList(list2);
const newFiber = reconcileChildrenArray(returFiber, oldFiber, newChildren);


console.log({
    returFiberFlag: returFiber.flags,
    returFiberDeletions: returFiber.deletions.map((fiber) => fiber.key),
    oldEle: convertFiberListToArray(oldFiber),
    newEle: convertFiberListToArray(newFiber)
});