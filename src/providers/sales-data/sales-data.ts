import { Injectable } from '@angular/core';
import { HttpApiProvider } from '../../providers';

@Injectable()
export class SalesDataProvider {

  constructor(
  	private httpApi: HttpApiProvider,
	) {
  }

  getRevenue() {
  	return this.httpApi.get('ventas')
  }

}
