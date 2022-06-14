import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { Issue, User } from '@app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-incidencia-reportar',
  templateUrl: './incidencia-reportar.component.html',
  styleUrls: ['./incidencia-reportar.component.scss']
})
export class IncidenciaReportarComponent implements OnInit {
  currentUser: User;

  public issueForm: FormGroup;
  public typesList: any[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<IncidenciaReportarComponent>,
  ) {
    this.currentUser = authenticationService.currentUserValue;

    this.issueForm = this.formBuilder.group({
      type: [null, [Validators.required]],
      details: [null, [Validators.required]],
      screenshot: [null],
      screenshot_source: [null],
      user: [this.currentUser.id],
      company: [this.currentUser.company?.id],
      status: [1]
    });
  }

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(){
    const params = new HttpParams();
    this.http.get<any[]>(`${environment.apiUrl}/issue-types`, { params }).subscribe(
      (response: any[])=>{
        this.typesList = response;
      },
      (err)=>{}
    );
  }

  onSubmit(){
    if (this.issueForm.invalid) {
      console.log("form invalid");
      this.issueForm.markAllAsTouched();
      return;
    }

    console.log('submit...');
    this.wait = true;

    const formData = new FormData();
    let data = this.issueForm.getRawValue();
    delete data.screenshot;
    delete data.screenshot_source;
    // apend all data
    formData.append('data', JSON.stringify(data) );
    // files
    if(this.issueForm.get('screenshot')?.value)
      formData.append(`files.screenshot`, this.issueForm.get('screenshot_source')?.value, this.issueForm.get('screenshot')?.value.split("\\").pop());

    this.http.post<Issue>(`${environment.apiUrl}/issues`, formData).subscribe(
      (response: Issue)=>{
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
