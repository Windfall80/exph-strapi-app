import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { Issue, User } from '@app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-incidencia-detalles',
  templateUrl: './incidencia-detalles.component.html',
  styleUrls: ['./incidencia-detalles.component.scss']
})
export class IncidenciaDetallesComponent implements OnInit {
  currentUser: User;

  private id: string;
  issue: Issue;
  statuses: any[] = [];

  public updateForm: FormGroup;
  public wait = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });

    this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadIssue();
    this.loadStatuses();
  }

  loadIssue(){
    //const params = new HttpParams().set('id', this.id);
    this.http.get<Issue>(`${environment.apiUrl}/issues/${this.id}`).subscribe(
      (response: Issue)=>{
        this.issue = response;

        this.updateForm = this.formBuilder.group({
          status: [this.issue.status.id, [Validators.required]],
        });

      },
      (err)=>{}
    );
  }

  loadStatuses(){
    this.http.get<any[]>(`${environment.apiUrl}/issue-statuses`).subscribe(
      (response: any[])=>{
        this.statuses = response;
      },
      (err)=>{}
    );
  }

  update(){
    if (this.updateForm.invalid) {
      console.log("form invalid");
      this.updateForm.markAllAsTouched();
      return;
    }

    let data = this.updateForm.getRawValue();
    this.wait = true;
    this.http.put<any>(`${environment.apiUrl}/issues/${this.id}`, data).subscribe(
      (response: any)=>{
        console.log(response);
        this.wait = false;
        this.issue = response;
      },
      (err)=>{
        this.wait = false;
      }
    );
  }

  canChat(){
    return this.issue.status.id == 2;
  }

}
