import { Injectable } from '@angular/core';
import { ApiDataProvider } from '../api-data/api-data';

@Injectable()
export class ProdProgramDataProvider {

  constructor(
  	public api: ApiDataProvider,
  	) {
    console.log('Hello ProdProgramDataProvider Provider');
  }

  getProgram() {
  	return this.api.getObject('program');
  }

}
