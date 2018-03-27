import { Injectable } from '@angular/core';
import { HttpApiProvider, ApiDataProvider } from '../../providers';

@Injectable()
export class SalesDataProvider {

  constructor(
    private httpApi: HttpApiProvider,
    private apiData: ApiDataProvider
	) {
  }

  getRevenue(start: string, end:string) {
    return this.httpApi.get(`ventas/ok/${start}/${end}`);
  }

  getStock() {
  	return this.httpApi.get('stock');
  }

  getObjectivesOld() {
    return this.httpApi.get('ventas/objetivos');
  }

  getObjectives() {
    return this.apiData.getObject('crm/objectives');
  }

}
