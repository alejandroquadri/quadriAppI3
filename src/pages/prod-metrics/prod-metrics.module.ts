import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProdMetricsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
    PipesModule
  ],
  exports: [
    ProdMetricsPage
  ]
})
export class ProdMetricsPageModule {}
