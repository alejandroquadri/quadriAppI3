import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmPspDetailPage } from './crm-psp-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CrmPspDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmPspDetailPage),
    PipesModule,
    ComponentsModule
  ],
})
export class CrmPspDetailPageModule {}
