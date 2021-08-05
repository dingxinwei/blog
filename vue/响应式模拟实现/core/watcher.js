import { popTarget, pushTarget } from './utils'
/**
 * 订阅者
 */
export class Watcher {
  /**
   * 
   * @param {*} vm 根实例
   * @param {*} cb 回调
   * @param {*} exp 指令的值或者双大括号里的值
   */
  constructor(vm, cb, exp) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.deps = [];
    pushTarget(this);
    this.value = this.vm.data[exp];//触发属性的getter函数进行收集依赖
    popTarget();
  }
  addDep(dep) {
    this.deps.push(dep);
    dep.addSub(this);
  }
  update() {
    this.run();
  }
  run() {
    this.cb(this.vm[this.exp]);
  }
  cleaup() {
    this.deps.length = 0;
  }
}