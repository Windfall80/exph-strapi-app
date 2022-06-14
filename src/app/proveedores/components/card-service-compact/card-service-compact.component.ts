import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { environment } from '@environments/environment';
import { Service } from '@app/_models';

@Component({
  selector: 'app-card-service-compact',
  templateUrl: './card-service-compact.component.html',
  styleUrls: ['./card-service-compact.component.scss']
})
export class CardServiceCompactComponent implements OnInit {
  @Input() service: Service;
  @Output() onDelete = new EventEmitter<Service>();
  constructor() { }

  ngOnInit(): void {
  }

  delete(){
    this.onDelete.emit(this.service);
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
