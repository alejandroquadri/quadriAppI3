import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import { map } from 'rxjs/operators';

import { CrmDataProvider, SalesDataProvider } from '../../providers';
import { FilterPipe, SortPipe } from '../../pipes';


@IonicPage()
@Component({
  selector: 'page-crm-prices',
  templateUrl: 'crm-prices.html',
})
export class CrmPricesPage {

  pricesSubs: any;
  stockSubs: any;
  obsSubs: any;

  pricesList: any;
  stockList: any;
  priceView: any;

  searchInput = '';
  sortTerm = 'codigo';
  sortDir = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private crmData: CrmDataProvider,
    private salesData: SalesDataProvider,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe,
  ) {
  }

  ionViewDidLoad() {
    this.pricesSubs = this.crmData.getPrices()
    .pipe(
      map( res => res.json())
    )
    this.stockSubs = this.salesData.getStock()
    .pipe(
      map( res => res.json())
    )
    this.obsSubs = Observable.combineLatest( this.pricesSubs, this.stockSubs, (prices: any, stock: any) => ({prices, stock}))
    .subscribe( pair => {
      this.pricesList = pair.prices.data;
      this.stockList = pair.stock.data;
      console.log(this.pricesList, this.stockList);
      this.filter();
    })
  }

  searchBar(event) {
    this.searchInput = event;
    this.filter();
  }

  filter() {
    this.priceView = this.filterPipe.transform(this.pricesList, this.searchInput, false);
    this.sort();
  }

  sort() {
    this.priceView =  this.sortPipe.transform(this.priceView, this.sortTerm, this.sortDir, false);
  }

}
