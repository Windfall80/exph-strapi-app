import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl } from '@angular/forms';
import { map, catchError, mergeAll, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthenticationService } from '@app/_services/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class UniqueEmail implements AsyncValidator {

  constructor(private authService: AuthenticationService) {}

  validate = (control: FormControl, id?: number) => {
    const { value } = control;
    return this.authService.emailAvailable(value, id)
      .pipe(
        map((count: number) => {
          if(count > 0) return { unique: true };
          return null;
        }),
        catchError((err) => {
          return of({ connection: true });
        })
      );
  };
}
