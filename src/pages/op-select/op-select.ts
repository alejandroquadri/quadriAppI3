import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';
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
    private filterPipe: FilterPipe,
    private fieldFilterPipe: FieldFilterPipe,
    private viewCtrl: ViewController,
    private crmData: CrmDataProvider
  ) {
  }

  searchInput = '';
  opSubs: any;
  opList: Array<any>;
  filteredClients;

  ionViewDidLoad() {
  	this.opSubs = this.crmData.getOps();
  	this.opSubs.subscribe( ops => {
  		this.opList = ops;
  		console.log(this.opList);
  		this.filter();
  	})
    
  }

  filter(event?) {
  	if(this.searchInput !== '') {
  		this.filteredClients = this.opList.filter((op:any) => {
	      return (op.payload.val().obra.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1);
	    });
		 } else {
		 	this.filteredClients = this.opList;
		 }
  }

  selectOp(op, key) {
    this.viewCtrl.dismiss({op: op, key: key});
  }

}
