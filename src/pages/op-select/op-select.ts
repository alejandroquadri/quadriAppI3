import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { CrmDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-op-select',
  templateUrl: 'op-select.html',
})
export class OpSelectPage {

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private crmData: CrmDataProvider
  ) {
  }

  searchInput = '';
  opSubs: any;
  opList: Array<any>;
  filteredOps;

  ionViewDidLoad() {
  	this.opSubs = this.crmData.getOpsList();
  	this.opSubs.subscribe( ops => {
  		this.opList = this.initialFilter(ops);
  		console.log(this.opList);
  		this.filter();
  	})
  }

  initialFilter(opList) {
    // permito que se vean solo las ops que aun estan pendientes
    return opList.filter((op:any) => {
      return op.payload.val().status === 'Pendiente';
    })
  }

  filter(event?) {
    // filtro que sirve para la searchbar
  	if(this.searchInput !== '') {
  		this.filteredOps = this.opList.filter((op:any) => {
	      return (op.payload.val().obra.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1);
	    });
		 } else {
		 	this.filteredOps = this.opList;
		 }
  }

  selectOp(op, key) {
    this.viewCtrl.dismiss({op: op, key: key});
  }

}
