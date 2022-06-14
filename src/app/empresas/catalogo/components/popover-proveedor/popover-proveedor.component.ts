import { Component, Input, OnInit } from '@angular/core';

import { environment } from '@environments/environment';
import { Supplier } from '@app/_models';
import { SuppliersService } from '@app/_services';

@Component({
  selector: 'app-popover-proveedor',
  templateUrl: './popover-proveedor.component.html',
  styleUrls: ['./popover-proveedor.component.scss']
})
export class PopoverProveedorComponent implements OnInit {
  @Input() supplier: Supplier;
  public reloaded = false;

  matStars = {
    empty: `${environment.basehref}assets/images/star_outline.svg`,
    half: `${environment.basehref}assets/images/star_half.svg`,
    full: `${environment.basehref}assets/images/star.svg`,
  };

  constructor(private suppliersService: SuppliersService) { }

  ngOnInit(): void {
    this.loadSupplier();
  }

  private loadSupplier(){
    this.suppliersService.findById(this.supplier.id).subscribe(
      (response: Supplier)=>{
        this.supplier = response;
        this.reloaded = true;
      },
      (err)=>{
        this.reloaded = true;
      }
    );
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
