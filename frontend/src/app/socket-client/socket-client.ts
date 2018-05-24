import { Injectable, Inject, Optional } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketClient {
  OPTIONS;
  socketUrl: string = '';
  socket: SocketIOClient.Socket;
  constructor(@Inject('OPTIONS') options: any) {
    this.socketUrl = options.url;
    this.socket = io.connect(this.socketUrl);
    console.log( this.socket );
    this.socket.on('get', (data) => {
      console.log(data);
    });
  }

  get(url: string) {
    this.socket.emit('get', {url: url});
  }
}
