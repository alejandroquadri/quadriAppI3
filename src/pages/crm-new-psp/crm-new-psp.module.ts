import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmNewPspPage } from './crm-new-psp';

import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    CrmNewPspPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmNewPspPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CrmNewPspPageModule {}
