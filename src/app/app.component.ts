import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Content } from 'ionic-angular';

import { AuthDataProvider, SplitShowProvider, StaticDataProvider } from '../providers';


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
    public splitShow: SplitShowProvider,
    public authData: AuthDataProvider,
    public staticData: StaticDataProvider
  ) {
    platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.console.log('did load');
      authData.user.subscribe( user => {
        console.log(user);
        this.userProfile = user;
        if (user) {
          if(!this.authData.checkIfQuadri(user.email)) { 
            this.logOut();
          } else {
            this.authData.uid = user.uid;
            this.authData.current = user;
            this.staticData.getStaticData()
            .then( ret => {
              this.first? this.rootPage = this.setRoot() : this.nav.setRoot(this.setRoot());
            })
          }
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
    this.nav.setRoot('LoginPage')
    .then( () => {
      console.log('fue a root, cambio');
      this.authData.logout();
    })
  }

  shouldShow() {
    return this.splitShow.shouldShow();
  }

  setRoot() {
    if (this.platform.is('mobile')) {
      return 'ProdMetricsPage'
    } else {
      return 'ProdMetricsPage'
    }
  }

  permission(area: string) {
    return this.authData.checkRestriction(area, this.userProfile.email);
  }


}

