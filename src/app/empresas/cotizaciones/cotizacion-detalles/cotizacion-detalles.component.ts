import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip, MatChipListChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService, SocketioService } from '@app/_services';
import { Quotation, QuotationOffer, User } from '@app/_models';
import { IncidenciaReportarComponent } from '@app/empresas/incidencias/incidencia-reportar/incidencia-reportar.component';


@Component({
  selector: 'app-cotizacion-detalles',
  templateUrl: './cotizacion-detalles.component.html',
  styleUrls: ['./cotizacion-detalles.component.scss']
})
export class CotizacionDetallesComponent { //implements OnInit
  @ViewChild('scroll') private myScrollContainer: ElementRef;

  currentUser: User;

  private id: string;
  private groupId: string;
  quotation: Quotation;

  users: any[] = [];
  rating_motives: any[] = [];
  discard_motives: any[] = [];

  public deliveryForm: FormGroup;
  public ratingForm: FormGroup;
  public minDate = new Date();
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
      this.id = params.get('cotizacionId')!;
      this.groupId = params.get('grupoId')!;

      this.ngOnInit();
    });

    this.loadUsers();
    this.loadDiscardMotives();
    this.loadRatingMotives();
  }

  ngOnInit(): void {
    this.deliveryForm = this.formBuilder.group({
      deliver_at: [null, [Validators.required]],
    });

    this.ratingForm = this.formBuilder.group({
      rating: [null, [Validators.required]],
      motives: [null, [Validators.required]],
      rating_details: [null, []]
    });

    this.loadQuotation();
    this.loadUsers();
    this.loadDiscardMotives();
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

  loadUsers(){
    const params = new HttpParams().set('id_ne', this.currentUser.id);
    this.http.get<User[]>(`${environment.apiUrl}/users`, { params }).subscribe(
      (response: User[])=>{
        this.users = response.map(x => { return {id: x.id, name: x.username} });
      },
      (err)=>{}
    );
  }

  loadDiscardMotives(){
    const params = new HttpParams();
    this.http.get<any[]>(`${environment.apiUrl}/discard-motives`, { params }).subscribe(
      (response: any[])=>{
        this.discard_motives = response;
      },
      (err)=>{}
    );
  }

  loadRatingMotives(){
    const params = new HttpParams();
    this.http.get<any[]>(`${environment.apiUrl}/rating-motives`, { params }).subscribe(
      (response: any[])=>{
        this.rating_motives = response;
      },
      (err)=>{}
    );
  }

  share(): void{
    this.alert.open({
      title: "¿Quieres compartir esta cotización?",
      text: "Puedes compartir esta cotización con alguien de tu equipo, sin embargo una vez la asignes ya no podrás contestar los mensajes del chat.",
      input: 'select',
      inputLabel: "Usuario",
      inputPlaceholder: "Nombre del usuario",
      inputOptions: this.users,
      inputRequired: true
    }).then(result=>{
      if(result){
        let {isConfirmed, value} = result;
        if(isConfirmed && value){

          this.http.post<any>(`${environment.apiUrl}/quotations/share/${this.id}`, { user: value }).subscribe(
            (response: any)=>{
              console.log(response);
              this.router.navigateByUrl('/empresas/cotizaciones');
            },
            (err)=>{}
          );
        }
      }
    });
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

  interested(){
    this.alert.open({
      title: "¿Te Interesa esta cotización?",
      text: "Una vez aceptada esta cotización podrás acceder al chat con el proveedor, por favor solo acepta si estas seguro de continuar con el proceso.",
    }).then(result=>{
      if(result){
        this.http.put<Quotation>(`${environment.apiUrl}/quotations/interest/${this.id}`, { }).subscribe(
          (response: Quotation)=>{
            console.log(response);
            this.quotation = response;
          },
          (err)=>{}
        );
      }
    });
  }

  close(){
    this.alert.open({
      title: "¿Estás seguro de cerrar el trato?",
      text: "Una vez aceptada esta cotización podrás calificar a el proveedor, por favor solo acepta si estás seguro de cerrar el trato con este proveedor.",
    }).then(result=>{
      if(result){
        this.http.put<Quotation>(`${environment.apiUrl}/quotations/close/${this.id}`, { }).subscribe(
          (response: Quotation)=>{
            console.log(response);
            this.quotation = response;
          },
          (err)=>{}
        );
      }
    });
  }

  discard(){
    this.alert.open({
      title: "¿Estás seguro de descartar esta cotización?",
      text: "Una vez descartada esta cotización no podrás acceder a los datos y ni al chat con el proveedor, por favor solo rechazala si estas seguro de no querer continuar con el proceso.",
      input: 'pills',
      multiple: true,
      inputLabel: "Ayuda al proveedor a mejorar contandole el motivo de tu descarte:",
      inputOptions: this.discard_motives,
      inputRequired: true,
      showDetails: (value: number[]) => {
        if(!value) return false;
        return value.includes(6);
      }
    }).then(result=>{
      if(result){
        let {isConfirmed, value, details} = result;
        if(isConfirmed){
          this.http.put<Quotation>(`${environment.apiUrl}/quotations/discard/${this.id}`, { discard_motives: value, discard_details: details }).subscribe(
            (response: Quotation)=>{
              this.quotation = response;
            },
            (err)=>{}
          );
        }
      }
    });
  }

  reject(){
    this.alert.open({
      title: "¿Estás seguro de Rechazar esta cotización?",
      text: "Una vez descartada esta cotización no podrás acceder a los datos y ni al chat con el proveedor, por favor solo rechazarla si estás seguro de no querer continuar con el proceso.",
      input: 'textarea',
      inputPlaceholder: "Ayuda a tu proveedor a mejorar, cuentale el motivo del rechazo",
      inputOptions: this.discard_motives,
      inputRequired: true,
      showDetails: (value: number[]) => {
        if(!value) return false;
        return value.includes(6);
      }
    }).then(result=>{
      if(result){
        let {isConfirmed, value} = result;
        if(isConfirmed){
          this.http.put<Quotation>(`${environment.apiUrl}/quotations/reject/${this.id}`, { reject_details: value }).subscribe(
            (response: Quotation)=>{
              this.quotation = response;
            },
            (err)=>{}
          );
        }
      }
    });
  }

  setDelivery(){
    if (this.deliveryForm.invalid) {
      console.log("form invalid");
      this.deliveryForm.markAllAsTouched();
      return;
    }

    this.alert.open({
      title: "¿Estás seguro de establecer este plazo?",
      text: "No podrás calificar a este proveedor hasta la fecha establecida de entrega, por favor solo acepta si estás seguro.",
    }).then(result=>{
      if(result){
        let data = this.deliveryForm.getRawValue();
        this.wait = true;
        this.http.put<QuotationOffer>(`${environment.apiUrl}/quotations/set-delivery/${this.id}`, data).subscribe(
          (response: QuotationOffer)=>{
            console.log(response);
            this.wait = false;
            this.quotation.offer = response;
          },
          (err)=>{
            this.wait = false;
          }
        );
      }
    });
  }

  setRating(){
    if (this.ratingForm.invalid) {
      console.log("form invalid");
      this.ratingForm.markAllAsTouched();
      return;
    }

    this.alert.open({
      title: "¿Estás seguro de tu calificación?",
      text: "Una vez calificada tu experiencia la cotización se marcará como finalizada y ya no podrás enviarle mensajes a tu proveedor ni modificar su puntuación.",
    }).then(result=>{
      if(result){
        let data = this.ratingForm.getRawValue();
        this.wait = true;
        this.http.put<any>(`${environment.apiUrl}/quotations/set-rating/${this.id}`, data).subscribe(
          (response: any)=>{
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

  onRatingSet(rating: number): void {
    this.ratingForm.get('rating')?.setValue(rating);
  }

  canRate(){
    if(!this.quotation.offer?.deliver_at) return false;
    return moment().isSameOrAfter(moment(this.quotation.offer?.deliver_at), 'day');
  }

  toggleMotive(chip: MatChip) {
    chip.toggleSelected(true);
  }

  canChat(){
    return (this.currentUser.id == this.quotation.user?.id) && [3,5].includes(this.quotation.status?.id!);
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }



}
