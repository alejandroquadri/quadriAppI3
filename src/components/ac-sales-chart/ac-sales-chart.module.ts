import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AcSalesChartComponent, AcSalesChartHelperComponent} from './ac-sales-chart';

@NgModule({
  declarations: [
    AcSalesChartComponent,
    AcSalesChartHelperComponent,
  ],
  imports: [IonicModule],
  entryComponents: [
    AcSalesChartHelperComponent,
  ],
  exports: [
    AcSalesChartComponent
  ]
})
export class AcChartComponentModule {}