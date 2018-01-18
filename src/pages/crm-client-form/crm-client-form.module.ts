import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmClientFormPage } from './crm-client-form';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CrmClientFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmClientFormPage),
    PipesModule
  ],
})
export class CrmClientFormPageModule {}
