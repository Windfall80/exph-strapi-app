import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Share } from '@ngspot/rxjs/decorators';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { Service } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class ServicesService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  findById(id: string|number): Observable<Service>{
    return this.http.get<any>(`${environment.apiUrl}/services/${id}`);
  }

  @Share()
  findServices(_filters: any, _sort: string, _start: number, _limit: number): Observable<any>{
    let params = new HttpParams();
    Object.keys(_filters).forEach(function (key) {
      params = params.append(key, _filters[key]);
    });
    if(_sort) params = params.append('_sort', _sort);
    if(_start) params = params.append('_start', _start);
    if(_limit) params = params.append('_limit', _limit);

    return this.http.get<any>(`${environment.apiUrl}/services`, { params });
  }

  addFav(id: string|number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/services/add-fav/${id}`, {});
  }

  removeFav(id: string|number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/services/remove-fav/${id}`, {});
  }
}
