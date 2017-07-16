import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-log',
  templateUrl: 'prod-log.html',
})
export class ProdLogPage {

	searchInput: any
	prodLogs: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public platform: Platform,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdLogPage');
    this.prodLogs = this.prodData.prodObs;
  }

  onChange(event) {
  	this.prodData.searchInput = event;
  	this.prodData.filter();
  }

  deleteLog(log) {
  	this.prodData.deleteProduction(log.$key)
  	.then ( () => {
  		if (log.stops) {
	  		let stopKeys = Object.keys(log.stops);
		  	this.prodData.removeProdStop(stopKeys);
	  	}
  	})
  }

  editLog(log) {
   this.navCtrl.push('PartesFormPage', log);
  }

}