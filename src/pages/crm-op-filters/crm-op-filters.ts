import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CrmDataProvider } from '../../providers';

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
  	private crmData: CrmDataProvider
  	) {
  		this.filters = this.crmData.filters;
      this.months = this.crmData.buildCloseMonth();
  	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrmOpFiltersPage');
  }

  updateFilters() {
    this.crmData.filters = this.filters;
    this.crmData.updateFilters();
  }

}
