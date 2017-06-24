import { NgModule } from '@angular/core';
import { FilterPipe } from './filter/filter'
import { MomentFormatPipe } from './moment-format/moment-format'

@NgModule({
  declarations: [
	  FilterPipe, 
	  MomentFormatPipe
  ],
  exports: [
	  FilterPipe,
	  MomentFormatPipe
   ]
})
export class PipesModule {}