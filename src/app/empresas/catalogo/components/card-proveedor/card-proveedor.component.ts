import { Component, Input, OnInit } from '@angular/core';

import { environment } from '@environments/environment';
import { Supplier } from '@app/_models';
import { SuppliersService } from '@app/_services';

@Component({
  selector: 'app-card-proveedor',
  templateUrl: './card-proveedor.component.html',
  styleUrls: ['./card-proveedor.component.scss']
})
export class CardProveedorComponent implements OnInit {
  @Input() supplier: Supplier;
  public wait = false;

  matStars = {
    empty: `${environment.basehref}assets/images/star_outline.svg`,
    half: `${environment.basehref}assets/images/star_half.svg`,
    full: `${environment.basehref}assets/images/star.svg`,
  };

  constructor(
    private suppliersService: SuppliersService
  ) {}

  ngOnInit(): void {
    //console.log(this.supplier);
  }

  addFav(){
    this.wait = true;
    this.suppliersService.addFav(this.supplier.id).subscribe((res: any)=>{
      this.wait = false;
      this.supplier.isFav = true;
    });
  }

  removeFav(){
    this.wait = true;
    this.suppliersService.removeFav(this.supplier.id).subscribe((res: any)=>{
      this.wait = false;
      this.supplier.isFav = false;
    });
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
