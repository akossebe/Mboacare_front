import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  public notifications$ = new Subject<any>();

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8081/ws-mboacare/websocket',
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.onStompError = (frame) => {
      console.error('Erreur STOMP', frame);
    };
  }

  connectPatient(patientId: number) {
    if (!this.client.active) {
      this.client.activate();
    }
    this.client.onConnect = () => {
      this.client.subscribe('/topic/patient/' + patientId, (message) => {
        if (message.body) {
          this.notifications$.next(JSON.parse(message.body));
        }
      });
    };
  }

  connectMedecin(medecinId: number) {
    if (!this.client.active) {
      this.client.activate();
    }
    this.client.onConnect = () => {
      this.client.subscribe('/topic/medecin/' + medecinId, (message) => {
        if (message.body) {
          this.notifications$.next(JSON.parse(message.body));
        }
      });
    };
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }
}
