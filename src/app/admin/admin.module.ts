import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';

import { AuthInterceptor, ErrorInterceptor } from '@app/_helpers';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStarsModule } from 'ngx-stars';
import { MaterialModule } from '@app/_helpers/material/material.module';
import { MomentModule } from 'ngx-moment';
import { LayoutModule } from './_layout/layout.module';
import { ComponentsModule } from '@app/components/components.module';
import { AdminRoutingModule } from './admin.routing';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { IncidenciaReportarComponent } from './incidencias/incidencia-reportar/incidencia-reportar.component';
import { IncidenciaDetallesComponent } from './incidencias/incidencia-detalles/incidencia-detalles.component';


@NgModule({
  declarations: [
    IndexComponent,
    IncidenciasComponent,
    IncidenciaReportarComponent,
    IncidenciaDetallesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    HttpClientModule,
    NgxStarsModule,
    MaterialModule,
    MomentModule,
    LayoutModule,
    ComponentsModule,
  ],
  providers: [
    //{ provide: LOCALE_ID, useValue: 'es-Mx' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AdminModule { }
