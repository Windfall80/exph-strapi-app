import { Component, Input, OnInit } from '@angular/core';
//import { Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { Offer } from '@app/_models';
import { OffersService } from '@app/_services';
import { OfferRequest } from '@app/_models/offer-request';

@Component({
  selector: 'app-card-oferta',
  templateUrl: './card-oferta.component.html',
  styleUrls: ['./card-oferta.component.scss']
})
export class CardOfertaComponent implements OnInit {
  @Input() offer: Offer;
  //@Output() onDelete = new EventEmitter<Offer>();
  public wait = false;

  constructor(private offerService: OffersService) { }

  ngOnInit(): void {
  }

  public request(){
    this.offerService.openRequestForm(this.offer).then((result: OfferRequest) => {
      console.log(result);
      if(result) {
        this.offer.request = result;
      }
    });
  }

  expired(){
    if(!this.offer.expires_at) return false;
    return moment().isSameOrAfter(moment(this.offer.expires_at), 'minute');
  }

  addFav(){
    this.wait = true;
    this.offerService.addFav(this.offer.id).subscribe((res: any)=>{
      this.wait = false;
      this.offer.isFav = true;
    });
  }

  removeFav(){
    this.wait = true;
    this.offerService.removeFav(this.offer.id).subscribe((res: any)=>{
      this.wait = false;
      this.offer.isFav = false;
    });
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
