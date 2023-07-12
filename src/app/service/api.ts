import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import {io} from "socket.io-client";
import {Socket} from "ngx-socket-io";


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private connectionEstablished: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private socket = io('http://localhost:3000')

  constructor() {
    this.socket.on('connection', () => this.connectionEstablished.next(true))
    this.socket.on('disconnect', () => this.connectionEstablished.next(false))
  }

  public joinPlayer(nickname: string, id: string) {
    const message: string = JSON.stringify({
      nickname: nickname,
      id: id,
    });

    this.socket.emit('player.join', message);
  }

  public isConnected(): BehaviorSubject<boolean> {
    return this.connectionEstablished;
  }

  triggerAttack() {
    this.socket.emit('unit.attack');
  }

  player(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('player.join', (message: string) => {
        observer.next(message)
      })
    })
  }

  state(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('game.state', (message: string) => {
        observer.next(message)
      })
    })
  }

  fightEvents(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('unit.attack', (message: string) => {
        observer.next(message)
      })
    })
  }

  scores(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('game.over', (message: string) => {
        observer.next(message)
      })
    })
  }
}
