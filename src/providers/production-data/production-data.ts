import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';


@Injectable()
export class ProductionDataProvider {

  production: any;
  searchInput: string = '';
  field = 'date';
  asc = false;

  prodSubject = new ReplaySubject(1);
  prodObs = this.prodSubject.asObservable();

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
  	) {
    this.getProduction().subscribe( prod => {
      this.production = prod;
      this.filter();
    })
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

  setProdStop(prodKey: string, prod: any, stops: Array<any>) {
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
      let fanObj = this.api.fanOutObject(stop, [`production/${prodKey}/stops`,'stops'], true);
      Object.assign(stopForm, fanObj);
  	});
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

  filter() {
    const filtered = this.filterPipe.transform(this.production, this.searchInput)
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc);
    this.prodSubject.next(ordered);
  }
}
