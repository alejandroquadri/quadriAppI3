import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmOpDetailPage } from './crm-op-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    CrmOpDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmOpDetailPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CrmOpDetailPageModule {}
