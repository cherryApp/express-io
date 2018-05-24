/**
 * WebSocket server for express.
 */
var io = require('socket.io'),
    Route = require('route-parser'),
    UrlPattern = require('url-pattern');

module.exports =  class eio {
    constructor(app) {
        this.io = io(app);
        this.middleWares = {
            get: [],
            put: [],
            post: [],
            delete: []
        };

        this.io.on('connection', (socket) => {
            socket.on('get', (msg) => {
                this.crud('get', msg, socket);
            });
            socket.on('put', (msg) => {
                this.crud('put', msg, socket);
            });
            socket.on('post', (msg) => {
                this.crud('post', msg, socket);
            });
            socket.on('delete', (msg) => {
                this.crud('delete', msg, socket);
            });
        });
    }

    pushToMiddleware(type, url, callBack) {
        this.middleWares[type].push({
            url: url,
            callBack: callBack
        });
    }

    get(url, callBack) {
        this.pushToMiddleware('get', url, callBack);
    }

    put(url, callBack) {
        this.pushToMiddleware('put', url, callBack);
    }

    post(url, callBack) {
        this.pushToMiddleware('post', url, callBack);
    }

    delete(url, callBack) {
        this.pushToMiddleware('delete', url, callBack);
    }

    crud(type, msg, socket) {
        try {
            msg = JSON.parse(msg);
        } catch(e) {
            console.error(e);
            return;
        }
        
        msg.matchedList = this.middleWares[type].filter(middleware => {
            return new UrlPattern(middleware.url).match(msg.url);
        });

        msg.currentIndex = 0;
        msg.next = () => {
            let currentMiddleWare = msg.matchedList[msg.currentIndex];
            if (currentMiddleWare) {
                msg.currentIndex++;
                currentMiddleWare.callBack(
                    currentMiddleWare.req, 
                    currentMiddleWare.res, 
                    msg.next
                );                        
            }
        };
        msg.matchedList.forEach( (middleware) => {
            middleware.req = new EIORequest(msg, socket, middleware);
            middleware.res = new EIOResponse(msg, socket, middleware);
        });

        msg.next();
    }
}

class EIOResponse {
    constructor(msg, socket, middleware) {
        this.msg = msg;
        this.socket = socket;
        this.middleware = middleware;
        this.url = this.msg.url;
    }

    send(responseContent) {
        this.socket.emit(this.url, responseContent);
    }

    json(responseContent) {
        try {
            responseContent = JSON.stringify(responseContent);
        } catch (e) {
            console.error(e);
        }
        this.socket.emit(this.url, responseContent);
    }
}

class EIORequest {
    constructor(msg, socket, middleware) {
        this.msg = msg;
        this.middleware = middleware;
        this.url = this.msg.url;
        this.params = new UrlPattern(this.middleware.url).match(this.msg.url);
    }
}
