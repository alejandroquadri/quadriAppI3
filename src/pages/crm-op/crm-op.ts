import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import * as moment from 'moment';

import { CrmDataProvider, SplitShowProvider } from '../../providers';
import { FieldFilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-crm-op',
  templateUrl: 'crm-op.html',
})
export class CrmOpPage {

  months: any;
	opObs: any;
	opList: any;

	salesRep = "";
	statusOptions = ['Pendiente', 'Rechazado', 'Cerrado'];

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private crmData: CrmDataProvider,
  	private splitShow: SplitShowProvider,
  	public popoverCtrl: PopoverController
	) {
    this.buildCloseMonth();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrmOpPage');
    this.opObs = this.crmData.getOpsList();
    this.opObs.subscribe( ops => this.opList = ops );
  }

  buildCloseMonth() {
    this.months = [];
    for (let i = 0; i < 24; i++) {
      let today =  moment();
      let item = today.add(i, 'month').format('MM-YYYY');
      this.months.push(item);
    }
  }

  changeStatus(status: string, key: string) {
    console.log('status changed', key, status);
    this.crmData.updateOp(key, {status: status})
    .then( () => console.log('status actualizado'));
  }

  changeCloseMonth(closeMonth: string, key: string) {
    console.log('status changed', key, closeMonth);
    this.crmData.updateOp(key, {closeMonth: closeMonth})
    .then( () => console.log('closeMonth actualizado'));
  }

  seeOp(op: any, key: string) {

  }

  editOp(op: any, key: string) {

  }

}
