import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SparePartsPage } from './spare-parts';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SparePartsPage,
  ],
  imports: [
    IonicPageModule.forChild(SparePartsPage),
    ElasticModule,
    PipesModule,
  ],
  exports: [
    SparePartsPage
  ]
})
export class SparePartsPageModule {}
