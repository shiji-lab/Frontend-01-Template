const net = require('net');
net.connect({
    address: 'localhost',
    port: 8888,
    onread: {
        // Reuses a 4KiB Buffer for every read from the socket.
        buffer: Buffer.alloc(4 * 1024),
        callback: function (nread, buf) {
            // Received data is available in `buf` from 0 to `nread`.
            console.log(buf.toString('utf8', 0, nread));
        }
    }
})

class Request {

}

class Response {

}