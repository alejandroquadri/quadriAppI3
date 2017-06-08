import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';

@Injectable()
export class MachineLogDataProvider {

	machineLogs: any;

  constructor(
  	private api: ApiDataProvider
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

}
