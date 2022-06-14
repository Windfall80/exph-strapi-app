import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { OfferRequest, Quotation, User } from '@app/_models';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  currentUser: User;

  public quotations: Quotation[] = [];
  public requests: OfferRequest[] = [];

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
    ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadQuotations();
    this.loadOfferRequests();
  }

  loadQuotations(){
    const params = new HttpParams()
      .set('_sort', 'created_at:DESC')
      .set('_limit', 5);
    this.http.get<Quotation[]>(`${environment.apiUrl}/quotations`, { params }).subscribe(
      (response: Quotation[])=>{
        this.quotations = response;
      },
      (err)=>{}
    );
  }

  loadOfferRequests(){
    const params = new HttpParams()
      .set('_sort', 'created_at:DESC')
      .set('_limit', 5);
    this.http.get<OfferRequest[]>(`${environment.apiUrl}/offer-requests`, { params }).subscribe(
      (response: OfferRequest[])=>{
        this.requests = response;
      },
      (err)=>{}
    );
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
