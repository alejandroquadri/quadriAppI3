import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmClientFormPage } from './crm-client-form';

@NgModule({
  declarations: [
    CrmClientFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmClientFormPage),
  ],
})
export class CrmClientFormPageModule {}
