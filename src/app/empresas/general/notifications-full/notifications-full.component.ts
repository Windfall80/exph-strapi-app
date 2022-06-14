import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { Notification } from '@app/_models';
import { NotificationsService } from '@app/_services';

@Component({
  selector: 'app-notifications-full',
  templateUrl: './notifications-full.component.html',
  styleUrls: ['./notifications-full.component.scss']
})
export class NotificationsFullComponent implements OnInit {
  private notifications_sub: Subscription;
  private unread_sub: Subscription;

  public _notifications: Notification[] = [];
  public _unread: number = 0;

  _sort = 'created_at:DESC';
  _start = 0;
  _limit = 100;

  constructor(
    private router: Router,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.unread_sub = this.notificationsService.unread.subscribe(n => {
      this._unread = n;
    });

    this.notifications_sub = this.notificationsService.notificationsFull.subscribe(n_list => {
      this._notifications = n_list;
    });

    this.doRefresh(null);
  }

  ngOnDestroy(){
    this.unread_sub.unsubscribe();
    this.notifications_sub.unsubscribe();
  }

  loadData(event: any){
    console.log("scroll reach end");
    this.notificationsService.loadNotificationsFull(this._sort, this._notifications.length, this._limit).then((res: any) => {
      if(event) event.target.complete();
    });
  }

  doRefresh(event: any){
    this._notifications = [];

    this.notificationsService.refreshNotificationsFull(this._sort, this._notifications.length, this._limit).then((res: any) => {
      if(event) event.target.complete();
    });
  }

  onClick($event: any, n: Notification){
    //$event.stopPropagation();

    if(!n.read) {
      this.notificationsService.setRead(n);
    }

    if(n.link) this.router.navigate([n.link]);
    //if(n.link) this.trigger.closeMenu();
  }

  onDelete(n: Notification){
    console.log('Borrando notificacion', n.id);
    this.notificationsService.delete(n);
  }

  onDeleteAll(){
    console.log('Borrando todals las notificaciones');
    this.notificationsService.deleteAll();
  }

  /*async dismiss() {
    await this.popoverController.dismiss();
  }*/

}
