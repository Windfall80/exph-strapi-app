import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AuthenticationService, SocketioService } from '@app/_services';
import { User } from '@app/_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnInit, OnDestroy {
  @ViewChild('scroll') private myScrollContainer: ElementRef;
  @Input() id: number;
  @Input() type: string;
  @Input() room: string;
  @Input() titleName?: string;
  @Input() titlePicture?: string;
  @Input() titleLink?: string;
  @Input() canChat?: boolean;

  currentUser: User;
  chatSub: Subscription;

  //public chatMsg: string = "";
  public chatForm: FormGroup;
  public messages: any[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    public chat: SocketioService,
  ) {
    this.currentUser = authenticationService.currentUserValue;

    this.chatSub = this.chat.mensajes.subscribe((_messages)=>{
      this.messages = _messages;
      setTimeout(()=>{
        this.scrollToBottom();
      }, 2);
    });
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      chatMsg: [null],
    });

    this.joinRoom();
    this.getMensajesAntiguos();
  }

  ngOnDestroy(): void {
    this.chatSub.unsubscribe();
    this.leaveRoom();
  }

  joinRoom(){
    this.chat.joinChatRoom(this.room, this.type, this.id, this.currentUser.type);
  }

  leaveRoom(){
    this.chat.leaveChatRoom(this.room);
  }

  getMensajesAntiguos(){
    this.chat.clearMessages();

    const params = new HttpParams().set('room', this.room);
    this.http.get<any>(`${environment.apiUrl}/messages`, { params }).subscribe(data => {
      this.chat.setMessages(data);
    });
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  async sendMessage(): Promise<void> {
    let chatMsg = this.chatForm.get('chatMsg')?.value;

    if( chatMsg.trim().length == 0){
      return;
    }

    let data: any = {
      message: chatMsg,
      room: this.room,
      type: this.currentUser.type
    }

    if( this.currentUser.type == 'admin' ) {
      data.admin = this.currentUser.id;
    } else {
      data.user = this.currentUser.id
    }

    this.chat.SocketConnectionSendMessage(data);

    this.chatForm.reset();
    //this.scrollToBottom();
  }

  isSelfMessage(_message: any): boolean {
    if(_message.type == 'admin'){
      return _message.admin.id ==  this.currentUser.id;
    } else {
      return _message.user.id ==  this.currentUser.id;
    }
  }

  senderName(_message: any): string {
    if(_message.type == 'admin'){
      return _message.admin.firstname+" "+_message.admin.lastname;
    } else {
      return _message.user.firstname+" "+_message.user.lastname;
    }
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
