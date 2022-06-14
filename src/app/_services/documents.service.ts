import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DocumentModalComponent } from '@app/components/document-modal/document-modal.component';
@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(
    public dialog: MatDialog,
  ) { }

  async presentModal(_clave: string) {
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      id: 'document-modal',
      width: '560px',
      minHeight: '150px',
      data: _clave
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }
}
