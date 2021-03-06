import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService, DocumentsService } from '@app/_services';
import { Plan, PlanPrice, User } from '@app/_models';

@Component({
  selector: 'app-subscripcion-expirada',
  templateUrl: './subscripcion-expirada.component.html',
  styleUrls: ['./subscripcion-expirada.component.scss']
})
export class SubscripcionExpiradaComponent implements OnInit, OnDestroy {
  _userSub;
  currentUser: User;
  initial = true;

  public renewForm: FormGroup;
  public wait = false;

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
    this._userSub = this.authenticationService.currentUser.subscribe((user: User) => {
      this.currentUser = user;

      if(this.currentUser.supplier?.current_period_end && moment().isSameOrBefore(moment(this.currentUser.supplier?.current_period_end), 'minute')) {
        this.router.navigate(['/proveedores']);
        return;
      } else {
        if(this.initial){
          this.initial = false;
          // refresh season info each time app loads
          this.authenticationService.refreshMe();
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadPlansList();
    this.initForms();
  }

  ngOnDestroy(): void {
    this._userSub.unsubscribe();
  }

  initForms(){
    this.renewForm = this.formBuilder.group({
      price: [null, [Validators.required]],
      paymentcard: [null, [Validators.required]],
      tos: [false, [Validators.requiredTrue]],
    });
  }

  private loadPlansList(){
    let params = new HttpParams().set('target', 'supplier').set('type', 'recurring');
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
    this.http.post<any>(`${environment.apiUrl}/suppliers/update-subscription`, formData).subscribe(
      (response: any)=>{
        this.wait = false;
        this.spinner.hide();

        this.authenticationService.setStorageUser(response);

        this.alert.open({
          title: "Suscripci??n actualizada",
          text: `Tu suscripci??n esta activa hasta el d??a ${ moment(response.supplier?.current_period_end).format('DD/MM/YYYY HH:mm') }.`, // Estos expirar??n despu??s de 30 d??as de la compra.
          showCancelButton: false
        }).then(()=>{
          this.router.navigateByUrl("/proveedores/perfil");
        });
      },
      (err)=>{
        this.wait = false;
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  isExpired(): boolean {
    if(this.currentUser.supplier?.current_period_end) return !moment(this.currentUser.supplier?.current_period_end).isSameOrBefore(moment(this.currentUser.supplier?.current_period_end), 'minute');
    return false;
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
