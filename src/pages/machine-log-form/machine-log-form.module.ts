import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineLogFormPage } from './machine-log-form';
import { PipesModule } from '../../pipes/pipes.module';

import { ElasticModule } from 'angular2-elastic';

@NgModule({
  declarations: [
    MachineLogFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineLogFormPage),
    ElasticModule,
    PipesModule
  ],
  exports: [
    MachineLogFormPage
  ]
})
export class MachineLogFormPageModule {}
