import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss']
})
export class DocumentModalComponent implements OnInit {
  @ViewChild('docScroll', {static: false}) scrollFrame: ElementRef;
  private scrollContainer: any;
  public data: any;
  public hidden = true;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<DocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public _clave: string
  ) { }

  ngOnInit(): void {
    this.spinner.show("docs-spiner");
    this.hidden = true;
    this.http.get<any>(`${environment.apiUrl}/${this._clave}`).subscribe(
      (response: any)=>{
        this.data = response;

        setTimeout(()=>{
          this.scrollToTop();
          this.hidden = false;
          this.spinner.hide("docs-spiner");
        },250);

      },
      (err)=>{
        this.spinner.hide("docs-spiner");
      }
    );
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
  }

  private scrollToTop(): void {
    if(this.scrollContainer)
    this.scrollContainer.scroll({
      top: 0,
      left: 0,
      //behavior: 'smooth'
    });
  }

}
