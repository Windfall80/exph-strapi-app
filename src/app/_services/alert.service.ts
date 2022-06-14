import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertData } from "@app/_models";
import { AlertTemplateComponent } from '@app/components/alert-template/alert-template.component';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public dialog: MatDialog) { }

  open(data: AlertData): Promise<any> {
    let width = data.width? data.width : '477px';
    const dialogRef = this.dialog.open(AlertTemplateComponent, {
      width: width,
      data: data
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }
}
