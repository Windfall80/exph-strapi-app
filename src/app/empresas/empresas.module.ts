import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStarsModule } from 'ngx-stars';
import { MaterialModule } from '@app/_helpers/material/material.module';
import { MomentModule } from 'ngx-moment';
import { OrderModule } from 'ngx-order-pipe';

import { LayoutModule } from './_layout/layout.module';
import { DirectivesModule } from '@app/_directives/directives.module';
import { PipesModule } from '@app/_pipes/pipes.module';
import { ComponentsModule } from '@app/components/components.module';
import { EmpresasRoutingModule } from './empresas.routing';
import { AuthInterceptor, ErrorInterceptor } from '@app/_helpers';

import { IndexComponent } from './index/index.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { GeneralComponent } from './general/general.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizacionGrupoComponent } from './cotizaciones/cotizacion-grupo/cotizacion-grupo.component';
import { CotizacionDetallesComponent } from './cotizaciones/cotizacion-detalles/cotizacion-detalles.component';
import { OfertasRelampagoComponent } from './ofertas-relampago/ofertas-relampago.component';
import { OfertaRelmpagoDetallesComponent } from './ofertas-relampago/oferta-relmpago-detalles/oferta-relmpago-detalles.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioAddFormComponent } from './usuarios/usuario-add-form/usuario-add-form.component';
import { UsuarioEditFormComponent } from './usuarios/usuario-edit-form/usuario-edit-form.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { IncidenciaDetallesComponent } from './incidencias/incidencia-detalles/incidencia-detalles.component';
import { IncidenciaReportarComponent } from './incidencias/incidencia-reportar/incidencia-reportar.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { NotificationsFullComponent } from './general/notifications-full/notifications-full.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilEditarComponent } from './perfil/perfil-editar/perfil-editar.component';
import { PlanEditarComponent } from './perfil/plan-editar/plan-editar.component';
import { SubscripcionExpiradaComponent } from './subscripcion-expirada/subscripcion-expirada.component';

@NgModule({
  declarations: [
    IndexComponent,
    BienvenidoComponent,
    GeneralComponent,
    CotizacionesComponent,
    CotizacionGrupoComponent,
    CotizacionDetallesComponent,
    OfertasRelampagoComponent,
    OfertaRelmpagoDetallesComponent,
    UsuariosComponent,
    UsuarioAddFormComponent,
    UsuarioEditFormComponent,
    IncidenciasComponent,
    IncidenciaDetallesComponent,
    IncidenciaReportarComponent,
    CotizadorComponent,
    NotificationsFullComponent,
    PerfilComponent,
    PerfilEditarComponent,
    PlanEditarComponent,
    SubscripcionExpiradaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxStarsModule,
    MaterialModule,
    MomentModule,
    OrderModule,

    LayoutModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule,
    EmpresasRoutingModule,
  ],
  providers: [
    //{ provide: LOCALE_ID, useValue: 'es-Mx' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class EmpresasModule { }
