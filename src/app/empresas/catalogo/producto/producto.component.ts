import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '@environments/environment';
import { Service, Supplier } from '@app/_models';
import { ServicesService, QuotationService } from '@app/_services';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  private id: string;
  service: Service;
  supplier: Supplier;

  public wait = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private quotationService: QuotationService,
    private servicesService: ServicesService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.initialiseInvites();
    });
  }

  ngOnInit(): void {}

  initialiseInvites(): void {
    this.loadService();
  }

  private loadService(){
    this.servicesService.findById(this.id).subscribe(
      (response: Service) => {
        this.service = response;
        this.loadSupplier();
      });
  }

  private loadSupplier(){
    this.http.get<Supplier>(`${environment.apiUrl}/suppliers/${this.service.supplier?.id}`).subscribe(
      (response: Supplier)=>{
        this.supplier = response;
      }
    );
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

  back(): void {
    this.location.back()
  }

}
