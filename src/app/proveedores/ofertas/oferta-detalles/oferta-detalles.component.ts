import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '@environments/environment';
import { Offer, Supplier } from '@app/_models';
import { OffersService, ServicesService } from '@app/_services';

@Component({
  selector: 'app-oferta-detalles',
  templateUrl: './oferta-detalles.component.html',
  styleUrls: ['./oferta-detalles.component.scss']
})
export class OfertaDetallesComponent implements OnInit {
  private id: string;
  offer: Offer;
  supplier: Supplier;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private offersService: OffersService
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });
  }

  ngOnInit(): void {
    this.loadService();
  }

  private loadService(){
    this.offersService.findById(this.id).subscribe(
      (response: Offer) => {
        this.offer = response;
        this.loadSupplier();
      });
  }

  private loadSupplier(){
    this.http.get<Supplier>(`${environment.apiUrl}/suppliers/${this.offer.supplier?.id}`).subscribe(
      (response: Supplier)=>{
        this.supplier = response;
      }
    );
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

  back(): void {
    this.location.back();
  }

}
