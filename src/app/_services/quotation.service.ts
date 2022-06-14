import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';
import { Service, User } from '@app/_models';
import { QuotationRequestFormComponent } from '@app/empresas/catalogo/components/quotation-request-form/quotation-request-form.component';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  currentUser: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {
  }

  public loadQuotationGroups(){}

  public openQuotationForm(services: Service | number[]){
    const dialogRef = this.dialog.open(QuotationRequestFormComponent, {
      width: '560px',
      data: services
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }
}
