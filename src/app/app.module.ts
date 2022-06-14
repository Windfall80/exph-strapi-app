import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule , TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OrderModule } from 'ngx-order-pipe';
// jwt storage
import { Storage, IonicStorageModule } from '@ionic/storage-angular';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMx, 'es-Mx');

import { MaterialModule } from '@app/_helpers/material/material.module';
import { LayoutModule } from '@app/_layout/layout.module';
import { ComponentsModule } from './components/components.module';

import { AppRoutingModule } from '@app/app.routing';
import { AuthInterceptor, ErrorInterceptor } from './_helpers';
import { SocketioService } from '@app/_services';

import { AppComponent } from '@app/app.component';
import { IndexComponent } from '@app/landing/index/index.component';
import { LoginComponent } from '@app/landing/login/login.component';
import { RegistroEmpresaComponent } from './landing/registro-empresa/registro-empresa.component';
import { RegistroProveedorComponent } from './landing/registro-proveedor/registro-proveedor.component';

import { MyMissingTranslationHandler } from './_helpers/my-missing-translation-handler';
import { NotFoundComponent } from './landing/not-found/not-found.component';
import { ForgotPasswordComponent } from './landing/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';

import { NgxStripeModule } from 'ngx-stripe';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoginAdminComponent } from './landing/login-admin/login-admin.component';

import { environment } from '@environments/environment';

export function jwtOptionsFactory(storage: Storage){
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['localhost:5337', 'https://exphotelhive.com', 'https://strapi.exphotelhive.com', 'https://strapi-test.exphotelhive.com']
  }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.basehref+'assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegistroEmpresaComponent,
    RegistroProveedorComponent,
    NotFoundComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoginAdminComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
    }),
    OrderModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    }),

    AppRoutingModule,
    MaterialModule,
    LayoutModule,
    ComponentsModule,
    NgxStripeModule.forRoot(environment.stripe_pk),

    NgxSpinnerModule
  ],
  providers: [
    SocketioService,
    //{ provide: LOCALE_ID, useValue: 'es-Mx' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
