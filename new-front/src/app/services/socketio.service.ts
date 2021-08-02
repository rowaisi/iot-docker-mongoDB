import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: SocketIOClient.Socket
  constructor() { }

  setupSocketConnection() {
    // proceed with the socket connection
    console.log('subscription @ socketio Service => ');
    this.socket = io(environment.apiUrl)


  }
  getSocketInstance() {
    return this.socket;
  }
}
