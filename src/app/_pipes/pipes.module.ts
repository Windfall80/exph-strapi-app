import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//pipes
import { FilterPipe } from './filter.pipe';
import { TruncatePipe } from './truncate.pipe';
import { PhonePipe } from './phone.pipe';
import { Safe } from './safe-html.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    TruncatePipe,
    PhonePipe,
    Safe
  ],
  exports: [
    FilterPipe,
    TruncatePipe,
    PhonePipe,
    Safe
  ],
  imports: [
    CommonModule,
  ]

})
export class PipesModule { }
