import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Share } from '@ngspot/rxjs/decorators';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { Supplier } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class SuppliersService {

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}

  findById(id: string|number): Observable<Supplier>{
    return this.http.get<any>(`${environment.apiUrl}/suppliers/${id}`);
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

    return this.http.get<any>(`${environment.apiUrl}/suppliers`, { params });
  }

  addFav(id: string|number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/suppliers/add-fav/${id}`, {});
  }

  removeFav(id: string|number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/suppliers/remove-fav/${id}`, {});
  }
}
