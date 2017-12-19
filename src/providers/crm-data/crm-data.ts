import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';


import { HttpApiProvider, ApiDataProvider } from '../../providers';

@Injectable()
export class CrmDataProvider {

	calipsoSubs: any
  checkedPspSubs: any;
  checkedPspObj: any;
  filters = {
    status: {
      pendiente: true,
      rechazado: false,
      cerrado: false
    },
    salesRep: {
      tarruella: true,
      roldan: true
    },
    month: ''
  }

	private calipsoObjSubject = new BehaviorSubject({});
	public calipsoObj = this.calipsoObjSubject.asObservable();

  filterSubject = new ReplaySubject(1);
  filterObs = this.filterSubject.asObservable();

  constructor(
    private httpApi: HttpApiProvider,
    private apiData: ApiDataProvider
  ) {
			this.subscribeToCalipsoDocs();
      this.updateFilters();
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
    if (!this.checkedPspObj) {
      this.checkedPspObj = {};
    }
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

  getDocs() {
    return this.httpApi.get('ventas/docs');
  }

  getCheckedPsp() {
    return this.apiData.getObject('crm/checkPsp');
  }

  getOpsList() {
    return this.apiData.getListMeta('crm/op');
  }

  getClients() {
    return this.apiData.getListMeta('crm/clients')
  }

  getClientsObj() {
    return this.apiData.getObject('crm/clients');
  }

  saveNewOp(opForm: any, clientForm: any, psp:any, razSoc: string, opKey?: string, cliKey?: string) {
    let razSocObj
    if (!opKey) { opKey = this.apiData.getNewKey() }
    if (!cliKey) { cliKey = this.apiData.getNewKey() }
    if (!clientForm['ops']) { clientForm['ops']= {} }

    clientForm['ops'][opKey] = true;
    opForm['clientKey'] = cliKey;

    let oportunity = this.apiData.fanOutObject(opForm, [`crm/op/${opKey}`], false);
    let client = this.apiData.fanOutObject(clientForm, [`crm/clients/${cliKey}`], false)
    let checkPsp = this.apiData.fanOutObject(psp, [`crm/checkPsp`], false);
    if (razSoc) {
      razSocObj = this.apiData.fanOutObject(razSoc, [`crm/razSoc`], true);
    } else {
      razSocObj = {};
    }
    let updateObj = Object.assign({}, oportunity, client, checkPsp, razSocObj);
    return this.apiData.fanUpdate(updateObj);
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

  updateOp(key: string, form: any) {
    return this.apiData.updateList('crm/op', key, form);
  }

  updateFilters() {
    this.filterSubject.next(this.filters)
  }
  

}
