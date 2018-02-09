import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmClientsPage } from './crm-clients';

import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CrmClientsPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmClientsPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CrmClientsPageModule {}
