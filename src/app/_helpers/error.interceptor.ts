import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { AuthenticationService, AlertService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public alertController: AlertService,
    private _snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
          //console.log(err);
          if (err.status === 0) {
              this.openSnackBar('Uknown error.');
          }

          else if (err.status === 400) {
            if( typeof err.error?.message === 'string' )
              this.openSnackBar(err.error.message);
            return throwError(err);

          } else if (err.status === 401) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();

          }else if (err.status === 403) {
            if( typeof err.error?.message === 'string' )
              this.openSnackBar(err.error.message);
            return throwError(err);

          } else if (err.status === 404) {
              // redirect to not found page...
              //this.router.navigateByUrl("/404");

          }else if (err.status === 429) {
            return throwError(err);

          }  else if (err.status === 500) {
              this.openSnackBar(err.error.message);
          }

          const error = err.error.message || err.statusText;
          return throwError(error);
      }))
  }

  async presentError(message: string) {
      const alert = await this.alertController.open({
        title: 'Error',
        text: message,
        showCancelButton: false,
        confirmButtonText: 'Aceptar'
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
