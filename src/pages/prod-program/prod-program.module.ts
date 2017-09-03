import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdProgramPage } from './prod-program';

@NgModule({
  declarations: [
    ProdProgramPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdProgramPage),
  ],
})
export class ProdProgramPageModule {}
