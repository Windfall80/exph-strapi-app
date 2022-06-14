import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  currentUser: User;
  public pending: number = 0;
  public unread: number = 0;
  public rated: number = 0;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.countPending();
    this.countUnread();
    this.countRated();
  }

  private countPending() {
    let params = new HttpParams().append('status_in',1);
    this.http.get<number>(`${environment.apiUrl}/quotations/count`, { params }).subscribe(
      (response: number)=>{
        this.pending = response;
      }
    );
  }

  private countUnread() {
    let params = new HttpParams()
      .append('offer.author', this.currentUser.id)
      .append('chat_room.unread_b_gt', 0);

    this.http.get<number>(`${environment.apiUrl}/quotations/count`, { params }).subscribe(
      (response: number)=>{
        this.unread += response;
      }
    );

    this.http.get<number>(`${environment.apiUrl}/offer-requests/count`, { params }).subscribe(
      (response: number)=>{
        this.unread += response;
      }
    );
  }

  private countRated() {
    let params = new HttpParams().append('status_in',7);
    this.http.get<number>(`${environment.apiUrl}/quotations/count`, { params }).subscribe(
      (response: number)=>{
        this.rated = response;
      }
    );
  }

}
