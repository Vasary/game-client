import { Component } from '@angular/core';
import {ApiService} from "../service/api";

@Component({
  selector: 'app-server-state',
  templateUrl: './server-state.component.html',
  styleUrls: ['./server-state.component.scss']
})
export class ServerStateComponent {
  constructor(private api: ApiService) {}

  isConnected(): boolean
  {
    return this.api.isConnected()
  }
}
