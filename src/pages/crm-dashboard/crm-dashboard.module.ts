import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmDashboardPage } from './crm-dashboard';

import { AcSalesChartComponentModule } from '../../components/ac-sales-chart/ac-sales-chart.module';

@NgModule({
  declarations: [
    CrmDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmDashboardPage),
    AcSalesChartComponentModule
  ],
})
export class CrmDashboardPageModule {}
