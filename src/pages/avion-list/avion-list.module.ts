import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvionListPage } from './avion-list';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AvionListPage,
  ],
  imports: [
    IonicPageModule.forChild(AvionListPage),
    ElasticModule,
    PipesModule,
    ComponentsModule
  ],
})
export class AvionListPageModule {}
