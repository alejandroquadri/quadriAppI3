import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';
import { ComponentsModule } from '../../components/components.module';
// import { AcChartComponentModule } from '../../components/acChart/acChart.module';
// import { ProdChartComponentModule } from '../../components/prodChart/prodChart.module';
// import { AcSalesChartComponentModule } from '../../components/ac-sales-chart/ac-sales-chart.module';
// import { StockChartComponentModule } from '../../components/stock-chart/stock-chart.module';

@NgModule({
  declarations: [
    ProdMetricsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
    ComponentsModule
    // AcChartComponentModule,
    // ProdChartComponentModule,
    // AcSalesChartComponentModule,
    // StockChartComponentModule
  ],
  entryComponents: [
  ],
  exports: [
    ProdMetricsPage,
  ]
})
export class ProdMetricsPageModule {}
