import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthDataProvider, SplitShowProvider } from '../providers';


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
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private splitShow: SplitShowProvider,
    private authData: AuthDataProvider
  ) {
    authData.user.subscribe( user => {
      console.log(user);
      this.userProfile = user;
      if (user) {
        this.rootPage = this.setRoot();
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
    platform.width()
  }

  openPage (page: string, params?: any) {
    this.nav.setRoot(page, params);
  }

  logOut() {
    this.authData.logout();
  }

  shouldShow(){
    return this.splitShow.show;
  }

  setRoot() {
    if (this.platform.is('mobile')) {
      return 'SparePartsFormPage'
    } else {
      return 'SparePartsPage'
    }
  }

}

