const http = require('http');
http.createServer((req, res) => {
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
}).listen(3000);