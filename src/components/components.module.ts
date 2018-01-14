import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';

import { ChartDrawComponent } from './chart-draw/chart-draw';
import { OpChartComponent } from './op-chart/op-chart';
import { ProdChartComponent } from './prodChart/prodChart';
import { AcChartComponent } from './acChart/acChart';
import { AcSalesChartComponent } from './ac-sales-chart/ac-sales-chart';
import { StockChartComponent } from './stock-chart/stock-chart';
import { SplitCtrlComponent } from './split-ctrl/split-ctrl';

@NgModule({
	declarations: [
    OpChartComponent,
    ChartDrawComponent,
    ProdChartComponent,
    AcChartComponent,
    AcSalesChartComponent,
    StockChartComponent,
    SplitCtrlComponent
  ],
	imports: [
		IonicModule,
    PipesModule,
	],
  entryComponents: [
    ChartDrawComponent,
  ],
 	exports: [
    OpChartComponent,
    ChartDrawComponent,
    ProdChartComponent,
    AcChartComponent,
    AcSalesChartComponent,
    StockChartComponent,
    SplitCtrlComponent
  ],

})
export class ComponentsModule {}
