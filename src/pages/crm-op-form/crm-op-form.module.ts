import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmOpFormPage } from './crm-op-form';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CrmOpFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmOpFormPage),
    PipesModule
  ],
  entryComponents: [
  ]
})
export class CrmOpFormPageModule {}
