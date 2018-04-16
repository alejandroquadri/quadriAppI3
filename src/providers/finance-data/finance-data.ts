import { Injectable } from '@angular/core';
import { AuthDataProvider } from './../auth-data/auth-data';
import { ApiDataProvider } from './../api-data/api-data';
import firebase from 'firebase';

@Injectable()
export class FinanceDataProvider {

  constructor(
    private api: ApiDataProvider,
    private authData: AuthDataProvider
  ) {
  }

  getAvionList() {
    return this.api.getListMeta('finance/avion');
  }

  pushRecord(form) {
    let user = {
      uid: this.authData.current.uid,
      email: this.authData.current.email,
      displayName: this.authData.current.displayName,
    }
    form['user'] = user;
    form['timestamp'] = this.api.timestamp();    
    return this.api.push('finance/avion', form);
  }

  deleteRecord(key: string) {
    return this.api.removeItemList('finance/avion', key);
  }

  updateRecord(form: any, key:string) {
    return this.api.updateList('finance/avion', key, form);
  }

}
