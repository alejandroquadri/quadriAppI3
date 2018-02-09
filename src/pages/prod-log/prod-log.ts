import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, InfiniteScroll } from 'ionic-angular';

import { ProductionDataProvider } from '../../providers';
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
  offset = 100;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public platform: Platform,
    private prodData: ProductionDataProvider,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
    ) {
  }

  ionViewDidLoad() {
    this.prodSubs = this.prodData.getProductionMeta().subscribe( prod => {
      this.production = prod;
      this.filter();
    })
  }

  ionViewWillUnload() {
    this.prodSubs.unsubscribe();
  }

  filter() {
    const filtered = this.filterPipe.transform(this.production, this.searchInput, true);
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
    this.prodLogs = this.sliceArray(ordered);
  }

  onChange(event) {
    this.searchInput = event;
    this.offset = 100;
  	this.filter();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    setTimeout( () => {
      this.offset += 20;
      this.filter();
      infiniteScroll.complete()  
    }, 500)
  }

  deleteLog(log) {
    console.log(log, log.key);
    let logVal = log.payload.val();
  	this.prodData.deleteProduction(log.key)
  	.then ( () => {
  		if (logVal.stops) {
	  		let stopKeys = Object.keys(logVal.stops);
		  	this.prodData.removeProdStop(stopKeys);
	  	}
  	})
  }

  editLog(log, key) {
    log['$key'] = key
    this.navCtrl.push('PartesFormPage', log);
  }

  pushPrint() {
    this.navCtrl.push('ProdSignPage');
  }

}
