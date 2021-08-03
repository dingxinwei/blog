/**
 * 订阅者
 */
class Watcher {
  constructor(vm, cb, exp) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.deps = [];
    pushTarget(this);
    this.value = this.vm.data[exp];
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
    
  }
}