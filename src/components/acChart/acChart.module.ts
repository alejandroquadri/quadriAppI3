import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AcChartComponent } from './acChart';
import { ChartDrawComponentModule } from '../chart-draw/chart-draw.module';
import { ChartDrawComponent } from '../chart-draw/chart-draw';

@NgModule({
  declarations: [
	  AcChartComponent,
  ],
  imports: [
    IonicModule,
    ChartDrawComponentModule
  ],
  entryComponents: [
    ChartDrawComponent
  ],
  exports: [
	  AcChartComponent
  ]
})
export class AcChartComponentModule {}