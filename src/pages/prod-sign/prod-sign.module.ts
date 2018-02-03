import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdSignPage } from './prod-sign';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components';

@NgModule({
  declarations: [
    ProdSignPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdSignPage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    ProdSignPage
  ]
})
export class ProdSignPageModule {}