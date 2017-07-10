import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';

@NgModule({
  declarations: [
    ProdMetricsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
  ],
  exports: [
    ProdMetricsPage
  ]
})
export class ProdMetricsPageModule {}
