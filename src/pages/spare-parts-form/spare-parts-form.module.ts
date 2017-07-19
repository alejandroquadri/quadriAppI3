import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SparePartsFormPage } from './spare-parts-form';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SparePartsFormPage,
  ],
  imports: [
    IonicPageModule.forChild(SparePartsFormPage),
    ElasticModule,
    PipesModule
  ],
  exports: [
    SparePartsFormPage
  ]
})
export class SparePartsFormPageModule {}
