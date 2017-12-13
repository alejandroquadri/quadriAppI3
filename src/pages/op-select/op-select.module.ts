import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpSelectPage } from './op-select';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OpSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(OpSelectPage),
    PipesModule
  ],
})
export class OpSelectPageModule {}
