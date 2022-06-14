import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { Category, PaymentMethod, PaymentTerm, Service } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private filtersSubject: BehaviorSubject<any>;
  public filters: Observable<any>;
  public get currentFiltersValue(): any {
    return this.filtersSubject.value;
  }

  private categories$: Observable<Category[]>;
  private payment_methods$: Observable<PaymentMethod[]>;
  private payment_terms$: Observable<PaymentTerm[]>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.filtersSubject = new BehaviorSubject<any>({});
    this.filters = this.filtersSubject.asObservable();
  }

  public setFilters(_f: any){
    if( _f.categories && _f.categories.length == 0 ) delete _f.categories;
    if( _f.payment_terms && _f.payment_terms.length == 0 ) delete _f.payment_terms;
    if( _f.payment_methods && _f.payment_methods.length == 0 ) delete _f.payment_methods;
    this.filtersSubject.next(_f);
  }

  public getCategories(): Observable<Category[]> {
    if (!this.categories$) {
      let params = new HttpParams()
        .append('depth', 0)
        .append('_sort', 'position:ASC');

      this.categories$ = this.http.get<Category[]>(`${environment.apiUrl}/categories`, { params });
    }
    return this.categories$;
  }

  public getPaymentMethods() : Observable<PaymentMethod[]>{
    if (!this.payment_methods$) {
      this.payment_methods$ = this.http.get<PaymentMethod[]>(`${environment.apiUrl}/payment-methods`);
    }
    return this.payment_methods$;
  }

  public getPaymentTerms() : Observable<PaymentTerm[]>{
    if (!this.payment_terms$) {
      this.payment_terms$ = this.http.get<PaymentTerm[]>(`${environment.apiUrl}/payment-terms`);
    }
    return this.payment_terms$;
  }

}
