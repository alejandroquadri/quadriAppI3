import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import { map } from 'rxjs/operators';


import { HttpApiProvider, ApiDataProvider } from '../../providers';

@Injectable()
export class CrmDataProvider {

	calipsoSubs: any
  checkedPspSubs: any;
  checkedPspObj: any;

	private calipsoObjSubject = new BehaviorSubject({});
	public calipsoObj = this.calipsoObjSubject.asObservable();

  constructor(
    private httpApi: HttpApiProvider,
    private apiData: ApiDataProvider
  ) {
			this.subscribeToCalipsoDocs()
	  }

  getDocs() {
    return this.httpApi.get('ventas/docs');
  }

  getCheckedPsp() {
    return this.apiData.getObject('crm/checkPsp');
  }

  getOps() {
    return this.apiData.getListMeta('crm/op');
  }

  newOp(op) {
  	return this.apiData.push('crm/op', op);
  }

  newClient(client) {
    return this.apiData.push('crem/client', client);
  }

  razSoc(key, client) {
    let form = {};
    form[key] = client;
    return this.apiData.updateObject('crm/razSoc', form)
  }

  checkPsp(psp) {
  	let form = {};
  	form[psp] = true;
  	return this.apiData.updateObject('crm/checkPsp',form);
  }

  subscribeToCalipsoDocs() {
  	this.calipsoSubs = this.getDocs()
    .pipe(
      map( (res:any) => res.json())
    );

    this.checkedPspSubs = this.getCheckedPsp();

    Observable.combineLatest(this.calipsoSubs, this.checkedPspSubs, (psps: any, checkedPsps: any) => ({psps, checkedPsps}))
    .subscribe( pair => {
      this.checkedPspObj = pair.checkedPsps;
      this.buildCalipsoObj(pair.psps.data);
    })

  }

  buildCalipsoObj(array: any) {
  	let filteredObj = {};

    array.filter((obj:any) => {
      return (obj.descripcion === 'Presupuesto de Venta' && (obj.flag === 'Pronostico' || obj.flag ==='Pendiente') && (!this.checkedPspObj[obj.numerodocumento]))
    })
    .forEach((psp:any) => {
      if(filteredObj[psp.numerodocumento]) {
        filteredObj[psp.numerodocumento].total += (+psp.total_importe);
        filteredObj[psp.numerodocumento].items.push(psp);
      } else {
        filteredObj[psp.numerodocumento] = {
          date: psp.fecha_documento,
          num: psp.numerodocumento,
          razSoc: psp.nombredestinatariotr,
          salesRep: psp.nombreoriginantetr,
          total: +psp.total_importe
        }
        filteredObj[psp.numerodocumento].items = [];
        filteredObj[psp.numerodocumento].items.push(psp)
      }
    });
    this.calipsoObjSubject.next(filteredObj);
  }

}
