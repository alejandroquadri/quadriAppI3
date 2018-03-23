import { Injectable } from '@angular/core';
import { ApiDataProvider } from '../api-data/api-data';
import { HttpApiProvider } from '../http-api/http-api';
import { StaticDataProvider } from '../static-data/static-data';

import * as moment from 'moment';

@Injectable()
export class ProdProgramDataProvider {

  constructor(
  	private api: ApiDataProvider,
  	private httpApi: HttpApiProvider,
  	private staticData: StaticDataProvider
  	) {
    console.log('Hello ProdProgramDataProvider Provider');
  }

  getProgram() {
  	return this.api.getObject('program');
  }

  addNew(form: any) {
  	let date = moment(form.date).format('YYYYMMDD');
  	let mach = form.machine;
  	let key = this.api.getNewKey();
  	let code = `${this.staticData.codebuilder.drawing[form.drawing]}${this.staticData.codebuilder.color[form.color]}${this.staticData.codebuilder.dim[form.dim]}`
  	let info = {
  		color: form.color,
  		dim: form.dim,
  		drawing: form.drawing,
  		codigo: code,
  		observacion: form.obs,
  		valor: form.quantity,
  		unidad: form.unit
  	}
		return this.api.updateObject(`program/${date}/${mach}/${key}`,info);
  }

  update(form, key, diff: string) {
  	let date = moment(form.date).format('YYYYMMDD');
  	let mach = form.machine;
  	let code = `${this.staticData.codebuilder.drawing[form.drawing]}${this.staticData.codebuilder.color[form.color]}${this.staticData.codebuilder.dim[form.dim]}`
  	let info = {
  		color: form.color,
  		dim: form.dim,
  		drawing: form.drawing,
  		codigo: code,
  		observacion: form.obs,
  		valor: form.quantity,
  		unidad: form.unit
  	}
  	if (diff === 'date') {
  		let fanObj = this.api.fanOutObject(info, [`program/${date}/${mach}`], true);
  		fanObj[`program/${form.oldDate}/${form.oldMach}/${key}`] = null;
  		return this.api.fanUpdate(fanObj);

  	} else if (diff === 'mach') {
  		let fanObj = this.api.fanOutObject(info,[`program/${date}/${mach}`], true);
  		fanObj[`program/${date}/${form.oldMach}/${key}`] = null;
  		return this.api.fanUpdate(fanObj);
  	} else {
  		return this.api.updateObject(`program/${date}/${mach}/${key}`,info);
  	}
  }

  remove(form, key) {
  	let date = moment(form.date).format('YYYYMMDD');
  	let mach = form.machine;
  	return this.api.removeItemList(`program/${date}/${mach}`,key)
  }

  getEntregas() {
  	return this.httpApi.get('entregas');
	}
	
	getNPPendientes() {
		return this.httpApi.get('np');
	}

	getScProgram() {
		return this.api.getListMeta('sc-program');
	}

	pushNewScProg(form) {
		return this.api.push('sc-program', form);
	}

	updateScProg(form, key) {
		return this.api.updateList('sc-program', key, form);
	}

	deleteScProg(key) {
		return this.api.removeItemList('sc-program', key);
	}

}
