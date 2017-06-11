import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

// importo AngularFire2 modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// settings AF2
export const firebaseConfig = {
  apiKey: "AIzaSyA5Mq1opoK6B4WaP-_KhEZ_CZVNZrJBb1E",
  authDomain: "repmant-ce7a5.firebaseapp.com",
  databaseURL: "https://repmant-ce7a5.firebaseio.com",
  projectId: "repmant-ce7a5",
  storageBucket: "repmant-ce7a5.appspot.com",
  messagingSenderId: "872720422739"
};

// 3eros
import { GooglePlus } from '@ionic-native/google-plus';
import { ElasticModule } from 'angular2-elastic';

// providers
import { ApiDataProvider } from '../providers/api-data/api-data';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { MachineLogDataProvider } from '../providers/machine-log-data/machine-log-data';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ElasticModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiDataProvider,
    AuthDataProvider,
    MachineLogDataProvider
  ]
})
export class AppModule {}
