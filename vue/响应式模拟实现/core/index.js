/**
 * 根实例
 * @param {*} option 
 */
function SelfVue(option) {
  this.data = option.data;
  this.el = option.el;
  Object.assign(this,option.methods);
  observe(this.data);
  compile(this.el, this.data, this);
  this.proxy();
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