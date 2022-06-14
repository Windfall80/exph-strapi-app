import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '@environments/environment';
import { Service, Supplier } from '@app/_models';
import { ServicesService } from '@app/_services';

@Component({
  selector: 'app-servicio-detalles',
  templateUrl: './servicio-detalles.component.html',
  styleUrls: ['./servicio-detalles.component.scss']
})
export class ServicioDetallesComponent implements OnInit {
  private id: string;
  service: Service;
  supplier: Supplier;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private servicesService: ServicesService
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });
  }

  ngOnInit(): void {
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
