import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { Offer } from '@app/_models';

@Component({
  selector: 'app-card-offer-compact',
  templateUrl: './card-offer-compact.component.html',
  styleUrls: ['./card-offer-compact.component.scss']
})
export class CardOfferCompactComponent implements OnInit {
  @Input() offer: Offer;
  @Output() onDelete = new EventEmitter<Offer>();

  constructor() { }

  ngOnInit(): void {
  }

  delete(){
    this.onDelete.emit(this.offer);
  }

  expired(){
    if(!this.offer.expires_at) return false;
    return moment().isSameOrAfter(moment(this.offer.expires_at), 'minute');
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
