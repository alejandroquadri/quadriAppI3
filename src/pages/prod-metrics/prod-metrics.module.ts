import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';
import { PipesModule } from '../../pipes/pipes.module';
import { AcChartComponent, ProdChartComponent } from '../../components';

@NgModule({
  declarations: [
    ProdMetricsPage,
    AcChartComponent,
    ProdChartComponent
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
    PipesModule
  ],
  entryComponents: [
    AcChartComponent,
    ProdChartComponent
  ],
  exports: [
    ProdMetricsPage
  ]
})
export class ProdMetricsPageModule {}
