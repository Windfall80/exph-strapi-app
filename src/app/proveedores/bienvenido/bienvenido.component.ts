import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.scss']
})
export class BienvenidoComponent implements OnInit {

  public videoConfig: any

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig(){
    this.http.get<any>(`${environment.apiUrl}/configs/welcome-video-url`).subscribe(
      (response: any)=>{
        this.videoConfig = response;
      }
    );
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

}
