import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-dropdown-links-group',
  templateUrl: './dropdown-links-group.component.html',
  styleUrls: ['./dropdown-links-group.component.scss']
})
export class DropdownLinksGroupComponent implements OnInit {
  @Input() group: any;
  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.reloadGroup();
  }

  reloadGroup(){
    const params = new HttpParams();
    this.http.get<any>(`${environment.apiUrl}/category-groups/${this.group.id}`, { params }).subscribe(
      (response: any)=>{
        this.group = response;
      },
      (err)=>{}
    );
  }

}
