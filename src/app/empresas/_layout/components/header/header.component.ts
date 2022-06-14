import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { environment } from '@environments/environment';
import { AuthenticationService, NotificationsService, SocketioService} from '@app/_services';
import { User } from '@app/_models';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() snav: MatSidenav;
  @Input() sidebar: String;

  _userSub: Subscription;
  currentUser: User;

  departaments_menu: any;

  private n_sub: Subscription;
  public _unread: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationsService: NotificationsService,
    public chat: SocketioService
  ) {
    this._userSub = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.loadMenu();
  }

  ngOnInit(): void {
    this.n_sub = this.notificationsService.unread.subscribe(n => {
      this._unread = n;
    });

    this.notificationsService.countUnread();
  }

  ngOnDestroy():void {
    this._userSub.unsubscribe();
    this.n_sub.unsubscribe();
  }

  async logout() {
    await this.chat.socketCloseConnection();
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  loadMenu(){
    const params = new HttpParams();
    this.http.get<any>(`${environment.apiUrl}/nav-catalog`, { params }).subscribe(
      (response: any)=>{
        this.departaments_menu = response;
      },
      (err)=>{}
    );
  }

}
