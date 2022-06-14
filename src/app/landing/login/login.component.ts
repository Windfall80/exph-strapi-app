import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  get f() { return this.loginForm.controls; }
  public pw_hide = true;
  public wait = false;
  errors: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    },{updateOn: 'submit'});
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.wait = true;
    this.errors = [];
    this.authenticationService.login(this.f.email.value, this.f.password.value).subscribe(
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
