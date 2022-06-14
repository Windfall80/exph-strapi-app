import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-profile-picture-avatar',
  templateUrl: './profile-picture-avatar.component.html',
  styleUrls: ['./profile-picture-avatar.component.scss']
})
export class ProfilePictureAvatarComponent implements OnInit {
  @Input() profile_picture: any;

  constructor() { }

  ngOnInit(): void {
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
