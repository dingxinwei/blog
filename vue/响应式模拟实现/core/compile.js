/**
 * 模板编译
 * @param {*} el 
 * @param {*} data 
 * @param {*} vm 
 */
function compile(el, data, vm) {
  const firstNode = el.firstElementChild;
  const secondNode = el.lastElementChild;
  const firstNodeText = firstNode.innerText;
  const secondNodeAttributes = secondNode.attributes;
  const reg = /\{\{(.*)\}\}/
  if (reg.test(firstNodeText)) {
    const arr = firstNodeText.match(reg);
    firstNode.innerText = data[arr[1]];
  }
  if(secondNodeAttributes[1].name === 'v-modal') {
    let exp = secondNodeAttributes[1].value;
    let val = vm.data[exp];
    secondNode.value = val;
    const watcher =  new Watcher(vm, function(value) {
      firstNode.innerText = value;
      secondNode.value = value;
    }, exp);
    pushTarget(watcher);
    secondNode.addEventListener('input', (e) => {
      let newVal = e.target.value;
      if(val === newVal) return;
      vm[exp] = newVal;
    })
  }
  secondNode.removeAttribute('v-modal');
}