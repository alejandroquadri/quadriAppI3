import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Content } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthDataProvider, SplitShowProvider, SparePartsDataProvider } from '../providers';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  userProfile: any = null;
  first = true;
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content: Content;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private splitShow: SplitShowProvider,
    private authData: AuthDataProvider,
    private spareParts: SparePartsDataProvider
  ) {
    platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.console.log('did load');
      statusBar.styleDefault();
      splashScreen.hide();
      authData.user.subscribe( user => {
        console.log(user);
        this.userProfile = user;
        if (user) {
          this.authData.uid = user.uid;
          this.authData.current = user;
          this.rootPage = this.setRoot();
        } else {
          this.authData.uid = null;
          this.authData.current = null;
          this.first? this.rootPage = 'LoginPage' : this.nav.setRoot('LoginPage');
        }
        this.first = false;
      })
    });
      
  }
  
  openPage (page: string, params?: any) {
    this.nav.setRoot(page, params);
  }

  logOut() {
    // this.authData.diconnect();
    
    this.nav.setRoot('LoginPage')
    .then( () => {
      console.log('fue a root');
      this.authData.logout();
    })
  }

  shouldShow() {
    return this.splitShow.shouldShow();
  }

  setRoot() {
    if (this.platform.is('mobile')) {
      return 'SparePartsFormPage'
    } else {
      return 'SparePartsPage'
    }
  }


}

