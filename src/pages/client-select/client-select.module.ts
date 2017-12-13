import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientSelectPage } from './client-select';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ClientSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientSelectPage),
    PipesModule
  ],
})
export class ClientSelectPageModule {}
