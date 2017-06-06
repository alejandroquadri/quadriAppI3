import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';

import { AuthDataProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	quadriImg: string = "./assets/images/quadri.jpg";

	userProfile: any = null;

  constructor(
  	public platform: Platform,
  	private authData: AuthDataProvider,
  	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
  	if (this.platform.is('cordova')) {
  		this.authData.signInWithGoogleDevice();
  	} else {
  		this.authData.signInWithGoogleWeb();
  	} 
  }

}
