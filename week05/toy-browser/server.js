const http = require('http');

const server = http.createServer((req, res) => {
    console.log('request received');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('i am shiji, i am wiriting...');
    res.write('i am shiji, and i am back. this is a test demo.');
    res.end('ok');
});

server.listen(8888);
console.log('server listen port: 8888');    