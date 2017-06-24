import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class SparePartsDataProvider {

	spareParts: any;

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider
	) {
    console.log('Hello SparePartsProvider Provider');
  	this.spareParts = this.getSpareParts();
  }

  pushSparePart(form: any) {
  	return this.api.push('repuestos2', form);
  }

  getSpareParts() {
  	return this.api.getList('repuestos2');
  }

  deleteSparePart(key) {
  	return this.api.removeItemList('repuestos2', key);
  }

  updateSparePart(key, form) {
  	return this.api.updateList('repuestos2', key, form);
  }

  updateSettings(form: boolean, data: boolean) {
		let obj = {
	  		form: form,
	  		data: data
	  	}
		return this.api.updateObject(`userSettings/${this.authData.uid}/repuestos2`,obj);
	}

	getSettings() {
		return this.api.getObject(`userSettings/${this.authData.uid}/repuestos2`);
	}

}
