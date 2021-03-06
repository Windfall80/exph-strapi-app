import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService, DocumentsService } from '@app/_services';
import { Company, Plan, PlanPrice, User } from '@app/_models';
@Component({
  selector: 'app-plan-editar',
  templateUrl: './plan-editar.component.html',
  styleUrls: ['./plan-editar.component.scss']
})
export class PlanEditarComponent implements OnInit {
  currentUser: User;
  currentPlanPrice: PlanPrice;

  public renewForm: FormGroup;
  public wait = false;

  public profile: Company;
  public plan_prices: PlanPrice[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private documents: DocumentsService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    /*if(this.currentUser.company?.current_period_end){
      if(moment().isSameOrBefore(moment(this.currentUser.company?.current_period_end), 'minute')) {
        this.router.navigate(['/empresas']);
        return;
      }
    }*/

    this.loadCurrentPlanPrice();
    this.loadProfile();
    this.loadPlansList();
    this.initForms();
  }

  initForms(){
    this.renewForm = this.formBuilder.group({
      price: [null, [Validators.required]],
      paymentcard: [null, [Validators.required]],
      tos: [false, [Validators.requiredTrue]],
    });
  }

  private loadProfile(){
    this.http.get<Company>(`${environment.apiUrl}/companies/profile`).subscribe(
      (response: Company)=>{
        this.profile = response;
      },
      (err)=>{ }
    );
  }

  private loadCurrentPlanPrice(){
    let params = new HttpParams();
    this.http.get<PlanPrice>(`${environment.apiUrl}/plan-prices/${this.currentUser.company?.price}`, { params }).subscribe(
      (response: PlanPrice)=>{
        this.currentPlanPrice = response;
      },
      (err)=>{}
    );
  }

  private loadPlansList(){
    let params = new HttpParams().set('target', 'company').set('type', 'recurring');
    this.http.get<PlanPrice[]>(`${environment.apiUrl}/plan-prices`, { params }).subscribe(
      (response: PlanPrice[])=>{
        this.plan_prices = response;
      },
      (err)=>{}
    );
  }

  changeCard(e: any ){
    this.renewForm.get('paymentcard')?.setValue(e);
  }

  onSubmit(){
    if (this.renewForm.invalid) {
      console.log("form invalid");
      this.renewForm.markAllAsTouched();
      return;
    }

    const formData = this.renewForm.getRawValue();

    this.wait = true;
    this.spinner.show();
    this.http.post<any>(`${environment.apiUrl}/companies/update-subscription`, formData).subscribe(
      (response: any)=>{
        this.wait = false;
        this.spinner.hide();

        this.authenticationService.setStorageUser(response);

        this.alert.open({
          title: "Suscripci??n actualizada",
          text: `Tu suscripci??n esta activa hasta el d??a ${ moment(response.company?.current_period_end).format('DD/MM/YYYY HH:mm') }.`, // Estos expirar??n despu??s de 30 d??as de la compra.
          showCancelButton: false
        }).then(()=>{
          this.router.navigateByUrl("/empresas/perfil");
        });
      },
      (err)=>{
        this.wait = false;
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  cancelSubscription(){
    this.alert.open({
      title: "??Cancelar renovaci??n de suscripci??n?",
      text: `Tu suscripci??n se cancelara al final de el periodo actual y permanecer?? activa hasta el d??a ${ moment(this.currentUser.company?.current_period_end).format('DD/MM/YYYY HH:mm') }.`, // Estos expirar??n despu??s de 30 d??as de la compra.
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'SI'
    }).then((result)=>{
      if(result) {
        this.spinner.show();
        this.http.post<any>(`${environment.apiUrl}/companies/cancel-subscription`, {}).subscribe(
          (response: any)=>{
            this.spinner.hide();
            this.authenticationService.setStorageUser(response);
            this.alert.open({
              title: "Suscripci??n actualizada",
              text: `Tu suscripci??n esta activa hasta el d??a ${ moment(response.company?.current_period_end).format('DD/MM/YYYY HH:mm') }.`,
              showCancelButton: false
            }).then(()=>{
              this.router.navigateByUrl("/empresas/perfil");
            });
          },
          (err)=>{
            this.spinner.hide();
            console.log(err);
          }
        );
      }
    });
  }

  showTOS($event: any) {
    $event.preventDefault();
    this.documents.presentModal('terms-of-service');
  }

  showPP($event: any) {
    $event.preventDefault();
    this.documents.presentModal('privacy-policy');
  }
}
