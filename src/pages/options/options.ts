import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {

  options: any = {};

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController
	) {
    if (this.navParams.data) {
    	this.options['form'] = this.navParams.data.form;
    	this.options['data'] = this.navParams.data.data;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');
  }

  dismiss(){
  	let data = { 'foo': 'bar' };
  	this.viewCtrl.dismiss(data)
  }

  toggle() {
  	this.viewCtrl.dismiss(this.options);
  }

}
