import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//directives
import { SwitchCasesDirective } from './switch-cases.directive';

@NgModule({
  declarations: [
    SwitchCasesDirective
  ],
  exports: [
    SwitchCasesDirective
  ],
  imports: [
    CommonModule,
  ]

})
export class DirectivesModule { }
