import { Component, OnInit, ViewChild,Output, EventEmitter, ElementRef   } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '@app/_services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StripeService, StripeCardComponent, StripeCardNumberComponent, StripeCardGroupDirective, StripeCardExpiryComponent, StripeCardCvcComponent } from 'ngx-stripe';
import { environment } from '@environments/environment';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { User } from '@app/_models';


@Component({
  selector: 'app-stripe-card',
  templateUrl: './stripe-card.component.html',
  styleUrls: ['./stripe-card.component.scss']
})
export class MyStripeCardComponent implements OnInit {
  @ViewChild(StripeCardGroupDirective) group: StripeCardGroupDirective;
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  @ViewChild(StripeCardExpiryComponent) exp: StripeCardExpiryComponent;
  @ViewChild(StripeCardCvcComponent) cvc: StripeCardCvcComponent;

  @Output() selectCard: EventEmitter<String> =   new EventEmitter();
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '14px',
        lineHeight: '22px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  cardBrand: string;
  error_msg: string;
  wait = false;

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };
  private token = '';
  public test: any;
  selectCardtmp: '';
  stripeTest: FormGroup;

  private user: User;
  private controller = 'uknown';

  constructor(private fb: FormBuilder,
    private stripeService: StripeService,
    private alert: AlertService,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.user = this.authenticationService.currentUserValue;

    if (this.user.type == 'company') this.controller = 'companies';
    else if (this.user.type == 'supplier') this.controller = 'suppliers';
  }

  ngOnInit(): void {
    this.pruebas();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    }, {
      updateOn: 'submit'
    });
  }

  async pruebas(){
    await this.http.get<any>(`${environment.apiUrl}/${this.controller}/cards`).subscribe(
      (response)=>{
        this.test = response;
      },
      (err)=>{}
    );
  }

  changeCard(e: any){
    this.selectCardtmp = e.value;
    this.selectCard.emit(e.value);
  }

  deleteCard(id: String){
    this.http.delete<any>(`${environment.apiUrl}/${this.controller}/remove-paymentmethod/${id}`).subscribe(
      (response: any)=>{
        this.pruebas();
      },
      (err)=>{}
    );
  }

  async createToken() {
    this.wait = true;
    this.error_msg = null!;
    const name = this.stripeTest.value.name;
    await this.stripeService
    .createPaymentMethod({
      type: 'card',
      card: this.card.element,
      billing_details: { name },
    })
    .subscribe((result) => {
      this.wait = false;
      if (result.paymentMethod) {
        // Send the payment method to your server
        this.token = result.paymentMethod.id;
        this.onSubmit();
      } else if (result.error) {
        // Error creating the token
        console.log(result.error.message);
        this.error_msg = result.error.message!;
      }
    });
  }

  onSubmit(){
    let data = { token: this.token, user: this.user }

    this.wait = true;
    this.error_msg = null!;
    this.http.post<any>(`${environment.apiUrl}/${this.controller}/addCard`, data).subscribe(
      (response: any)=>{
        if(response.type == "StripeCardError"){
          this.alert.open({
            title: "¡ERROR!",
            text: this.getMessageByCode(response.raw.decline_code),
          })
        } else {
          this.wait = false;
          //this.stripeTest.patchValue({ name: ''});
          this.stripeTest.reset();
          Object.keys(this.stripeTest.controls).forEach(key => {
            this.stripeTest.get(key)?.setErrors(null) ;
          });

          this.card.element.clear();
          this.exp.element.clear();
          this.cvc.element.clear();
          this.pruebas();
        }
      },
      (err)=>{
        console.log(err);
        this.wait = false;
        //this.error_msg = err;
      }
    )
  }

  getMessageByCode(code: any){
    let message = '';
    switch (code) {
      case "insufficient_funds":
          message = 'Su tarjeta no tiene fondos suficientes.';
          break;
      case "lost_card":
          message = 'Tu tarjeta fue rechazada.';
          break;
      case "expired_card":
            message = 'Tu tarjeta ha caducado';
            break;
      default:
          message = 'Se produjo un error al procesar su tarjeta. Vuelva a intentarlo.';
    }
    return message;

  }

  stripeFocus(element: HTMLDivElement){
    element.classList.add('mat-focused');
  }

  stripeBlur(element: HTMLDivElement){
    element.classList.remove('mat-focused');
  }

  stripeChangue($event: any, element: HTMLDivElement) {
    console.log($event);
    if("brand" in $event){
      this.cardBrand = $event.brand;
    }
    if($event.error){
      element.classList.add('mat-form-field-invalid');
    } else {
      element.classList.remove('mat-form-field-invalid');
    }
  }
}
