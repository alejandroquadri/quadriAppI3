import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmPricesPage } from './crm-prices';
import { ComponentsModule } from '../../components';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    CrmPricesPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmPricesPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CrmPricesPageModule {}
