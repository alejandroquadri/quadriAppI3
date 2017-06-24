import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class SettingsProvider {

	settings = {
		spareParts: {
			form: true,
			data: true
		},
		machineLog: {
			form: true,
			data: true
		}
	}
	settingsSubject = new BehaviorSubject(this.settings);
  settingsObs = this.settingsSubject.asObservable();

  constructor(
  	private api: ApiDataProvider,
  	private authData: AuthDataProvider
	) {
    console.log('Hello SettingsProvider Provider');
    this.getSettings().subscribe( savedSettings => {
    	if(savedSettings) {
    		this.settings = savedSettings;
		  }
    	this.settingsSubject.next(this.settings);
    })
  }

  changeView(page, form) {
  	this.settings[page] = form;
  	this.settingsSubject.next(this.settings);
  }

  updateSettings(page, form) {
		return this.api.updateObject(`userSettings/${this.authData.uid}/${page}`,form);
	}

	getSettings() {
		return this.api.getObject(`userSettings/${this.authData.uid}`);
	}

}
