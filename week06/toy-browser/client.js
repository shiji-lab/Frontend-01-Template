const net = require('net'); // TCP 库
const parser = require('./parser.js');

/*
const client = net.createConnection({
    host: '127.0.0.1',
    port: 8888
}, () => {
  // 'connect' listener.
//   console.log('connected to server!');
//   client.write('POST / HTTP/1.1\r\n');
//   client.write('HOST: 127.0.0.1\r\n');
//   client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//   client.write('\r\n');
//   client.write('field1=aaa&code=x%3D1\r\n');
//   client.write('\r\n');

    const request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: 8888,
        path: '/',
        headers: {
            'X-Foo2': 'custom'
        },
        body: {
            name: 'shiji'
        }
    });

    console.log(request.toString());
    client.write(request.toString());
});
client.on('data', (data) => {
  console.log('client on data', data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});

*/

class Request {
    // method, url = host + port + path
    // body:k/v
    // headers
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.path = options.path || '/';
        this.port = options.port || 80;
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = 'application/x-www-form-urlencoded';
        }

        if (this.headers["Content-Type"] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }

        this.headers["Content-Length"] = this.bodyText.length;
    }

    // 注意这里的空格
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());    // 将文本按照指定格式写进去
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());  // 将文本按照指定格式写进去
                });
            }
            connection.on('data', (data) => {   // NOTE：data 是个流，不是包
                // console.log('✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔');
                // console.log(data.toString());
                // console.log('✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔');
                parser.receive(data.toString());
                if (parser.isFinished) {
                    // console.log('✘✘✘✘✘✘✘✘✘✘✘✘✘✘✘✘✘✘✘✘');
                    // console.log(parser.response);
                    resolve(parser.response);
                }
                // console.log(parser.statusLine);
                // console.log(parser.headers);
                // resolve(data.toString());
                connection.end();
            });
            connection.on('error', (error) => {
                reject(error);
                connection.end();
            });
        });

    }
}

class Response {

}

class ResponseParser {
    constructor () {
        this.WAITTING_STATUS_LINE = 0;
        this.WAITTING_STATUS_LINE_END = 1;
        this.WAITTING_HEADER_NAME = 2;
        this.WAITTING_HEADER_SPACE = 3;
        this.WAITTING_HEADER_VALUE = 4;
        this.WAITTING_HEADER_LINE_END = 5;
        this.WAITTING_HEADER_BLOCK_END = 6;
        this.WAITTING_BODY = 7;

        this.current = this.WAITTING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';

        this.bodyParser = null;
    }

    get isFinished () {
        return this.bodyParser && this.bodyParser.isFinish;
    }

    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive (string){
        for (let i = 0; i < string.length; i++) {
            this.receiveCharacter(string.charAt(i));
        }
    }

    receiveCharacter (char) {
        if (this.current === this.WAITTING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITTING_STATUS_LINE_END;
            } else if (char === '\n') {
                this.current = this.WAITTING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITTING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITTING_HEADER_NAME;
            }
        } else if (this.current === this.WAITTING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITTING_HEADER_SPACE;
            } else if(char === '\r') {
                this.current = this.WAITTING_HEADER_BLOCK_END;
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITTING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITTING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITTING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITTING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITTING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITTING_HEADER_NAME;
            }
        } else if (this.current === this.WAITTING_HEADER_BLOCK_END) {
            this.current = this.WAITTING_BODY;
            if (this.headers['Transfer-Encoding'] === 'chunked') {
                this.bodyParser = new TrunkedBodyParser();
            }
        } else if (this.current === this.WAITTING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITTING_LENGTH = 0;
        this.WAITTING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITTING_NEW_LINE = 3;
        this.WAITTING_NEW_LINE_END = 4;

        this.isFinish = false;

        this.length = 0;
        this.content = [];

        this.current = this.WAITTING_LENGTH;
    }
    receiveChar(char) {
        // console.log(JSON.stringify(char));
        // if (this.isFinish) return;  // todo 如果处理完成，则直接结束，不可以！！！，因为可能会有多段
        if (this.current === this.WAITTING_LENGTH) {
            if (char === '\r') {
                // console.log('✔', this.length);
                if (this.length === 0) {    // fixme 这里的判断有问题！
                    this.isFinish = true;
                }
                this.current = this.WAITTING_LENGTH_LINE_END;
            } else {
                // this.length *= 10;
                // this.length += char.charCodeAt(0) - '0'.charCodeAt(0);
                this.length *= 16;  // 注意：这里用的是 16 进制
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITTING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            if (this.length === 0) {
                this.current = this.WAITTING_NEW_LINE;
            } else {
                this.content.push(char);
                this.length--;
            }
        } else if (this.current === this.WAITTING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITTING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITTING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITTING_LENGTH;
            }
        }
    }
}

void async function () {
    const request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: 8888,
        path: '/',
        headers: {
            'X-Foo2': 'custom'
        },
        body: {
            name: 'shiji'
        }
    });
    
    const response = await request.send();
    // console.log('response-->', response);

    const dom = parser.parseHTML(response.body);
}();    