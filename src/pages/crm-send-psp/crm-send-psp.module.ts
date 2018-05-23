import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmSendPspPage } from './crm-send-psp';

import { PipesModule } from '../../pipes/pipes.module';
import { ElasticModule } from 'angular2-elastic';

@NgModule({
  declarations: [
    CrmSendPspPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmSendPspPage),
    PipesModule,
    ElasticModule
  ],
})
export class CrmSendPspPageModule {}
