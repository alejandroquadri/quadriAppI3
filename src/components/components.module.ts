import { NgModule } from '@angular/core';
import { AcSalesChartComponent } from './ac-sales-chart/ac-sales-chart';
import { ChartDrawComponent } from './chart-draw/chart-draw';
@NgModule({
	declarations: [AcSalesChartComponent,
    ChartDrawComponent],
	imports: [],
	exports: [AcSalesChartComponent,
    ChartDrawComponent]
})
export class ComponentsModule {}
