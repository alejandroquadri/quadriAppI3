import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';

import { ChartDrawComponent } from '../chart-draw/chart-draw';
import { ProdChartComponent } from './prodChart';

@NgModule({
  declarations: [
	  ProdChartComponent,
  ],
  imports: [
    IonicModule,
    PipesModule
  ],
  entryComponents: [
  ChartDrawComponent,
  ],
  exports: [
	  ProdChartComponent
  ]
})
export class ProdChartComponentModule {}