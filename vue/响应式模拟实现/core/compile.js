import { Watcher } from './watcher'

/**
 * 模板编译
 * @param {*} el 
 * @param {*} data 
 * @param {*} vm 
 */
export function compile(el, data, vm) {
  const firstNode = el.firstElementChild;
  const secondNode = el.lastElementChild.nextElementSibling;

  renderMastache(firstNode, data);
  renderVModal(firstNode, secondNode, vm);
  renderVFor(firstNode, vm, el);
}
/**
 * 渲染双大括号语法
 * @param {*} node 
 * @param {*} data 
 */
function renderMastache(node, data) {
  const reg = /\{\{(.*)\}\}/;
  const firstNodeText = node.innerText;
  if (reg.test(firstNodeText)) {
    const arr = firstNodeText.match(reg);
    node.innerText = data[arr[1]];
  }
}
/**
 * 渲染v-modal指令
 * @param {*} firstNode 
 * @param {*} secondNode 
 * @param {*} vm 
 */
function renderVModal(firstNode, secondNode, vm) {
  if(secondNode && Object.prototype.hasOwnProperty.call(secondNode.attributes, 'v-for')) {
    let exp = secondNode.attributes[1].value;
    let val = vm.data[exp];
    secondNode.value = val;
    new Watcher(vm, (value) => {
      firstNode.innerText = value;
      secondNode.value = value; 
    }, exp);
    secondNode.addEventListener('input', (e) => {
      let newVal = e.target.value;
      if(val === newVal) return;
      vm[exp] = newVal;
    })
    secondNode.removeAttribute('v-modal');
  }
}
/**
 * 渲染v-for指令
 * @param {*} node 
 * @param {*} vm 
 * @param {*} el 
 * @param {*} dataValue 数据
 * @returns 
 */
function renderVFor(node, vm, el, dataValue = null) {
  let tagName = node.tagName;
  //初始渲染
  if(node && Object.prototype.hasOwnProperty.call(node.attributes, 'v-for')) {
    let exp = node.attributes[0].value;
    let val = vm.data[exp];
    new Watcher(vm, (value) => {
        renderVFor(node, vm, el, value);
    }, exp);
    if(!Array.isArray(val)) return;
    node.innerText = val[val.length-1];
    for(let i=0; i<val.length-1; i++) {
      const element = document.createElement(tagName);
      element.innerText = val[i];
      el.insertBefore(element, node);
    }
    node.removeAttribute('v-for');
  } else { // 数据发生改变渲染
    //节点数组
    const tagArr = Object.values(el.getElementsByTagName(tagName));
    if(!Array.isArray(dataValue)) return;
    if(tagArr.length > dataValue.length) {
      dataValue.forEach((val, index) => {
        tagArr[index].innerText = val;
      })
      for(let i=dataValue.length; i<tagArr.length; i++) {
        el.removeChild(tagArr[i]);
      }
    } else if (tagArr.length < dataValue.length) {
      tagArr.forEach((element, index) => {
        element.innerText = dataValue[index];
      })
      for(let i=tagArr.length-1; i<dataValue.length; i++) {
        const element = document.createElement(tagName);
        element.innerText = dataValue[++i];
        el.appendChild(element);
      }
    } else {
      dataValue.forEach((val, index) => {
        tagArr[index].innerText = val;
      })
    }
  }
}