import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineLogPage } from './machine-log';

import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MachineLogPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineLogPage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    MachineLogPage
  ]
})
export class MachineLogPageModule {}
