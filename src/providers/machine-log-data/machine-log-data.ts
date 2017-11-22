import { Injectable } from '@angular/core';

import { ApiDataProvider } from '../api-data/api-data';

import { FilterPipe, SortPipe } from '../../pipes';


@Injectable()
export class MachineLogDataProvider {

  constructor(
  	private api: ApiDataProvider,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
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
