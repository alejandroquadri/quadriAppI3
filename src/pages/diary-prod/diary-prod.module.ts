import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiaryProdPage } from './diary-prod';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DiaryProdPage,
  ],
  imports: [
    IonicPageModule.forChild(DiaryProdPage),
    PipesModule,
  ],
  exports: [
    DiaryProdPage
  ]
})
export class DiaryProdPageModule {}
