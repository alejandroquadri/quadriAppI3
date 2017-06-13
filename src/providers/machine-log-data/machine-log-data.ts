import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class MachineLogDataProvider {

	machineLogs: any;

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider
	) {
    console.log('Hello MachineLogDataProvider Provider');
    this.machineLogs = this.getMachineLogs();
  }

  pushMachineLog(form: any) {
  	return this.api.push('machineLogs', form);
  }

  getMachineLogs() {
  	return this.api.getList('machineLogs');
  }

  deleteLog(key) {
  	return this.api.removeItemList('machineLogs', key);
  }

  updateLog(key, form) {
  	return this.api.updateList('machineLogs', key, form);
  }

  updateSettings(form: boolean, data: boolean) {
		let obj = {
	  		form: form,
	  		data: data
	  	}
		return this.api.updateObject(`userSettings/${this.authData.uid}/mahchine-log`,obj);
	}

	getSettings() {
		return this.api.getObject(`userSettings/${this.authData.uid}/mahchine-log`);
	}

}
