import { Dep } from './dep' 
import { arrayMethodsProto } from './utils';
 /**
  * 发布者
  */
class Observer {
  constructor(value) {
    this.walk(value);
  }
  walk(obj) {
    for(const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].__proto__ = arrayMethodsProto;
      }
      this.defineReactive(obj, key, obj[key]);
    }
  }
  defineReactive(obj, key, val) {
    const dep = new Dep();
    if (Array.isArray(val)) {
      val.__dep__ = dep;
    }
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set(newVal) {
        if (val === newVal) return
        val = newVal;
        dep.notify();
      },
      get() {
        if(Dep.target) {
          dep.depend();
        }
        return val;
      }
    })
  }
}
export function observe(value) {
  new Observer(value);
}