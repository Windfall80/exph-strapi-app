import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/_helpers/material/material.module';

import { HeaderComponent } from './components/header/header.component';

import { LayoutComponent } from './layout.component';


@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ]
})
export class LayoutModule { }
