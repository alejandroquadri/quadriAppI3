import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartesFormPage } from './partes-form';

@NgModule({
  declarations: [
    PartesFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PartesFormPage),
  ],
  exports: [
    PartesFormPage
  ]
})
export class PartesFormPageModule {}
