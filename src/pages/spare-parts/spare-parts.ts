import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-spare-parts',
  templateUrl: 'spare-parts.html',
})
export class SparePartsPage {

	userProfile: any = null;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private authData: AuthDataProvider
	) {
		this.authData.user.subscribe( user => {
	  	this.userProfile = user;
	  })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SparePartsPage');
  }

  signOut() {
    this.authData.logout();
  }



}
