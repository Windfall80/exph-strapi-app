import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Category, User } from '@app/_models';
import { UniqueEmail, UniqueUsername, requiredIfPw, MustMatch } from '@app/_validators';

@Component({
  selector: 'app-usuario-edit-form',
  templateUrl: './usuario-edit-form.component.html',
  styleUrls: ['./usuario-edit-form.component.scss']
})
export class UsuarioEditFormComponent implements OnInit {
  public userForm: FormGroup;
  public areas: Category[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioEditFormComponent>,
    private uniqueUsername: UniqueUsername,
    private uniqueEmail: UniqueEmail,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.userForm = this.formBuilder.group({
      area: [user.area?.id],
      firstname: [user.firstname, [Validators.required]],
      lastname: [user.lastname, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
        [(control: FormControl): Observable<ValidationErrors | null> =>
          uniqueEmail.validate(control, user.id)]
        ],
      //re_email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.minLength(6)]],
      //re_password: [null, []]
    },{
      //validators: [MustMatch('password','re_password')]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(){
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
    if(!formData.password) delete formData.password;

    this.http.put<User>(`${environment.apiUrl}/users/${this.user.id}`, formData).subscribe(
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
