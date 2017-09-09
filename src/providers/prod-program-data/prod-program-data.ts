import { Injectable } from '@angular/core';
import { ApiDataProvider } from '../api-data/api-data';
import { StaticDataProvider } from '../static-data/static-data';

import * as moment from 'moment';

@Injectable()
export class ProdProgramDataProvider {

  constructor(
  	private api: ApiDataProvider,
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
  		console.log('diff servicio date');

  		let fanObj = this.api.fanOutObject(info, [`program/${date}/${mach}`], true);
  		fanObj[`program/${form.oldDate}`] = null;
  		console.log(fanObj);
  		return this.api.fanUpdate(fanObj);

  	} else if (diff === 'mach') {
  		console.log('diff servicio mach');

  		let fanObj = this.api.fanOutObject(info,[`program/${date}/${mach}`], true);
  		fanObj[`program/${date}/${form.oldMach}`] = null;
  		console.log(fanObj);
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

}
