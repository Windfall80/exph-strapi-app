import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// layout
import { LayoutComponent } from './_layout/layout.component'; 
import { IndexComponent } from './index/index.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { IncidenciaDetallesComponent } from './incidencias/incidencia-detalles/incidencia-detalles.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {sidebar: 'nav'},
    children: [
      { path: '',  redirectTo: 'incidencias', pathMatch: 'full'   }, 
      { path: 'incidencias', component: IncidenciasComponent },
      { path: 'incidencias/:id', component: IncidenciaDetallesComponent },
    ]
  }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
