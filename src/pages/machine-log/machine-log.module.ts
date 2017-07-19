import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineLogPage } from './machine-log';

import { PipesModule } from '../../pipes/pipes.module';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  declarations: [
    MachineLogPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineLogPage),
    PipesModule,
    MyDatePickerModule,
  ],
  exports: [
    MachineLogPage
  ]
})
export class MachineLogPageModule {}
