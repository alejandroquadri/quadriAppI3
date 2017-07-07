import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';


@Injectable()
export class ProductionDataProvider {

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider
  	) {
    console.log('Hello ProductionDataProvider Provider');
  }

  pushProduction(form: any) {
  	form['timestamp'] = this.api.timestamp();
  	form['user'] = {
  		displayName: this.authData.current.displayName,
		  uid: this.authData.current.uid
		}
  	return this.api.push('production', form);
  }
 
  getProduction() {
  	return this.api.getList('production');
  }

  deleteProduction(key) {
  	return this.api.removeItemList('production', key);
  }

  updateProduction(key, form) {
  	return this.api.updateList('production', key, form);
  }

  setProdStop(prod: any, stops: Array<any>) {
  	let stopForm = {};
  	stops.forEach( item => {
  		let stop = {
      	timestamp: this.api.timestamp(),
      	user: {
		  		displayName: this.authData.current.displayName,
				  uid: this.authData.current.uid
				},
      	date: prod.date,
      	machine: prod.machine,
      	color: prod.color,
      	dim: prod.dim,
      	drawing: prod.drawing,
      	startP: item.startP,
        endP: item.endP,
        cause: item.cause
      }
      let fanObj = this.api.fanOutObject(stop, [`production/${prod.$key}/stops`,'stops'], true);
      Object.assign(stopForm, fanObj);
  	})
  	return this.api.fanUpdate(stopForm);
  }
}
