import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

import * as moment from 'moment';
import { StaticDataProvider } from '../static-data/static-data';

@Injectable()
export class ProductionDataProvider {

  production: any;
  searchInput: string = '';
  field = 'date';
  asc = false;
  // staticData: any;

  constructor(
  	private api: ApiDataProvider,
    private authData: AuthDataProvider,
    public staticData: StaticDataProvider
  	) {
      // this.staticData = this.staticDataP.data.produccion;
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

  getProductionMeta() {
    return this.api.getListMeta('production');
  }

  getProductionQuery(offset, startKey?) {
    return this.api.getListQuery('production', offset, startKey);
  }

  deleteProduction(key: string) {
  	return this.api.removeItemList('production', key);
  }

  updateProduction(key, form) {
  	return this.api.updateList('production', key, form);
  }

  setProdStop(prodKey: string, prod: any, stops: Array<any>) {
    console.log(prodKey, prod, stops);
    let timestamp = moment().format();
  	let stopForm = {};
  	stops.forEach( item => {
  		let stop = {
      	timestamp: timestamp,
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
      let fanObj = this.api.fanOutObject(stop, [`production/${prodKey}/stops`,'stops'], true);
      Object.assign(stopForm, fanObj);
    });
    console.log(stopForm)
  	return this.api.fanUpdate(stopForm);
  }

  updateProdStop (prodKey: string, prod: any, stops: Array<any>, keys: Array<string>) {
    let stopForm = {};
    stops.forEach( (item, index) => {
      let stop = {
        startP: item.startP,
        endP: item.endP,
        cause: item.cause
      }
      let fanObj = this.api.fanOutObject(stop, [`production/${prodKey}/stops/${keys[index]}`,`stops/${keys[index]}`], false);
      Object.assign(stopForm, fanObj);
    });
    return this.api.fanUpdate(stopForm);
  }

  removeProdStop (keys: Array<string>) {
    let removeObject = {};
    keys.forEach( key => {
      removeObject[`stops/${key}`] = null
    });
    console.log(removeObject);
    return this.api.fanUpdate(removeObject);
  }

  pushSupply(form) {
    this.api.push('supplies', form);
  }

  nominalCalc(mach, dim, takt, turno: number, almuerzo: number, paradas: number) {
    let equivalences = this.staticData.data.produccion.equivalences;
    if( takt !== 0) {
      let prodTime = (turno * 60 - almuerzo - paradas) * 60;
      let eq = equivalences[dim].conv
      if (mach === 'Breton') {
        takt = 60 / (takt / equivalences[dim].convMl);
      }
      let prod = prodTime / takt;
      return prod * eq;
    }
  }
}
