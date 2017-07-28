import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, /*ViewController */} from 'ionic-angular';

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
  	// public viewCtrl: ViewController,
    private sparePartsData: SparePartsDataProvider
	) {
    // if (this.navParams.data) {
    // 	this.form = this.navParams.data
    // }
    this.options = this.sparePartsData.filters;
  }

  updateFilters() {
    this.sparePartsData.filters = this.options;
    this.sparePartsData.filter();
  }

}
