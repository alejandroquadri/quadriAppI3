import { Injectable } from '@angular/core';
import { HttpApiProvider } from '../../providers';

@Injectable()
export class SalesDataProvider {

  constructor(
  	private httpApi: HttpApiProvider,
	) {
  }

  // getRevenue() {
  // 	return this.httpApi.get('ventas');
  // }

  getRevenue(start: string, end:string) {
    return this.httpApi.get(`ventas/ok/${start}/${end}`);
  }

  getStock() {
  	return this.httpApi.get('stock');
  }

  getObjectives() {
    return this.httpApi.get('ventas/objetivos');
  }

}
