import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Share } from '@ngspot/rxjs/decorators';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { Offer } from '@app/_models';
import { OfferRequestFormComponent } from '@app/empresas/catalogo/components/offer-request-form/offer-request-form.component';
import { OfferRequest } from '@app/_models/offer-request';

@Injectable({ providedIn: 'root' })
export class OffersService {
  private requestedSubject = new BehaviorSubject<number>(null!);
  public requested$ = this.requestedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}

  findById(id: string): Observable<Offer>{
    return this.http.get<any>(`${environment.apiUrl}/offers/${id}`);
  }

  @Share()
  find(_filters: any, _sort: string, _start: number, _limit: number): Observable<any>{
    let params = new HttpParams();
    Object.keys(_filters).forEach(function (key) {
      params = params.append(key, _filters[key]);
    });
    if(_sort) params = params.append('_sort', _sort);
    if(_start) params = params.append('_start', _start);
    if(_limit) params = params.append('_limit', _limit);

    return this.http.get<any>(`${environment.apiUrl}/offers`, { params });
  }

  public openRequestForm(offer: Offer): Promise<OfferRequest>{
    const dialogRef = this.dialog.open(OfferRequestFormComponent, {
      width: '560px',
      data: offer
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }

  addFav(id: string|number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/offers/add-fav/${id}`, {});
  }

  removeFav(id: string|number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/offers/remove-fav/${id}`, {});
  }

  setRequestedOffer(id: number) {
    this.requestedSubject.next(id);
  }
}
