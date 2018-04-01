import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdSuppliesPage } from './prod-supplies';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components';

@NgModule({
  declarations: [
    ProdSuppliesPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdSuppliesPage),
    PipesModule,
    ComponentsModule,
    ElasticModule
  ],
})
export class ProdSuppliesPageModule {}
