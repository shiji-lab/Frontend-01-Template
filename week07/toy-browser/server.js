const http = require('http');

const server = http.createServer((req, res) => {
    // console.log('request received');
    // console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(
`<html maaa=a >
<head>
<style>
div {
    border:solid 1px black
}
</style>
</head>
<body>
    <div style="align-items:center;display:flex;width:500px;justify-content:space-around;">
        <div style="flex:1;width:600px;height:70px;"></div>
        <div style="width:200px;height:50px;"></div>
        <div style="width:200px;height:100px;"></div>
    </div>
</body>
</html>`
);
});

server.listen(8888);
console.log('server listen port: 8888');    