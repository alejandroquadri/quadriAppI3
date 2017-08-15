import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AcSalesChartComponent} from './ac-sales-chart';
import { ChartDrawComponent } from '../chart-draw/chart-draw';
import { ChartDrawComponentModule } from '../chart-draw/chart-draw.module';

@NgModule({
  declarations: [
    AcSalesChartComponent,
  ],
  imports: [
    IonicModule,
    ChartDrawComponentModule
  ],
  entryComponents: [
    ChartDrawComponent,
  ],
  exports: [
    AcSalesChartComponent
  ]
})
export class AcSalesChartComponentModule {}