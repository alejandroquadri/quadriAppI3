import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AcChartComponent } from './acChart';
import { ChartDrawComponent } from '../chart-draw/chart-draw';

@NgModule({
  declarations: [
	  AcChartComponent,
  ],
  imports: [IonicModule],
  entryComponents: [
    ChartDrawComponent
  ],
  exports: [
	  AcChartComponent
  ]
})
export class AcChartComponentModule {}