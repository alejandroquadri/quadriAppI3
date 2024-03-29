import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
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

//pipes
import { FieldFilterPipe, SortPipe, FilterPipe, CustomCurrencyPipe } from '../pipes';
import { DecimalPipe } from '@angular/common';

// providers
import { ApiDataProvider } from '../providers/api-data/api-data';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { StaticDataProvider } from '../providers/static-data/static-data';
import { MachineLogDataProvider } from '../providers/machine-log-data/machine-log-data';
import { SparePartsDataProvider } from '../providers/spare-parts-data/spare-parts-data';
import { SplitShowProvider } from '../providers/split-show/split-show';
import { ProductionDataProvider } from '../providers/production-data/production-data';
import { ChartBuilderProvider } from '../providers/chart-builder/chart-builder';
import { HttpApiProvider } from '../providers/http-api/http-api';
import { SalesDataProvider } from '../providers/sales-data/sales-data';
import { ProdProgramDataProvider } from '../providers/prod-program-data/prod-program-data';
import { CrmDataProvider } from '../providers/crm-data/crm-data';
import { FinanceDataProvider } from '../providers/finance-data/finance-data';

export function DataProviderFactory(provider: StaticDataProvider) {
  return () => provider.getStaticData();
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ElasticModule,
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
    { provide: APP_INITIALIZER, useFactory: DataProviderFactory, deps: [StaticDataProvider], multi: true },
    ApiDataProvider,
    AuthDataProvider,
    StaticDataProvider,
    MachineLogDataProvider,
    SparePartsDataProvider,
    FieldFilterPipe,
    SortPipe,
    FilterPipe,
    DecimalPipe,
    CustomCurrencyPipe,
    SplitShowProvider,
    ProductionDataProvider,
    ChartBuilderProvider,
    HttpApiProvider,
    SalesDataProvider,
    ProdProgramDataProvider,
    CrmDataProvider,
    FinanceDataProvider,
  ]
})
export class AppModule {}
