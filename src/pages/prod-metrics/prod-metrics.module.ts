import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';
import { AcChartComponentModule } from '../../components/acChart/acChart.module';
import { ProdChartComponentModule } from '../../components/prodChart/prodChart.module';

@NgModule({
  declarations: [
    ProdMetricsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
    AcChartComponentModule,
    ProdChartComponentModule
  ],
  entryComponents: [
  ],
  exports: [
    ProdMetricsPage,
  ]
})
export class ProdMetricsPageModule {}
