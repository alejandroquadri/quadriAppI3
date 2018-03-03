import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmDashboardPage } from './crm-dashboard';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CrmDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmDashboardPage),
    ComponentsModule,
    PipesModule
  ],
})
export class CrmDashboardPageModule {}
