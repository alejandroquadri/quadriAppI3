import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';

import { ProdChartComponent, ProdChartHelperComponent} from './prodChart';

@NgModule({
  declarations: [
	  ProdChartComponent,
	  ProdChartHelperComponent,
  ],
  imports: [
    IonicModule,
    PipesModule
  ],
  entryComponents: [
    ProdChartHelperComponent,
  ],
  exports: [
	  ProdChartComponent
  ]
})
export class ProdChartComponentModule {}