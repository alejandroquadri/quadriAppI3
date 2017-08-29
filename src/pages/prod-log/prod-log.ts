import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { ProductionDataProvider, SplitShowProvider } from '../../providers';
import { FilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-prod-log',
  templateUrl: 'prod-log.html',
})
export class ProdLogPage {

	prodLogs: any;
  prodSubs: any;

  production: any;
  searchInput: string = '';
  field = 'date';
  asc = false;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public platform: Platform,
    private prodData: ProductionDataProvider,
    private splitShow: SplitShowProvider,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdLogPage');
    // this.prodLogs = this.prodData.filteredProdObs;
    this.prodSubs = this.prodData.getProduction().subscribe( prod => {
      this.production = prod;
      // this.prodSubject.next(prod);
      this.filter();
    })
  }

  ionViewWillUnload() {
    console.log('willunload');
    console.log('desuscripcion production');
    this.prodSubs.unsubscribe();
  }

  filter() {
    const filtered = this.filterPipe.transform(this.production, this.searchInput)
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc);
    this.prodLogs = ordered;
  }

  onChange(event) {
  	this.searchInput = event;
  	this.filter();
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

  pushPrint() {
    this.navCtrl.push('ProdSignPage');
  }

}
