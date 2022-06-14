import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotForm: FormGroup;
  get f() { return this.forgotForm.controls; }

  public wait = false;
  errors: any = [];
  response: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.forgotForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    },{updateOn: 'submit'});
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.forgotForm.invalid) {
        return;
    }

    this.wait = true;
    this.errors = [];
    this.authenticationService.forgotPassword(this.f.email.value).subscribe(
      data => {
        this.wait = false;
        this.response = data;
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

}
