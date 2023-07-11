import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import {io} from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  public message$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
  }

  socket = io('http://localhost:3000');

  public joinPlayer(nickname: string, id: string) {
    const message: string = JSON.stringify({
      nickname: nickname,
      id: id,
    });

    this.socket.emit('player.join', message);
  }

  public isConnected(): boolean {
    return this.socket.connected;
  }

  state(){
    return  new Observable((observer: Observer<any>)=>{
      this.socket.on('game.state', (message:string)=>{
        observer.next(message)
      })
    })
  }

  public events = () => {
    this.socket.on('game.state', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
