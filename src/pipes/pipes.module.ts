import { NgModule } from '@angular/core';
import { FilterPipe } from './filter/filter';
import { MomentFormatPipe } from './moment-format/moment-format';
import { FieldFilterPipe } from './field-filter/field-filter';
import { SortPipe } from './sort/sort';

@NgModule({
  declarations: [
	  FilterPipe, 
	  MomentFormatPipe,
	  FieldFilterPipe,
	  SortPipe
  ],
  exports: [
	  FilterPipe,
	  MomentFormatPipe,
	  FieldFilterPipe,
	  SortPipe
   ]
})
export class PipesModule {}