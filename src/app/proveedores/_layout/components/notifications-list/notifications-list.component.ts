import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Notification } from '@app/_models';
import { NotificationsService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  private n_sub: Subscription;
  public _notifications: Notification[] = [];

  _sort = 'created_at:DESC';
  _start = 0;
  _limit = 10;

  constructor(
    private router: Router,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.n_sub = this.notificationsService.notifications.subscribe(n_list => {
      console.log(n_list);
      this._notifications = n_list;
    });

    this.doRefresh(null);
  }

  ngOnDestroy(){
    this.n_sub.unsubscribe();
  }

  loadData(event: any){
    console.log("scroll reach end");
    this.notificationsService.loadNotifications(this._sort, this._notifications.length, this._limit).then((res: any) => {
      if(event) event.target.complete();
    });
  }

  doRefresh(event: any){
    this._notifications = [];

    this.notificationsService.refreshNotifications(this._sort, this._notifications.length, this._limit).then((res: any) => {
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
