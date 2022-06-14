import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { MaterialModule } from '@app/_helpers/material/material.module';

import { PipesModule } from '@app/_pipes/pipes.module';

import { LayoutComponent } from './layout.component';

import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { UserImageComponent } from './components/user-image/user-image.component';
import { SideSearchComponent } from './components/side-search/side-search.component';
import { DropdownLinksGroupComponent } from './components/dropdown-links-group/dropdown-links-group.component';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SideNavComponent,
    UserImageComponent,
    SideSearchComponent,
    DropdownLinksGroupComponent,
    NotificationsListComponent,
    SearchComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MaterialModule,
    PipesModule
  ]
})
export class LayoutModule { }
