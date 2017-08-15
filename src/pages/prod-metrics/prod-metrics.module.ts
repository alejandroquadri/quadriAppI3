import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';
import { AcChartComponentModule } from '../../components/acChart/acChart.module';
import { ProdChartComponentModule } from '../../components/prodChart/prodChart.module';
import { AcSalesChartComponentModule } from '../../components/ac-sales-chart/ac-sales-chart.module';

@NgModule({
  declarations: [
    ProdMetricsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
    AcChartComponentModule,
    ProdChartComponentModule,
    AcSalesChartComponentModule
  ],
  entryComponents: [
  ],
  exports: [
    ProdMetricsPage,
  ]
})
export class ProdMetricsPageModule {}
