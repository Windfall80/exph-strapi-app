import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { User } from '@app/_models';


@Component({
  selector: 'app-puntos',
  templateUrl: './puntos.component.html',
  styleUrls: ['./puntos.component.scss']
})
export class PuntosComponent implements OnInit {


  currentUser: User;
  public points = 0;
  public ticket_exchangue_price: number;
  public ticket_purchase_price: number;
  public exchangeForm: FormGroup;
  public purchaseForm: FormGroup;
  public wait = false;
  private token = '';
  public paymentcard = '';
  public test = { data: [
    { card: {
      brand: '',
      last4: ''
    }}
  ]}
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.getPoints();
    this.getConfig();

    this.initForms();
  }
  cargoprueba(){
    this.http.get<number>(`${environment.apiUrl}/suppliers/buy-points`).subscribe(
      (response: number)=>{
        this.points = response;
      },
      (err)=>{}
    );
  }
  cargoprueba2(){
    this.http.get<number>(`${environment.apiUrl}/suppliers/remove-paymentmethod`).subscribe(
      (response: number)=>{
        this.points = response;
      },
      (err)=>{}
    );
  }
  changeCard(e: any ){
    this.paymentcard = e;
  }

  initForms(){
    this.exchangeForm = this.formBuilder.group({
      qty: [1, [Validators.required]],
      check: [false, [Validators.requiredTrue]],
    });
    this.purchaseForm = this.formBuilder.group({
      qty: [1, [Validators.required]],
      check: [false, [Validators.requiredTrue]],
    });

  }

  getPoints(){
    this.http.get<number>(`${environment.apiUrl}/suppliers/avalible-points`).subscribe(
      (response: number)=>{
        this.points = response;
      },
      (err)=>{}
    );
  }

  getConfig(){
    this.http.get<any>(`${environment.apiUrl}/configs/ticket-exchange-price`).subscribe(
      (response: any)=>{
        this.ticket_exchangue_price = Number(response.value);
      }
    );
    this.http.get<any>(`${environment.apiUrl}/configs/ticket-purchase-price`).subscribe(
      (response: any)=>{
        this.ticket_purchase_price = Number(response.value);
      }
    );
  }

  onExchangue(){
    if (this.exchangeForm.invalid) {
      console.log("form invalid");
      this.exchangeForm.markAllAsTouched();
      return;
    }

    let qty = this.exchangeForm.get('qty')?.value;
    let total = qty * this.ticket_exchangue_price;
    this.alert.open({
      title: "¿Estás seguro de realizar esta compra?",
      text: `Utilizáras ${total} puntos en la compra de ${qty} ticket(s).`, // Estos expirarán después de 30 días de la compra.
    }).then(result=>{
      if(result){
        let data = this.exchangeForm.getRawValue();
        delete data.check;

        this.wait = true;
        this.http.post<any>(`${environment.apiUrl}/offer-tickets/exchange`, data).subscribe(
          (response: any)=>{
            console.log(response);
            this.wait = false;
            this.initForms();
            this.points = response.points;
          },
          (err)=>{
            this.wait = false;
          }
        );
      }
    });
  }
  onPurchase(){
    if (this.purchaseForm.invalid) {
      console.log("form invalid");
      this.purchaseForm.markAllAsTouched();
      return;
    }

    let qty = this.purchaseForm.get('qty')?.value;
    let total = qty * this.ticket_purchase_price;
    this.alert.open({
      title: "¿Estás seguro de realizar esta compra?",
      text: `Pagaras $ ${total} MXN. por ${qty} ticket(s).`, // Estos expirarán después de 30 días de la compra.
    }).then(result=>{
      if(result){
        let data = this.purchaseForm.getRawValue();
        delete data.check;
        data.paymentcard = this.paymentcard;
        this.wait = true;
        this.http.post<any>(`${environment.apiUrl}/offer-tickets/purchase`, data).subscribe(
          (response: any)=>{
            console.log(response);
            this.wait = false;
            this.initForms();
            this.alert.open({
              title: "¡Pago exitoso!",
              text: `Se han cobrado ${total} MXN. por ${qty} ticket(s).`, // Estos expirarán después de 30 días de la compra.
            })
          },
          (err)=>{
            this.wait = false;
          }
        );
      }
    });
  }

}
