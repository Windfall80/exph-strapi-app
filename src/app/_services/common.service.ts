import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { Service, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  currentUser: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  loadUsers(){
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
}
