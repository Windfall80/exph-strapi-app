import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {
  @Input() image: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  img_url(){
    if(!this.image) return `${environment.basehref}assets/user.png`;

    if( this.image.formats?.thumbnail ){
      return `${environment.apiUrl}${this.image.formats?.thumbnail.url}`;
    } else {
      return `${environment.apiUrl}${this.image.url}`;
    }
  }

  publicUrl(url: string){
    return ;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
