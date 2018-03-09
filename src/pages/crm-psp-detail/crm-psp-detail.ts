import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crm-psp-detail',
  templateUrl: 'crm-psp-detail.html',
})
export class CrmPspDetailPage {

  psp: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.psp = this.navParams.data;
  }

}
