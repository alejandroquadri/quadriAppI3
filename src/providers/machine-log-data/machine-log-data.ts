import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';


@Injectable()
export class MachineLogDataProvider {

	machineLogs: any;
  searchInput: string = '';
  field = 'date';
  asc = false;

  machineLogsSubject = new ReplaySubject(1);
  machineLogsObs = this.machineLogsSubject.asObservable();

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
    console.log('Hello MachineLogDataProvider Provider');
    this.machineLogs = this.getMachineLogs();
    this.getMachineLogs().subscribe(logs => {
      this.machineLogs = logs;
      this.filter();
    })
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

  filter() {
    const filtered = this.filterPipe.transform(this.machineLogs, this.searchInput)
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc);
    this.machineLogsSubject.next(ordered);
  }

}
