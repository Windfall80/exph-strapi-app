import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { MaterialModule } from '@app/_helpers/material/material.module';

import { LayoutComponent } from './layout.component';

import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { UserImageComponent } from './components/user-image/user-image.component';
import { SideSearchComponent } from './components/side-search/side-search.component';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SideNavComponent,
    UserImageComponent,
    SideSearchComponent,
    NotificationsListComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    MaterialModule
  ]
})
export class LayoutModule { }
