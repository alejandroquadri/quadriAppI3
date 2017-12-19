import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

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
      this.buildCloseMonth();
  	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrmOpFiltersPage');
  }

  updateFilters() {
    this.crmData.filters = this.filters;
    this.crmData.updateFilters();
  }

  buildCloseMonth() {
    this.months = [];
    for (let i = 0; i < 24; i++) {
      let today =  moment();
      let item = today.add(i, 'month').format('MM-YYYY');
      this.months.push(item);
    }
  }

}
