import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartesFormPage } from './partes-form';

import { ElasticModule } from 'angular2-elastic';

@NgModule({
  declarations: [
    PartesFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PartesFormPage),
    ElasticModule
  ],
  exports: [
    PartesFormPage
  ]
})
export class PartesFormPageModule {}
