import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { Issue, User } from '@app/_models';

@Component({
  selector: 'app-incidencia-detalles',
  templateUrl: './incidencia-detalles.component.html',
  styleUrls: ['./incidencia-detalles.component.scss']
})
export class IncidenciaDetallesComponent implements OnInit {
  currentUser: User;

  private id: string;
  issue: Issue;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });

    this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadIssue();
  }

  loadIssue(){
    //const params = new HttpParams().set('id', this.id);
    this.http.get<Issue>(`${environment.apiUrl}/issues/${this.id}`).subscribe(
      (response: Issue)=>{
        this.issue = response;
      },
      (err)=>{}
    );
  }

  canChat(){
    return this.issue.status.id == 2;
  }

}
