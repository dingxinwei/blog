import { Watcher } from './watcher'

/**
 * 模板编译
 * @param {*} el 根节点
 * @param {*} vm 根实例
 */
export function compile(el, vm) {
  const fragment = document.createDocumentFragment();
  let child = el.firstElementChild;
  while(child) {
    fragment.appendChild(child);
    child = el.firstElementChild;
  }
  compileElement(fragment, el, vm);
  el.appendChild(fragment);
}
/**
 * 编译元素
 * @param {*} fragment 存放所有元素节点
 * @param {*} el 根节点
 * @param {*} vm 根实例
 */
function compileElement(fragment, el, vm) {
  const renderMap = {
    'v-if': compileVIf,
    'v-for':  compileVFor,
    'v-modal': compileVModal,
  }
  const childrens = fragment.childNodes;
  childrens.forEach(element => {
    for(const instruction in renderMap) {
      if (element.hasAttribute(instruction)) {
        renderMap[instruction](element, vm, el, fragment)
      } else {
        compileMastache(element, vm);
        compileVBind(element, vm);
        compileVOn(element, vm);
      }
    }
  });
}
/**
 * 编译双大括号
 * @param {*} node 元素节点
 * @param {*} vm 根实例
 */
function compileMastache(node, vm) {
  const reg = /\{\{(.*)\}\}/;
  const firstNodeText = node.innerText;
  if (reg.test(firstNodeText)) {
    const arr = firstNodeText.match(reg);
    node.innerText = vm[arr[1].trim()];
    new Watcher(vm, (value) => {
      node.innerText = value;
    }, arr[1].trim());
  }
}
/**
 * 编译v-modal指令
 * @param {*} node 元素节点
 * @param {*} vm 根实例
 */
function compileVModal(node, vm) {
  if(node && Object.prototype.hasOwnProperty.call(node.attributes, 'v-modal')) {
    const exp = node.attributes[1].value;
    const val = vm.data[exp];
    node.addEventListener('input', (e) => {
      let newVal = e.target.value;
      if(val === newVal) return;
      vm[exp] = newVal;
    })
    node.removeAttribute('v-modal');
  }
}
/**
 * 编译v-for指令
 * @param {*} node 元素节点
 * @param {*} vm 根实例
 * @param {*} el 根节点
 * @param {*} fragment 存放所有元素节点
 * @param {*} dataValue 更新后的数据
 * @returns 
 */
function compileVFor(node, vm, el, fragment, dataValue=[]) {
  const tagName = node.tagName;
  if(node && Object.prototype.hasOwnProperty.call(node.attributes, 'v-for')) {
    const exp = node.attributes[0].value.split(' ');
    const val = vm.data[exp[2]];
    new Watcher(vm, (value) => {
      compileVFor(node, vm, el, fragment, value);
    }, exp[2]);
    if(!Array.isArray(val)) return;
    node.innerText = val[val.length-1];
    for(let i=0; i<val.length-1; i++) {
      const element = document.createElement(tagName);
      element.innerText = val[i];
      fragment.insertBefore(element, node);
    }
    node.removeAttribute('v-for');
  } else {
    
    const tagArr = Object.values(el.getElementsByTagName(tagName));
    
    if(tagArr.length > dataValue.length) {
      dataValue.forEach((val, index) => {
        tagArr[index].innerText = val;
      })
      for(let i=dataValue.length; i<tagArr.length; i++) {
        el.removeChild(tagArr[i]);
      }
    } else if (tagArr.length < dataValue.length){
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
/**
 * 编译v-on指令 支持语法糖 "@事件名=值"
 * @param {*} node 元素节点
 * @param {*} vm 根实例
 * @returns 
 */
function compileVOn(node, vm) {
  const attributes = Object.values(node.attributes);
  const instruction = attributes.filter(attr => attr.name.includes('v-on') || attr.name.includes('@'));//过滤v-on指令
  if (instruction.length === 0) return;
  const instructionName = instruction[0].name;
  if(instructionName.startsWith('v-on') || instructionName.startsWith('@')) {
    const eventName = instructionName.includes(':') ? instructionName.split(':')[1] : instructionName.split('@')[1];
    const eventCallBack = instruction[0].value;
    node.addEventListener(eventName,vm[eventCallBack].bind(vm));
    node.removeAttribute(instructionName);
  }
}
/**
 * 编译v-bind指令 支持语法糖 ":属性名=值"
 * @param {*} node 元素节点
 * @param {*} vm 根实例
 * @returns 
 */
function compileVBind(node, vm) {
  const attributes = Object.values(node.attributes);
  const instruction = attributes.filter(attr => attr.name.includes('v-bind') || attr.name.includes(':'));//过滤v-bind指令
  if (instruction.length === 0) return;
  const instructionName = instruction[0].name;
  if(instructionName.startsWith('v-bind') || instructionName.startsWith(':')) {
    const attrName = instructionName.split(':')[1];
    const attrValue = instruction[0].value;
    new Watcher(vm, (value) => {
      node.setAttribute(attrName, value);
    }, attrValue);
    node.setAttribute(attrName, vm[attrValue]);
    node.removeAttribute(instructionName);
  }
}
/**
 * 编译v-if指令
 * @param {*} node 元素节点
 * @param {*} vm 根实例
 * @returns 
 */
function compileVIf(node, vm) {
  const attributes = Object.values(node.attributes);
  const instruction = attributes.filter(attr => attr.name === 'v-if');//过滤v-if指令
  if (instruction.length === 0) return;
  const instructionValue = instruction[0].value;
  new Watcher(vm, (value) => {
    node.style.display = !!value ? '' : 'none';
  }, instructionValue);
  node.style.display = !!vm[instructionValue] ? '' : 'none';
  node.removeAttribute(instruction[0].name);
}
