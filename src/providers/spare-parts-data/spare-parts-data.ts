import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';

@Injectable()
export class SparePartsDataProvider {

	sparePartsFc: any;
  spareParts: any;
  filters = {
    completo: false,
    pendiente: true,
    suspendido: false,
    encargado: true
  }
  searchInput: string = '';
  field = 'fecha';
  asc = false;
  

  sparePartsSubject = new ReplaySubject(1);
  sparePartsObs = this.sparePartsSubject.asObservable();

  filterSubject = new ReplaySubject(1);
  filterObs = this.filterSubject.asObservable();

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
    this.updateFilters();
  }

  pushSparePart(form: any) {
  	return this.api.push('repuestos', form);
  }

  getSpareParts() {
  	return this.api.getList('repuestos');
  }

  getSparePartsMeta() {
    return this.api.getListMeta('repuestos');
  }

  deleteSparePart(key: string) {
  	return this.api.removeItemList('repuestos', key);
  }

  updateSparePart(key: string, form: any) {
  	return this.api.updateList('repuestos', key, form);
  }

  updateSettings(form: boolean, data: boolean) {
		let obj = {
	  		form: form,
	  		data: data
	  	}
		return this.api.updateObject(`userSettings/${this.authData.uid}/repuestos`,obj);
	}

	getSettings() {
		return this.api.getObject(`userSettings/${this.authData.uid}/repuestos`);
	}

  updateFilters() {
    this.filterSubject.next(this.filters)
  }

}
