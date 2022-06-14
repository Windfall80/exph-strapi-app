import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { environment } from '@environments/environment';
import { AuthenticationService, DocumentsService } from '@app/_services';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch, UniqueUsername, UniqueEmail } from '@app/_validators';
import { Company, CompanyType, Plan, PlanPrice } from '@app/_models';

import { NgxSpinnerService } from "ngx-spinner";
import { StripeCardFormComponent } from '@app/components/stripe-card-form/stripe-card-form.component';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss'],
})
export class RegistroEmpresaComponent implements OnInit {
  @ViewChild(StripeCardFormComponent) cardForm: StripeCardFormComponent;

  public registerForm: FormGroup;
  bypassValidations = false;
  get firstFormGroup() { return this.registerForm.get('firstFormGroup') as FormGroup; }
  get secondFormGroup() { return this.registerForm.get('secondFormGroup') as FormGroup; }
  get thirdFormGroup() { return this.registerForm.get('thirdFormGroup') as FormGroup; }
  get fourthFormGroup() { return this.registerForm.get('fourthFormGroup') as FormGroup; }
  get paymentsFormArray() { return this.fourthFormGroup.get('payments') as FormArray; }

  public types: CompanyType[] = [];
  public prices: PlanPrice[] = [];
  public municipios = [{id: "1", name: 'Cajeme'},{id: "2", name: 'Hermosillo'},{id: "3", name: 'Alamos'}];
  public wait = false;

