import { Component, Input, OnInit } from '@angular/core';

import { environment } from '@environments/environment';
import { QuotationService, ServicesService } from '@app/_services';
import { Service } from '@app/_models';

@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.scss']
})
export class CardProductoComponent implements OnInit {
  @Input() service: Service;
  public wait = false;

  constructor(
    private quotationService: QuotationService,
    private servicesService: ServicesService
  ) { }

  ngOnInit(): void {
  }

  public request(){
    this.quotationService.openQuotationForm(this.service).then(result => {
      console.log(result);
    });
  }

  addFav(){
    this.wait = true;
    this.servicesService.addFav(this.service.id).subscribe((res: any)=>{
      this.wait = false;
      this.service.isFav = true;
    });
  }

  removeFav(){
    this.wait = true;
    this.servicesService.removeFav(this.service.id).subscribe((res: any)=>{
      this.wait = false;
      this.service.isFav = false;
    });
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
