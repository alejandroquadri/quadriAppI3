import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthDataProvider } from '../providers/auth-data/auth-data';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  userProfile: any = null;
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authData: AuthDataProvider
  ) {
    authData.user.subscribe( user => {
      console.log(user);
      this.userProfile = user;
      if (user) {
        this.rootPage = 'SparePartsPage';
      } else {
        this.rootPage = 'LoginPage'
      }
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      });
    })
  }

  openPage (page: string, params?: any) {
    this.nav.setRoot(page, params);
  }
}

