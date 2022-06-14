import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip, MatChipListChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService, SocketioService} from '@app/_services';
import { Offer, OfferRequest, User } from '@app/_models';
import { IncidenciaReportarComponent } from '@app/proveedores/incidencias/incidencia-reportar/incidencia-reportar.component';


@Component({
  selector: 'app-oferta-relmpago-detalles',
  templateUrl: './oferta-relmpago-detalles.component.html',
  styleUrls: ['./oferta-relmpago-detalles.component.scss']
})
export class OfertaRelmpagoDetallesComponent { //implements OnInit
  currentUser: User;

  private id: string;
  request: OfferRequest;

  //public offerForm: FormGroup;
  public wait = false;

  matStars = {
    empty: `${environment.basehref}assets/images/star_outline.svg`,
    half: `${environment.basehref}assets/images/star_half.svg`,
    full: `${environment.basehref}assets/images/star.svg`,
  };

  constructor(
    private http: HttpClient,
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

    /*this.offerForm = this.formBuilder.group({
      amount: [null, [Validators.required]],
      file: [null, [Validators.required]],
      file_source: [null],
      check: [false, [Validators.requiredTrue]]
    });*/
    this.loadRequest();
  }

  loadRequest(){
    //const params = new HttpParams().set('id', this.id);
    this.http.get<OfferRequest>(`${environment.apiUrl}/offer-requests/${this.id}`).subscribe(
      (response: OfferRequest)=>{
        this.request = response;
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

  accept(){
    this.alert.open({
      title: "¿Estás seguro de aceptar esta solicitud de oferta?",
      text: "Una vez aceptada esta oferta podrás acceder a los datos y al chat con la empresa, por favor solo acepta si estás seguro de continuar con el proceso.",
    }).then(result=>{
      if(result){
        this.http.put<OfferRequest>(`${environment.apiUrl}/offer-requests/accept/${this.id}`, { }).subscribe(
          (response: OfferRequest)=>{
            console.log(response);
            this.request = response;
          },
          (err)=>{}
        );
      }
    });
  }

  discard(){
    this.alert.open({
      title: "¿Estás seguro de descartar esta solicitud de oferta?",
      text: "Una vez descartada esta cotización no podrás acceder a los datos ni al chat con el cliente, por favor solo rechazala si estas seguro de no querer continuar con el proceso. tu oferta seguira siendo visible mientras este vigente.",
    }).then(result=>{
      if(result){
        this.http.put<OfferRequest>(`${environment.apiUrl}/offer-requests/discard/${this.id}`, { }).subscribe(
          (response: OfferRequest)=>{
            this.request = response;
          },
          (err)=>{}
        );
      }
    });
  }

  canChat(){
    return [3,5].includes(this.request.status?.id!);
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }
}
