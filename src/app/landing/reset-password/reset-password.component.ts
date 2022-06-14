import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services';
import { MustMatch } from '@app/_validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetForm: FormGroup;
  get f() { return this.resetForm.controls; }
  private code: string;

  public wait = false;
  errors: any = [];
  response: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.code = this.route.snapshot.queryParamMap.get('code')!;

    this.resetForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: [null, [Validators.required]],
    },{
      validators: [MustMatch('password','passwordConfirmation')],
      updateOn: 'blur'
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.resetForm.invalid) {
        return;
    }

    this.wait = true;
    this.errors = [];
    this.authenticationService.resetPassword(this.code, this.f.password.value, this.f.passwordConfirmation.value).subscribe(
      data => {
        this.wait = false;
        this.redirectAuthenticatedUser();
      },
      (err: any) => {
        console.log(err);
        this.wait = false;
        let status = err.status;
        let error = err.error;

        console.log(status);
        if(status == 400 || status == 429){
          for(let e of error.message){
            for(let m of e.messages)
              this.errors.push(m);
          }
        }
      }
    );
  }

  private redirectAuthenticatedUser(){
    let user = this.authenticationService.currentUserValue;
    console.log(user);
    if(user.type == 'company'){
      this.router.navigateByUrl("/empresas");
      return;
    } else if(user.type == 'supplier'){
      this.router.navigateByUrl("/proveedores");
      return;
    }
    this.router.navigateByUrl("/403");
  }

}
