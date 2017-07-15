import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdLogPage } from './prod-log';

import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    ProdLogPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdLogPage),
    PipesModule,
  ],
  exports: [
    ProdLogPage
  ]
})
export class ProdLogPageModule {}
