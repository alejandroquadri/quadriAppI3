import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiaryProdPage } from './diary-prod';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DiaryProdPage,
  ],
  imports: [
    IonicPageModule.forChild(DiaryProdPage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    DiaryProdPage
  ]
})
export class DiaryProdPageModule {}
