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
import { ProveedoresRoutingModule } from './proveedores.routing';
import { AuthInterceptor, ErrorInterceptor } from '@app/_helpers';

import { IndexComponent } from './index/index.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { GeneralComponent } from './general/general.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizacionDetallesComponent } from './cotizaciones/cotizacion-detalles/cotizacion-detalles.component';
import { OfertasRelampagoComponent } from './ofertas-relampago/ofertas-relampago.component';
import { OfertaRelmpagoDetallesComponent } from './ofertas-relampago/oferta-relmpago-detalles/oferta-relmpago-detalles.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioAddFormComponent } from './usuarios/usuario-add-form/usuario-add-form.component';
import { UsuarioEditFormComponent } from './usuarios/usuario-edit-form/usuario-edit-form.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { IncidenciaDetallesComponent } from './incidencias/incidencia-detalles/incidencia-detalles.component';
import { IncidenciaReportarComponent } from './incidencias/incidencia-reportar/incidencia-reportar.component';

import { ServiciosComponent } from './servicios/servicios.component';
import { ServicioCreateComponent } from './servicios/servicio-create/servicio-create.component';
import { ServicioUpdateComponent } from './servicios/servicio-update/servicio-update.component';
import { ServicioDetallesComponent } from './servicios/servicio-detalles/servicio-detalles.component';
//import { CardServiceComponent } from './components/card-service/card-service.component';
import { CardServiceCompactComponent } from './components/card-service-compact/card-service-compact.component';

import { OfertasComponent } from './ofertas/ofertas.component';
import { OfertaCreateComponent } from './ofertas/oferta-create/oferta-create.component';
import { OfertaUpdateComponent } from './ofertas/oferta-update/oferta-update.component';
import { OfertaDetallesComponent } from './ofertas/oferta-detalles/oferta-detalles.component';
import { CardOfferCompactComponent } from './components/card-offer-compact/card-offer-compact.component';

import { PuntosComponent } from './puntos/puntos.component';
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
    CotizacionDetallesComponent,
    OfertasRelampagoComponent,
    OfertaRelmpagoDetallesComponent,
    UsuariosComponent,
    UsuarioAddFormComponent,
    UsuarioEditFormComponent,
    IncidenciasComponent,
    IncidenciaDetallesComponent,
    IncidenciaReportarComponent,
    ServiciosComponent,
    ServicioCreateComponent,
    ServicioUpdateComponent,
    ServicioDetallesComponent,
    //CardServiceComponent,
    CardServiceCompactComponent,
    OfertasComponent,
    OfertaCreateComponent,
    OfertaUpdateComponent,
    OfertaDetallesComponent,
    CardOfferCompactComponent,
    PuntosComponent,
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
    ProveedoresRoutingModule,
  ],
  providers: [
    //{ provide: LOCALE_ID, useValue: 'es-Mx' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class ProveedoresModule { }