  public op_cc= false;
  private token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private uniqueUsername: UniqueUsername,
    private uniqueEmail: UniqueEmail,
    private spinner: NgxSpinnerService,
    private documents: DocumentsService
  ) {
    this.registerForm = this.formBuilder.group({
      firstFormGroup: this.formBuilder.group({
        name: [null, [Validators.required]],
        rfc: [null, [Validators.required]],
        representative_name: [null, [Validators.required]],
        business_name: [null, [Validators.required]],
        address: [null, [Validators.required]],
        interior_number: [null, []],
        postal_code: [null, [Validators.required]],
        country: [null, [Validators.required]],
        state: [null, [Validators.required]],
        city: [null, [Validators.required]],
        municipality: [null, [Validators.required]],
        neighborhood: [null, [Validators.required]],
        phone: [null, [Validators.required]],

        //files
        representative_id: [null, [Validators.required]],
        representative_id_source: [null],
        //fiscal_situation: [null, [Validators.required]],
        //fiscal_situation_source: [null],
        truthfulness_protest: [false, [Validators.requiredTrue]],
      }),
      secondFormGroup: this.formBuilder.group({
        type: [null, [Validators.required]],
        description: [null, [Validators.required]],
      }),
      thirdFormGroup: this.formBuilder.group({
        profile_picture: this.formBuilder.control(null,{validators: [], updateOn: 'change'}),
        profile_picture_source: [null],

        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        username: [null, [Validators.required, Validators.pattern('[A-Za-z0-9\-_\.]{6,20}')], uniqueUsername.validate],
        email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')], uniqueEmail.validate],
        re_email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        re_password: [null, [Validators.required]],
      },{
        validators: [MustMatch('email','re_email'), MustMatch('password','re_password')],
        updateOn: 'blur'
      }),
      fourthFormGroup: this.formBuilder.group({
        price: [null, [Validators.required]],

        tos: [false, [Validators.requiredTrue]],
        susc_boletin: [false]
      }),

    });
  }

  ngOnInit(): void {
    this.loadTypesList();
    this.loadPlansList();
  }

  private loadPlansList(){
    let params = new HttpParams().set('target', 'company');
    this.http.get<PlanPrice[]>(`${environment.apiUrl}/plan-prices`, {params}).subscribe(
      (response: PlanPrice[])=>{
        this.prices = response;
      },
      (err)=>{ }
    );
  }

  private loadTypesList(){
    this.http.get<CompanyType[]>(`${environment.apiUrl}/company-types`).subscribe(
      (response: CompanyType[])=>{
        this.types = response;
      },
      (err)=>{ }
    );
  }

  async createToken() {
    if (this.registerForm.invalid) {
      this.fourthFormGroup.markAllAsTouched();
      return;
    }

    if(!this.isFree() || (this.isFree() && this.op_cc)){
      let cardResult = await this.cardForm.createToken();
      if( cardResult ) {
        this.token = cardResult;
        this.onSubmit();
      }
      return;
    }

    this.onSubmit();
 }

  onSubmit(){
    if (this.registerForm.invalid) {
      console.log("form invalid");
      this.fourthFormGroup.markAllAsTouched();
      return;
    }

    console.log("submiting form...");
    const formData = new FormData();
    // first step
    const data: any = {
      name: this.firstFormGroup.get('name')?.value,
      rfc: this.firstFormGroup.get('rfc')?.value,
      representative_name: this.firstFormGroup.get('representative_name')?.value,
      business_name: this.firstFormGroup.get('business_name')?.value,
      address: this.firstFormGroup.get('address')?.value,
      interior_number: this.firstFormGroup.get('interior_number')?.value,
      postal_code: this.firstFormGroup.get('postal_code')?.value,
      country: this.firstFormGroup.get('country')?.value,
      state: this.firstFormGroup.get('state')?.value,
      city: this.firstFormGroup.get('city')?.value,
      municipality: this.firstFormGroup.get('municipality')?.value,
      neighborhood: this.firstFormGroup.get('neighborhood')?.value,
      phone: this.firstFormGroup.get('phone')?.value,
    };
    // second step
    data.type = this.secondFormGroup.get('type')?.value;
    data.description = this.secondFormGroup.get('description')?.value;
    // third step (user)
    data.users = [{
      firstname: this.thirdFormGroup.get('firstname')?.value,
      lastname: this.thirdFormGroup.get('lastname')?.value,
      username: this.thirdFormGroup.get('username')?.value,
      email: this.thirdFormGroup.get('email')?.value,
      password: this.thirdFormGroup.get('password')?.value,
    }];
    //data.users = [6];
    // fourth step

    data.price = this.fourthFormGroup.get('price')?.value;
    if(this.token) data.tokenpayment = this.token;

    // apend all data
    formData.append('data', JSON.stringify(data) );

    // files
    if(this.firstFormGroup.get('representative_id')?.value)
      formData.append(`files.representative_id`, this.firstFormGroup.get('representative_id_source')?.value, this.firstFormGroup.get('representative_id')?.value.split("\\").pop());
    //if(this.firstFormGroup.get('fiscal_situation')?.value)
      //formData.append(`files.fiscal_situation`, this.firstFormGroup.get('fiscal_situation_source')?.value, this.firstFormGroup.get('fiscal_situation')?.value.split("\\").pop());

    if(this.thirdFormGroup.get('profile_picture')?.value)
      formData.append(`files.profile_picture`, this.thirdFormGroup.get('profile_picture_source')?.value, this.thirdFormGroup.get('profile_picture')?.value.split("\\").pop());

    this.wait = true;
    this.http.post<any>(`${environment.apiUrl}/companies`, formData).subscribe(
      (response: any)=>{
        this.authenticationService.login(this.thirdFormGroup.get('email')?.value, this.thirdFormGroup.get('password')?.value).subscribe(
          (data) => {
            this.wait = false;
            this.redirectAuthenticatedUser();
            this.spinner.hide();
          }
        );
      },
      (err)=>{
        this.wait = false;
        console.log(err);
        this.spinner.hide();
      }
    );

    // para testear sin enviar
    /*console.log(data);
    this.wait = false;
    this.spinner.hide();*/
  }

  private redirectAuthenticatedUser(){
    let user = this.authenticationService.currentUserValue;
    console.log(user);
    if(user.type == 'company'){
      this.router.navigateByUrl("/empresas/bienvenido");
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  public getFilename(dir: string){
    if(dir){
      var fileName = dir.split("\\").pop();
      return fileName;
    }
    return null;
  }

  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  controlAsFormGroup(item: AbstractControl){
    return item as FormGroup;
  }

  showTOS($event: any) {
    $event.preventDefault();
    this.documents.presentModal('terms-of-service');
  }

  showPP($event: any) {
    $event.preventDefault();
    this.documents.presentModal('privacy-policy');
  }

  isFree() {
    return this.prices.find(x=>x.id == this.fourthFormGroup.get('price')?.value)?.type == 'free';
  }
}
