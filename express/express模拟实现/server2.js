const index = require('./lib/index')
const http = require('http');
const app = index()
app.use((req, res) => {
  console.log('第一个中间件');
})
app.use('/user', (req, res)=>{
  console.log('user中间件');
})
app.post('/user', (req, res) => {
  console.log(req.url);
  console.log(req.headers);
  console.log(req.method);
  req.on('data', chunk => {
    console.log(chunk.toString());
  })
  req.on('end', () => {
    console.log('接收成功');
  })
  res.setHeader('Content-Type', 'text/html');
  res.write('hello world');
  res.end();
})
app.use('/test', (req, res) => {
  console.log('test');
  //res.setHeader('Content-Type', 'application/json');

  res.end(Buffer.from(['hello test'].toString()))
})
http.createServer(app).listen(3000);