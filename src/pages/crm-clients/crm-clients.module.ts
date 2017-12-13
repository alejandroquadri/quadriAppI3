import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmClientsPage } from './crm-clients';

@NgModule({
  declarations: [
    CrmClientsPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmClientsPage),
  ],
})
export class CrmClientsPageModule {}
