import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { CrmDataProvider, SplitShowProvider } from '../../providers';
import { FieldFilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-crm-op',
  templateUrl: 'crm-op.html',
})
export class CrmOpPage {

	opObs: any;
	opList: any;

	salesRep = "";
	statusOptions = ['Pendiente', 'Rechazado', 'Cerrada'];

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private crmData: CrmDataProvider,
  	private splitShow: SplitShowProvider,
  	public popoverCtrl: PopoverController
	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrmOpPage');
    this.opObs = this.crmData.getOps2();
    this.opObs.subscribe( ops => this.opList = ops );
  }

  changeStatus(status: string, key: string) {
    console.log('status changed', status);
    // this.spareData.updateSparePart(key, {status: status})
    // .then( () => console.log('status actualizado'));
  }

}
