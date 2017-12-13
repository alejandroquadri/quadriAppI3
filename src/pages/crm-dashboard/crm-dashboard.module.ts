import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmDashboardPage } from './crm-dashboard';

@NgModule({
  declarations: [
    CrmDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmDashboardPage),
  ],
})
export class CrmDashboardPageModule {}
