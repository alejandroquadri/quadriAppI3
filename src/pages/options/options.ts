import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SparePartsDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {

  options: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private sparePartsData: SparePartsDataProvider
	) {
    this.options = this.sparePartsData.filters;
  }

  updateFilters() {
    this.sparePartsData.filters = this.options;
    this.sparePartsData.updateFilters();
  }

}
