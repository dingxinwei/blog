/**
 * 订阅器 调度中心
 */
export class Dep {
  static target;
  subs;
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  depend() {
    Dep.target.addDep(this);
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}