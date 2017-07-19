import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdSignPage } from './prod-sign';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProdSignPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdSignPage),
    PipesModule
  ],
  exports: [
    ProdSignPage
  ]
})
export class ProdSignPageModule {}