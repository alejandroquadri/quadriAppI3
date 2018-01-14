import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';

@Injectable()
export class MachineLogDataProvider {

  constructor(
  	private api: ApiDataProvider,
	) {
  }

  pushMachineLog(form: any) {
  	return this.api.push('machineLogs', form);
  }

  getMachineLogs() {
  	return this.api.getList('machineLogs');
  }

  getMachineLogsMeta() {
    return this.api.getListMeta('machineLogs');
  }

  deleteLog(key) {
  	return this.api.removeItemList('machineLogs', key);
  }

  updateLog(key, form) {
  	return this.api.updateList('machineLogs', key, form);
  }

}
