import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { Quotation, User } from '@app/_models';
import { IncidenciaReportarComponent } from '@app/proveedores/incidencias/incidencia-reportar/incidencia-reportar.component';


@Component({
  selector: 'app-cotizacion-detalles',
  templateUrl: './cotizacion-detalles.component.html',
  styleUrls: ['./cotizacion-detalles.component.scss']
})
export class CotizacionDetallesComponent { //implements OnInit
  currentUser: User;
  private id: string;
  quotation: Quotation;

  public offerForm: FormGroup;
  public wait = false;
  matStars = {
    empty: `${environment.basehref}assets/images/star_outline.svg`,
    half: `${environment.basehref}assets/images/star_half.svg`,
    full: `${environment.basehref}assets/images/star.svg`,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private alert: AlertService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {
    this.currentUser = authenticationService.currentUserValue;

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;

      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.offerForm = this.formBuilder.group({
      amount: [null, [Validators.required]],
      file: [null],//, [Validators.required]
      file_source: [null],
      check: [false, [Validators.requiredTrue]]
    });
    this.loadQuotation();
  }


  loadQuotation(){
    //const params = new HttpParams().set('id', this.id);
    this.http.get<Quotation>(`${environment.apiUrl}/quotations/${this.id}`).subscribe(
      (response: Quotation)=>{
        this.quotation = response;
      },
      (err)=>{}
    );
  }

  openReport(): void {
    const dialogRef = this.dialog.open(IncidenciaReportarComponent, {
      width: '677px',
      panelClass: ['dialog-py-48', 'dialog-px-75'],
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  setOffer(){
    if (this.offerForm.invalid) {
      console.log("form invalid");
      this.offerForm.markAllAsTouched();
      return;
    }

    this.alert.open({
      title: "¿Estás seguro de establecer este monto?",
      text: "Una vez establecido el monto de la cotización esta quedará pendiente y para ser revisado por el cliente.",
    }).then(result=>{
      if(result){
        const formData = new FormData();
        let data = this.offerForm.getRawValue();
        delete data.file;
        delete data.file_source;
        delete data.check;
        // apend all data
        formData.append('data', JSON.stringify(data) );
        // files
        if(this.offerForm.get('file')?.value)
          formData.append(`files.file`, this.offerForm.get('file_source')?.value, this.offerForm.get('file')?.value.split("\\").pop());

        this.wait = true;
        this.http.put<Quotation>(`${environment.apiUrl}/quotations/set-offer/${this.id}`, formData).subscribe(
          (response: Quotation)=>{
            console.log(response);
            this.wait = false;
            this.quotation = response;
          },
          (err)=>{
            this.wait = false;
          }
        );
      }
    });
  }

  canChat(){
    if(!this.quotation) return false;
    return [3,5].includes(this.quotation.status?.id!);
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
