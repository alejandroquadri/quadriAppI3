import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartesFormPage } from './partes-form';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PartesFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PartesFormPage),
    ElasticModule,
    PipesModule,
    ComponentsModule
  ],
  exports: [
    PartesFormPage
  ]
})
export class PartesFormPageModule {}
