import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmDashboardPage } from './crm-dashboard';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CrmDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmDashboardPage),
    ComponentsModule
  ],
})
export class CrmDashboardPageModule {}
