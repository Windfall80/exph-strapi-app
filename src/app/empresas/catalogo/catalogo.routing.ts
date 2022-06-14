import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// layout
import { LayoutComponent } from '../_layout/layout.component';

import { IndexComponent } from './index/index.component';
import { OfertasRelampagoComponent } from './ofertas-relampago/ofertas-relampago.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedorDetallesComponent } from './proveedores/proveedor-detalles/proveedor-detalles.component';
import { ProductoComponent } from './producto/producto.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {sidebar: 'search'},
    children: [
      { path: '', component: IndexComponent },
      { path: 'category/:slug', component: IndexComponent },
      { path: 'ofertas-relampago', component: OfertasRelampagoComponent },
      { path: 'proveedores', component: ProveedoresComponent, },
      { path: 'busqueda', component: BusquedaComponent, },
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    data: {sidebar: 'none'},
    children: [
      { path: 'proveedores/:id', component: ProveedorDetallesComponent, },
      { path: 'producto/:id', component: ProductoComponent, }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoRoutingModule { }
