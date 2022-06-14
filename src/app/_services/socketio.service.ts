import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { NotificationsService } from './notifications.service';
import { Notification } from '@app/_models';
import { OffersService } from '.';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: any;

  private messagesSubject = new BehaviorSubject<any[]>([]);
  public mensajes = this.messagesSubject.asObservable();

  constructor(
    private authenticationService: AuthenticationService,
    private notifications: NotificationsService,
    private offers: OffersService,
  ) {

  }

  setupSocketConnection(user: number, type: string) {
    console.log('SETING UP SOCKET');

    this.socket = io(environment.apiUrl, {
      path: '/socket.io',
      query: {user: String(user), type}
    });

    this.socket.on("connect_error", (err: any) => {
      console.log(err);
      console.log(`connect_error due to ${err.message}`);
    });


    this.socket.on('notificacion_insert', (notif: Notification) => {
      console.log(notif.message);
      this.notifications.insert(notif);
    });

    this.socket.on('reciveMessage', ( message: any ) => {
      console.log(message)
      this.messagesSubject.next( this.messagesSubject.getValue().concat(message) );
    });

    this.socket.on('broadcast', (data: any) => {
      console.log(data);
    });

    this.socket.on('offer_requested', (data: any) => {
      if(this.authenticationService.currentUserValue.type == 'company' && this.authenticationService.currentUserValue.id !== data.user){
        console.log(`kill offer ${data.offer} from catalog`);
        this.offers.setRequestedOffer(data.offer);
      }
    });
  }

  joinChatRoom( room: string, type: string, id: number, userType: string ){
    console.log(room, type, id);
    setTimeout(()=>{
      this.socket.emit('join_chat_room', {room, type, id, userType});
    },50);

  }

  leaveChatRoom( room: string ){
    this.socket.emit('leave_chat_room', room);
  }

  SocketConnectionSendMessage( message: any ){
    this.socket.emit('message', message);
  }

  setMessages(data: any[]){
    this.messagesSubject.next(data)
  }

  clearMessages(){
    this.messagesSubject.next([]);
  }

  socketCloseConnection(){
    this.socket.close();
    this.socket.disconnected;
  }
}
