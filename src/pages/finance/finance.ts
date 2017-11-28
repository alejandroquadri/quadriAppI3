import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { financeMock } from '../../assets/static-data/finance';

@IonicPage()
@Component({
  selector: 'page-finance',
  templateUrl: 'finance.html',
})
export class FinancePage {

  data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams)
  {
      this.data = financeMock;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinancePage');
  }

}
