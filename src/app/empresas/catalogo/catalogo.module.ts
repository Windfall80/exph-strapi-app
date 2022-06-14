import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/_helpers/material/material.module';
import { TippyModule } from 'ng-tippy';
import { NgxStarsModule } from 'ngx-stars';
import { MomentModule } from 'ngx-moment';

import { PipesModule } from '@app/_pipes/pipes.module';
import { ComponentsModule } from '@app/components/components.module';
import { CatalogoRoutingModule } from './catalogo.routing';

import { IndexComponent } from './index/index.component';
import { OfertasRelampagoComponent } from './ofertas-relampago/ofertas-relampago.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedorDetallesComponent } from './proveedores/proveedor-detalles/proveedor-detalles.component';
import { ProductoComponent } from './producto/producto.component';

import { CardProductoComponent } from './components/card-producto/card-producto.component';
import { CardOfertaComponent } from './components/card-oferta/card-oferta.component';
import { CardProveedorComponent } from './components/card-proveedor/card-proveedor.component';
import { PopoverProveedorComponent } from './components/popover-proveedor/popover-proveedor.component';
import { CardProductoCompactComponent } from './components/card-producto-compact/card-producto-compact.component';
import { QuotationRequestFormComponent } from './components/quotation-request-form/quotation-request-form.component';
import { OfferRequestFormComponent } from './components/offer-request-form/offer-request-form.component';
import { BusquedaComponent } from './busqueda/busqueda.component';


@NgModule({
  declarations: [
    IndexComponent,
    OfertasRelampagoComponent,
    ProveedoresComponent,
    ProveedorDetallesComponent,
    ProductoComponent,

    CardProductoComponent,
    CardOfertaComponent,
    CardProveedorComponent,
    PopoverProveedorComponent,
    CardProductoCompactComponent,
    QuotationRequestFormComponent,
    OfferRequestFormComponent,
    BusquedaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TippyModule,
    NgxStarsModule,
    MomentModule,

    PipesModule,
    ComponentsModule,
    CatalogoRoutingModule,
  ]
})
export class CatalogoModule { }
