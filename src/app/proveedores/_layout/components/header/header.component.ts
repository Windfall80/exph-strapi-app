import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthenticationService, NotificationsService, SocketioService } from '@app/_services';
import { User } from '@app/_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() snav: MatSidenav;
  @Input() sidebar: String;

  _userSub: Subscription
  currentUser: User;

  private n_sub: Subscription;
  public _unread: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificaciones: NotificationsService,
    public chat: SocketioService
  ) { }

  ngOnInit(): void {
    this._userSub = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.n_sub = this.notificaciones.unread.subscribe(n => {
      this._unread = n;
    });

    this.notificaciones.countUnread();
  }

  ngOnDestroy():void {
    this._userSub.unsubscribe();
  }

  async logout() {
    await this.chat.socketCloseConnection();
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
