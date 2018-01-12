import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdMetricsPage } from './prod-metrics';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProdMetricsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdMetricsPage),
    ComponentsModule
  ],
  entryComponents: [
  ],
  exports: [
    ProdMetricsPage,
  ]
})
export class ProdMetricsPageModule {}
