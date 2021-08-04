import { Dep } from './dep'
export function pushTarget(target) {
  Dep.target = target;
}
export function popTarget() {
  Dep.target = null;
}
export const arrayMethodsProto = Object.create(Array.prototype);
const methods = ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
/**
 * 重新定义数组原型方法
 */
methods.forEach(method => {
  def(arrayMethodsProto, method, function(...arg) {
    Array.prototype[method].call(this, ...arg);
    this.__dep__.notify();
  })
})
function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    writable: true,
    configurable: true,
    enumerable: true,
  })
}
