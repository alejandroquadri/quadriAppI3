import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineLogPage } from './machine-log';

@NgModule({
  declarations: [
    MachineLogPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineLogPage),
  ],
  exports: [
    MachineLogPage
  ]
})
export class MachineLogPageModule {}
