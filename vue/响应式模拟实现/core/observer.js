import { Dep } from './dep' 
import { arrayMethodsProto } from './utils';
 /**
  * 发布者
  */
class Observer {
  constructor(value) {
    const val = Object.values(value);
    if (Array.isArray(val[0])) {
      val[0].__proto__ = arrayMethodsProto;
    }
    this.walk(value);
  }
  walk(obj) {
    const keys = Object.keys(obj);
    for(let i=0; i<keys.length; i++) {
      this.defineReactive(obj, keys[i], obj[keys[i]]);
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