import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MahcineLogFormPage } from './mahcine-log-form';

@NgModule({
  declarations: [
    MahcineLogFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MahcineLogFormPage),
  ],
  exports: [
    MahcineLogFormPage
  ]
})
export class MahcineLogFormPageModule {}
