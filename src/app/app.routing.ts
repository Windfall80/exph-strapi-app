import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/_helpers';

import { LayoutComponent } from '@app/_layout/layout.component';
import { IndexComponent } from '@app/landing/index/index.component';
import { LoginComponent } from '@app/landing/login/login.component';
import { LoginAdminComponent } from '@app/landing/login-admin/login-admin.component';
import { RegistroEmpresaComponent } from '@app/landing/registro-empresa/registro-empresa.component';
import { RegistroProveedorComponent } from '@app/landing/registro-proveedor/registro-proveedor.component';
import { NotFoundComponent } from './landing/not-found/not-found.component';
import { ForgotPasswordComponent } from './landing/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';

const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: {module: 'landing'},
    children: [
      { path: '', component: IndexComponent },
      { path: 'index', component: IndexComponent },

      { path: 'login', component: LoginComponent },
      { path: 'login-admin', component: LoginAdminComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'registro-empresa', component: RegistroEmpresaComponent },
      { path: 'registro-proveedor', component: RegistroProveedorComponent },
    ]
  },
  {
    path: 'empresas',
    canActivate: [AuthGuard],
    data: {module: 'company'},
    loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule)
  },
  {
    path: 'proveedores',
    canActivate: [AuthGuard],
    data: {module: 'supplier'},
    loadChildren: () => import('./proveedores/proveedores.module').then(m => m.ProveedoresModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {module: 'admin'},
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

  {
    path: '404',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
