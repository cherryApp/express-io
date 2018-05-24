import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SockService {
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect('ws://localhost:3001');
    this.socket.on('get', (data) => {
      console.log(data);
    });
  }

  get(url) {
    this.socket.emit('get', {url: url});
  }

}
