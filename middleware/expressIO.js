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
                this.crud('get', msg);
            });
            socket.on('put', (msg) => {
                this.crud('put', msg);
            });
            socket.on('post', (msg) => {
                this.crud('post', msg);
            });
            socket.on('delete', (msg) => {
                this.crud('delete', msg);
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

    next() {

    }

    crud(type, msg) {
        try {
            msg = JSON.parse(msg);
        } catch(e) {
            console.error(e);
            return;
        }
        
        msg.matchedList = this.middleWares[type].filter(middleware => {
            return new UrlPattern(middleware.url).match(msg.url);
        });

        this.next();
        
    }
}
