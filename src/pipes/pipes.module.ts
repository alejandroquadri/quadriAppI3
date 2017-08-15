import { NgModule } from '@angular/core';
import { FilterPipe } from './filter/filter';
import { MomentFormatPipe } from './moment-format/moment-format';
import { FieldFilterPipe } from './field-filter/field-filter';
import { SortPipe } from './sort/sort';
import { ObjNgforPipe } from './obj-ngfor/obj-ngfor';

@NgModule({
  declarations: [
	  FilterPipe, 
	  MomentFormatPipe,
	  FieldFilterPipe,
	  SortPipe,
	  ObjNgforPipe,
  ],
  exports: [
	  FilterPipe,
	  MomentFormatPipe,
	  FieldFilterPipe,
	  SortPipe,
	  ObjNgforPipe,
  ]
})
export class PipesModule {} 