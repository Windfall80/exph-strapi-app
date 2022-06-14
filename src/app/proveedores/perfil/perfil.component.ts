import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from '@environments/environment';
import { Supplier, User } from '@app/_models';
import { StripeService  } from 'ngx-stripe';
import { AuthenticationService } from '@app/_services';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  currentUser: User;

  public profile: Supplier;
  requested: number;
  accepted: number;
  rejected: number;
  sub_end: number;
  matStars = {
    empty: `${environment.basehref}assets/images/star_outline.svg`,
    half: `${environment.basehref}assets/images/star_half.svg`,
    full: `${environment.basehref}assets/images/star.svg`,
  };

  constructor(
    private http: HttpClient,
    private stripeService: StripeService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadProfile();
    this.countRequested();
    this.countAccepted();
    this.countRejected();
    //this.getSubscriptionDate();
  }

  private loadProfile(){
    this.http.get<Supplier>(`${environment.apiUrl}/suppliers/profile`).subscribe(
      (response: Supplier)=>{
        this.profile = response;
      },
      (err)=>{ }
    );
  }

  private countRequested() {
    let params = new HttpParams();
    this.http.get<number>(`${environment.apiUrl}/quotations/count`, { params }).subscribe(
      (response: number)=>{
        this.requested = response;
      }
    );
  }

  private countAccepted() {
    let params = new HttpParams().append('status_in',5).append('status_in',7);
    this.http.get<number>(`${environment.apiUrl}/quotations/count`, { params }).subscribe(
      (response: number)=>{
        this.accepted = response;
      }
    );
  }

  private countRejected() {
    let params = new HttpParams().append('status_in',4).append('status_in',6);
    this.http.get<number>(`${environment.apiUrl}/quotations/count`, { params }).subscribe(
      (response: number)=>{
        this.rejected = response;
      }
    );
  }

  public exportReport() {
    let params = new HttpParams();
    this.http.get<any>(`${environment.apiUrl}/suppliers/export-quotations-report`, { params, responseType: 'blob' as 'json',observe: 'response' }).subscribe(
      (response: any)=>{
        var disposition = response.headers.get('content-disposition');
        var matches = /"([^"]*)"/.exec(disposition);
        var filename = (matches != null && matches[1] ? matches[1] : 'quotations-export.xlsx');

        let dataType = response.body.type;
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        if (filename)
            downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    );
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

  getSubscriptionDate(){
    this.http.get<any>(`${environment.apiUrl}/suppliers/subscription_date`).subscribe(
      (response: any)=>{
        this.sub_end = response.current_period_start*1000;
      },
      (err)=>{ }
    );
  }

}
