import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SparePartsFormPage } from './spare-parts-form';

import { ElasticModule } from 'angular2-elastic';

@NgModule({
  declarations: [
    SparePartsFormPage,
  ],
  imports: [
    IonicPageModule.forChild(SparePartsFormPage),
    ElasticModule
  ],
  exports: [
    SparePartsFormPage
  ]
})
export class SparePartsFormPageModule {}
