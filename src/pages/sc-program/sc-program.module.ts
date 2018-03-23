import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScProgramPage } from './sc-program';

import { ComponentsModule } from '../../components';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    ScProgramPage,
  ],
  imports: [
    IonicPageModule.forChild(ScProgramPage),
    PipesModule,
    ComponentsModule
  ],
})
export class ScProgramPageModule {}
