import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch, UniqueUsername, UniqueEmail } from '@app/_validators';
import { Company, PaymentTerm, PaymentMethod, Plan, Category, CompanyType } from '@app/_models';

@Component({
  selector: 'app-perfil-editar',
  templateUrl: './perfil-editar.component.html',
  styleUrls: ['./perfil-editar.component.scss']
})
export class PerfilEditarComponent implements OnInit {
  public profile: Company;
  public formGroup: FormGroup;
  get userGroup() { return this.formGroup.get('userGroup') as FormGroup; }

  public types: CompanyType[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private uniqueUsername: UniqueUsername,
    private uniqueEmail: UniqueEmail
  ) { }

  ngOnInit(): void {
    this.loadTypesList();
    this.loadProfile();
  }

  private loadProfile(){
    this.http.get<Company>(`${environment.apiUrl}/companies/profile`).subscribe(
      (response: Company)=>{
        this.profile = response;
        this.initForm();
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

  initForm() {

    this.formGroup = this.formBuilder.group({
      profile_picture: [null],
      profile_picture_source: [null],

      /*userGroup: this.formBuilder.group({
        firstname: ['Admin'],
        lastname: ['Admin'],
        username: [null, [Validators.required, Validators.pattern('[A-Za-z0-9\-_\.]{6,20}')], this.uniqueUsername.validate],
        email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')], this.uniqueEmail.validate],
        re_email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        re_password: [null, [Validators.required]],
      },{
        validators: [MustMatch('email','re_email'), MustMatch('password','re_password')],
        updateOn: 'blur'
      }),*/

      type: [this.profile.type, [Validators.required]],
      description: [this.profile.description, [Validators.required]],

      name: [this.profile.name, [Validators.required]],
      rfc: [this.profile.rfc, [Validators.required]],
      representative_name: [this.profile.representative_name, [Validators.required]],
      business_name: [this.profile.business_name, [Validators.required]],
      address: [this.profile.address, [Validators.required]],
      interior_number: [this.profile.interior_number],
      postal_code: [this.profile.postal_code, [Validators.required]],
      country: [this.profile.country, [Validators.required]],
      state: [this.profile.state, [Validators.required]],
      city: [this.profile.city, [Validators.required]],
      municipality: [this.profile.municipality, [Validators.required]],
      neighborhood: [this.profile.neighborhood, [Validators.required]],
      phone: [this.profile.phone, [Validators.required]],

      //files
      representative_id: [null],
      representative_id_source: [null],
      //fiscal_situation: [null],
      //fiscal_situation_source: [null],

    });

    //this.formGroup.controls.profile_picture.setValidators(this.profile.profile_picture ? null : [Validators.required]);
    this.formGroup.controls.representative_id.setValidators(this.profile.representative_id ? null : [Validators.required]);
    //this.formGroup.controls.fiscal_situation.setValidators(this.profile.fiscal_situation ? null : [Validators.required]);
    this.formGroup.updateValueAndValidity();
  }

  onSubmit(){
    console.log("validating...");
    if (this.formGroup.invalid) {
      console.log("form invalid");
      console.log(this.formGroup.errors);
      this.markFormGroupTouched(this.formGroup);
      return;
    }

    console.log("submiting form...");
    const formData = new FormData();

    // get data
    const data: any = this.formGroup.getRawValue();
    // nuke unnecesary data
    delete data.profile_picture;
    delete data.profile_picture_source;
    delete data.representative_id;
    delete data.representative_id_source;
    //delete data.fiscal_situation;
    //delete data.fiscal_situation_source;
    // apend all data
    formData.append('data', JSON.stringify(data) );

    // files
    if(this.formGroup.get('profile_picture')?.value)
      formData.append(`files.profile_picture`, this.formGroup.get('profile_picture_source')?.value, this.formGroup.get('profile_picture')?.value.split("\\").pop());

    if(this.formGroup.get('representative_id')?.value)
      formData.append(`files.representative_id`, this.formGroup.get('representative_id_source')?.value, this.formGroup.get('representative_id')?.value.split("\\").pop());
    //if(this.formGroup.get('fiscal_situation')?.value)
      //formData.append(`files.fiscal_situation`, this.formGroup.get('fiscal_situation_source')?.value, this.formGroup.get('fiscal_situation')?.value.split("\\").pop());


    this.wait = true;
    this.http.put<any>(`${environment.apiUrl}/companies/${this.profile.id}`, formData).subscribe(
      (response: any)=>{
        this.wait = false;
        console.log(response);
        this.router.navigateByUrl('/empresas/perfil');
      },
      (err)=>{
        this.wait = false;
        console.log(err);
      }
    )
  }

  controlAsFormGroup(item: AbstractControl){
    return item as FormGroup;
  }

  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected(true);
  }
}
