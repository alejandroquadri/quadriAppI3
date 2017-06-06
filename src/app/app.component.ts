import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthDataProvider } from '../providers/auth-data/auth-data';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authData: AuthDataProvider
  ) {
    authData.user.subscribe( user => {
      console.log(user);
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
}

