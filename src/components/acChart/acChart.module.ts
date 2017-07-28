import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AcChartComponent, AcChartHelperComponent} from './acChart';

@NgModule({
  declarations: [
	  AcChartComponent,
	  AcChartHelperComponent,
  ],
  imports: [IonicModule],
  entryComponents: [
    AcChartHelperComponent,
  ],
  exports: [
	  AcChartComponent
  ]
})
export class AcChartComponentModule {}