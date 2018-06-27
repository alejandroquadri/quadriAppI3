import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CrmDataProvider, StaticDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-op-filters',
  templateUrl: 'crm-op-filters.html',
})
export class CrmOpFiltersPage {

	filters: any;
  months: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private crmData: CrmDataProvider,
    private staticData: StaticDataProvider
  	) {
      // this.filters = this.crmData.filters;
      this.filters = this.staticData.data.crm.filters;
      this.months = this.crmData.buildCloseMonth();
  	}
    
  ionViewDidLoad() {
    this.currentSales();
  }

  updateFilters() {
    this.crmData.filters = this.filters;
    this.crmData.updateFilters();
  }

  currentSales() {
    let current =  this.crmData.currentSalesRepCheck();
    switch (current) {
      case 'Tarruella Alberto Horacio ':
        this.filters.salesRep.roldan = false;
        break;

      case 'Alejandra Roldan':
      this.filters.salesRep.tarruella = false;
        break;
    }
  }

}
