 /**
  * 发布者
  */
 class Observer {
  constructor(value){
    if (Array.isArray(value)) {

    } else {
      this.walk(value);
    }
  }
  walk(obj){
    const keys = Object.keys(obj);
    for(let i=0; i<keys.length; i++){
      this.defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }
  defineReactive(obj, key, val){
    let flag = true;
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set(newVal){
        if (val === newVal) return
        val = newVal;
        dep.notify();
      },
      get(){
        if(Dep.target && flag){
          flag = false;
          dep.depend();
        }
        return val;
      }
    })
  }
}
function observe(value) {
   new Observer(value);
}