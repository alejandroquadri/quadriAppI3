import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvionFormPage } from './avion-form';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from './../../directives/directives.module';

@NgModule({
  declarations: [
    AvionFormPage,
  ],
  imports: [
    IonicPageModule.forChild(AvionFormPage),
    ElasticModule,
    PipesModule,
    DirectivesModule
  ],
})
export class AvionFormPageModule {}
