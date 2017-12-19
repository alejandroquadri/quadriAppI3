import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmOpFiltersPage } from './crm-op-filters';

@NgModule({
  declarations: [
    CrmOpFiltersPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmOpFiltersPage),
  ],
})
export class CrmOpFiltersPageModule {}
