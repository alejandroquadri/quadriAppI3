import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmOpPage } from './crm-op';

@NgModule({
  declarations: [
    CrmOpPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmOpPage),
  ],
})
export class CrmOpPageModule {}
