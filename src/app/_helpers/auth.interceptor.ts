import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const authState = this.authenticationService.isAuthenticated;
    const jwt = this.authenticationService._token;
    if (authState && jwt) { 
        //console.log(`current user found ${currentUser.token}`);
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${jwt}`
            }
        });
    }

    return next.handle(request);
  }
}
