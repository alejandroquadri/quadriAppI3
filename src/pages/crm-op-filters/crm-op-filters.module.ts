import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmOpFiltersPage } from './crm-op-filters';

import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    CrmOpFiltersPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmOpFiltersPage),
    PipesModule
  ],
})
export class CrmOpFiltersPageModule {}
