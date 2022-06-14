import { Component, OnInit, ViewChild } from '@angular/core';

import { StripeService, StripeCardNumberComponent, StripeCardGroupDirective, StripeCardExpiryComponent, StripeCardCvcComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-stripe-card-form',
  templateUrl: './stripe-card-form.component.html',
  styleUrls: ['./stripe-card-form.component.scss']
})
export class StripeCardFormComponent implements OnInit {
  @ViewChild(StripeCardGroupDirective) group: StripeCardGroupDirective;
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  @ViewChild(StripeCardExpiryComponent) exp: StripeCardExpiryComponent;
  @ViewChild(StripeCardCvcComponent) cvc: StripeCardCvcComponent;
  stripeTest: FormGroup;

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
  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  cardBrand: string;
  error_msg: string;
  wait = false;

  constructor(
    private formBuilder: FormBuilder,
    private stripeService: StripeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.stripeTest = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  async createToken() {
    if (this.stripeTest.invalid) {
      console.log("card form invalid");
      this.stripeTest.markAllAsTouched();
      return;
    }

    this.error_msg = null!;
    this.spinner.show();
    const name = this.stripeTest.value.name;

    try{
      let result = await this.stripeService.createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: { name },
      }).toPromise();

      if (result.paymentMethod) {
        // Send the payment method to your server
        return result.paymentMethod.id;
      } else if (result.error) {
        this.spinner.hide();
        // Error creating the token
        console.log(result.error);
        this.error_msg = result.error.message!;
        return;
      }
      return;
    } catch(err){
      console.log(err);
      return;
    }
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
      this.error_msg = $event.error.message!;
      element.classList.add('mat-form-field-invalid');
    } else {
      this.error_msg = null!;
      element.classList.remove('mat-form-field-invalid');
    }
  }

}
