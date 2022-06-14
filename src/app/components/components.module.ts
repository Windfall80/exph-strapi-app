import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { MomentModule } from 'ngx-moment';
import { NgxSpinnerModule } from "ngx-spinner";

import { MaterialModule } from '@app/_helpers/material/material.module';
import { PipesModule } from '@app/_pipes/pipes.module';

import { AlertTemplateComponent } from './alert-template/alert-template.component';
import { FileFieldComponent } from './file-field/file-field.component';
import { MyStripeCardComponent } from './stripe-card/stripe-card.component';
import { StripeCardFormComponent } from './stripe-card-form/stripe-card-form.component';

import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { ProfilePictureAvatarComponent } from './profile-picture-avatar/profile-picture-avatar.component';
import { ChatCardComponent } from './chat-card/chat-card.component';

import { environment } from '@environments/environment';
import { DocumentModalComponent } from './document-modal/document-modal.component';


@NgModule({
  declarations: [
    AlertTemplateComponent,
    FileFieldComponent,
    MyStripeCardComponent,
    StripeCardFormComponent,
    ProfilePictureComponent,
    ProfilePictureAvatarComponent,
    ChatCardComponent,
    DocumentModalComponent
  ],
  exports:[
    AlertTemplateComponent,
    FileFieldComponent,
    MyStripeCardComponent,
    StripeCardFormComponent,
    ProfilePictureComponent,
    ProfilePictureAvatarComponent,
    ChatCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    NgxSpinnerModule,
    MaterialModule,
    PipesModule,
    NgxStripeModule.forRoot(environment.stripe_pk),
  ]
})
export class ComponentsModule { }
