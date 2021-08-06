const pathRegexp = require('path-to-regexp');

function App() {
  this.stack = [];
}
App.prototype.use = function(fn){
  let fns = null;
  let path = '/'
  if (typeof fn === 'function') fns = fn;
  else {
    path = fn;
    fns = Array.prototype.slice.call(arguments,1);
  }
  const pathReg = pathRegexp.pathToRegexp(path);
  this.stack.push({pathReg, fns, path});
}
App.prototype.handler = function(req, res) {
  const pathname = req.url;
  const method = req.method;
  this.stack.forEach(item => {
    if (item.method) { //路由回调
      if(item.method === method) {
        executeFn(item, pathname, req, res);
      }
    } else { //中间件回调
      executeFn(item, pathname, req, res);
    }
  })
}
/**
 * 执行回调
 * @param {*} item 
 * @param {*} pathname 
 * @param {*} req 
 * @param {*} res 
 */
function executeFn(item, pathname, req, res) {
  if (item.pathReg.exec(pathname) || item.path === '/') {
    if (item.fns.length === 0) {
      item.fns[0](req, res);
    } else if (typeof item.fns === 'function') {
      item.fns(req, res);
    } else {
      item.fns.forEach(fn => {
        fn(req, res);
      })
    }
  }
}
const methods = ['GET', 'POST', 'DElETE', 'PATCH', 'PUT'];
methods.forEach(method => {
  App.prototype[method.toLocaleLowerCase()] = function(path) {
    const fns = Array.prototype.slice.call(arguments,1);
    const pathReg = pathRegexp.pathToRegexp(path);
    this.stack.push({fns, pathReg, path, method});
  }
});
module.exports = App;