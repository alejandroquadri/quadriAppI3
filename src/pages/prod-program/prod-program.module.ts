import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdProgramPage } from './prod-program';

import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProdProgramPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdProgramPage),
    PipesModule,
    ComponentsModule
  ],
})
export class ProdProgramPageModule {}
