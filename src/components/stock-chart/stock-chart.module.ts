import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { StockChartComponent } from './stock-chart';
import { ChartDrawComponent } from '../chart-draw/chart-draw';
import { ChartDrawComponentModule } from '../chart-draw/chart-draw.module';

@NgModule({
	declarations: [
		StockChartComponent
	],
	imports: [
		IonicModule,
		ChartDrawComponentModule
	],
	entryComponents: [
    ChartDrawComponent,
  ],
	exports: [
		StockChartComponent
	]
})
export class StockChartComponentModule {}
