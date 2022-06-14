import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionGuard } from './_helpers';

// layout
import { LayoutComponent } from './_layout/layout.component';

import { IndexComponent } from './index/index.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { GeneralComponent } from './general/general.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizacionGrupoComponent } from './cotizaciones/cotizacion-grupo/cotizacion-grupo.component';
import { CotizacionDetallesComponent } from './cotizaciones/cotizacion-detalles/cotizacion-detalles.component';
import { OfertasRelampagoComponent } from './ofertas-relampago/ofertas-relampago.component';
import { OfertaRelmpagoDetallesComponent } from './ofertas-relampago/oferta-relmpago-detalles/oferta-relmpago-detalles.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { IncidenciaDetallesComponent } from './incidencias/incidencia-detalles/incidencia-detalles.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilEditarComponent } from './perfil/perfil-editar/perfil-editar.component';
import { PlanEditarComponent } from './perfil/plan-editar/plan-editar.component';
import { SubscripcionExpiradaComponent } from './subscripcion-expirada/subscripcion-expirada.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [SubscriptionGuard],
    data: {sidebar: 'none'},
    children: [
      { path: '', component: IndexComponent },
      { path: 'bienvenido', component: BienvenidoComponent },
      { path: 'cotizador', component: CotizadorComponent },
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [SubscriptionGuard],
    data: {sidebar: 'nav'},
    children: [
      // perfil
      { path: 'perfil', component: PerfilComponent },
      { path: 'perfil/editar', component: PerfilEditarComponent },
      { path: 'perfil/plan', component: PlanEditarComponent },
      // general
      { path: 'general', component: GeneralComponent },
      // cotizaciones
      { path: 'cotizaciones', component: CotizacionesComponent },
      { path: 'cotizaciones/:grupoId', component: CotizacionGrupoComponent },
      { path: 'cotizaciones/:grupoId/:cotizacionId', component: CotizacionDetallesComponent },
      // ofertas-relampago
      { path: 'ofertas-relampago', component: OfertasRelampagoComponent },
      { path: 'ofertas-relampago/:id', component: OfertaRelmpagoDetallesComponent },
      // usuarios
      { path: 'usuarios', component: UsuariosComponent },
      // incidencias
      { path: 'incidencias', component: IncidenciasComponent },
      { path: 'incidencias/:id', component: IncidenciaDetallesComponent },
    ]
  },

  // catalogo
  {
    path: 'catalogo',
    canActivate: [SubscriptionGuard],
    loadChildren: () => import('./catalogo/catalogo.module').then(m => m.CatalogoModule)
  },

  // redirect here when session has expired
  {
    path: 'subscripcion-expirada',
    component: LayoutComponent,
    data: {sidebar: 'none'},
    children: [
      { path: '', component: SubscripcionExpiradaComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
