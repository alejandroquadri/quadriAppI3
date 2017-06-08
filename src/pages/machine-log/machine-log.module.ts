import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineLogPage } from './machine-log';

import { ElasticModule } from 'angular2-elastic';

@NgModule({
  declarations: [
    MachineLogPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineLogPage),
    ElasticModule
  ],
  exports: [
    MachineLogPage
  ]
})
export class MachineLogPageModule {}
