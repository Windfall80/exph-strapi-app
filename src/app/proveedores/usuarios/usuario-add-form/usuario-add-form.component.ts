import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Category, User } from '@app/_models';
import { UniqueEmail, UniqueUsername, requiredIfPw, MustMatch } from '@app/_validators';

@Component({
  selector: 'app-usuario-add-form',
  templateUrl: './usuario-add-form.component.html',
  styleUrls: ['./usuario-add-form.component.scss']
})
export class UsuarioAddFormComponent implements OnInit {
  public userForm: FormGroup;
  public areas: Category[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioAddFormComponent>,
    private uniqueUsername: UniqueUsername,
    private uniqueEmail: UniqueEmail,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.userForm = this.formBuilder.group({
      area: [null],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.pattern('[A-Za-z0-9\-_\.]{6,20}')], uniqueUsername.validate],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')], uniqueEmail.validate],
      re_email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      re_password: [null, [Validators.required]],
      tos: [false, [Validators.requiredTrue]]
    },
    {validators: [MustMatch('email','re_email'), MustMatch('password','re_password')]});
  }

  ngOnInit(): void {
    this.loadAreasList();
  }

  private loadAreasList(){
    this.http.get<Category[]>(`${environment.apiUrl}/categories`).subscribe(
      (response: Category[])=>{
        this.areas = response;
      },
      (err)=>{}
    );
  }

  onSubmit(){
    if (this.userForm.invalid) {
      console.log("form invalid");
      this.userForm.markAllAsTouched();
      return;
    }

    console.log('submit...');
    this.wait = true;
    let formData = this.userForm.getRawValue();

    this.http.post<User>(`${environment.apiUrl}/users`, formData).subscribe(
      (response: User)=>{
        this.wait = false;
        this.dialogRef.close(response);
      },
      (err)=>{
        this.wait = false;
        console.log(err);
      }
    );
  }

}
