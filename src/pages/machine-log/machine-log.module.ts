import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineLogPage } from './machine-log';

// import { MomentFormatPipe } from '../../pipes/moment-format/moment-format';
// import { FilterPipe } from '../../pipes/filter/filter';

import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module'
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  declarations: [
    MachineLogPage,
    // MomentFormatPipe,
    // FilterPipe
  ],
  imports: [
    IonicPageModule.forChild(MachineLogPage),
    ElasticModule,
    PipesModule,
    MyDatePickerModule,
  ],
  exports: [
    MachineLogPage
  ]
})
export class MachineLogPageModule {}
