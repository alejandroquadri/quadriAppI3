import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SplitShowProvider } from '../../providers';

/**
 * Generated class for the CrmDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crm-dashboard',
  templateUrl: 'crm-dashboard.html',
})
export class CrmDashboardPage {

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private splitShow: SplitShowProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrmDashboardPage');
  }

}
