import { observe } from './observer'
import { compile } from './compile'
/**
 * 根实例
 * @param {*} option 
 */
window.SelfVue = function (option) {
  this.data = option.data;
  this.el = option.el;
  this.proxy();
  Object.assign(this,option.methods);
  observe(this.data);
  compile(this.el, this);
}
SelfVue.prototype.proxy = function() {
  const keys = Object.keys(this.data);
  keys.forEach(key => {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get() {
        return this.data[key];
      },
      set(newVal) {
        this.data[key] = newVal;
      }
    })
  })
}