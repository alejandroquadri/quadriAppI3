import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmOpPage } from './crm-op';

import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CrmOpPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmOpPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CrmOpPageModule {}
