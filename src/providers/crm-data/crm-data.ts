import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import { HttpApiProvider, ApiDataProvider } from '../../providers';

@Injectable()
export class CrmDataProvider {

	calipsoSubs: any;
  checkedPspSubs: any;
  checkedPspObj: any;
  statusOptions = ['Pendiente', 'Rechazado', 'Cerrado'];
  actions = ['Llamada', 'Envio de muestra', 'Visita', 'Mail', 'Nota'];
  salesReps = ['Alejandra Roldan', 'Tarruella Alberto Horacio '];
  clientTypes = ['Constructora', 'Estudio Arq', 'Dsitribuidor', 'Adm Consorcio', 'Cliente Final'];
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
    private apiData: ApiDataProvider,
  ) {
			this.subscribeToCalipsoDocs();
      this.updateFilters();
	  }

  subscribeToCalipsoDocs() {
    this.calipsoSubs = this.getDocs()
    .pipe(
      map( (res:any) => res.json())
    )
    .subscribe( docs => {
      this.buildCalipsoObj(docs.data);
    })
  }

  buildCalipsoObj(array: any) {
    let filteredObj = {
      np: {},
      psp: {},
      invoice: {}
    };

    array.forEach((doc:any) => {
      if(doc.descripcion === 'Presupuesto de Venta') {
        if(filteredObj.psp[doc.numerodocumento]) {
          filteredObj.psp[doc.numerodocumento].total += (+doc.total_importe);
          filteredObj.psp[doc.numerodocumento].items.push(doc);
        } else {
          filteredObj.psp[doc.numerodocumento] = {
            date: doc.fecha_documento,
            num: doc.numerodocumento,
            razSoc: doc.nombredestinatariotr,
            salesRep: doc.nombreoriginantetr,
            total: +doc.total_importe,
            flag: doc.flag
          }
          filteredObj.psp[doc.numerodocumento].items = [];
          filteredObj.psp[doc.numerodocumento].items.push(doc)
        }
      }
    });
    this.calipsoObjSubject.next(filteredObj);
  }

  buildCloseMonth(subsMonths?: number) {
    let months = [];
    let today; 
    subsMonths ? today = moment() : today = moment().subtract(subsMonths, 'months');

    for (let i = 0; i < 24; i++) {
      let item = today.clone().add(i, 'month').format('YYYY-MM')
      months.push(item);
    }
    return months;
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

  getOpsListSimple() {
    return this.apiData.getList('crm/op');
  }

  getClients() {
    return this.apiData.getListMeta('crm/clients')
  }

  getClientsObj() {
    return this.apiData.getObject('crm/clients');
  }

  getClient(key: string) {
    return this.apiData.getObject(`crm/clients/${key}`);
  }

  getOp(key) {
    return this.apiData.getObject(`crm/op/${key}`);
  }

  getAgendaObj() {
    return this.apiData.getObject('crm/agenda');
  }

  getAgendaList() {
    return this.apiData.getListMeta('crm/agenda');
  }

  getContactObj() {
    return this.apiData.getObject('crm/contacts');
  }

  ignorePsp(psp: string) {
    let form = {}
    form[psp] = 'ignored';
    return this.apiData.updateObject('crm/checkPsp', form)
  }

  saveNewOp(opForm: any, clientForm: any, psp?:any, razSoc?: string, opKey?: string, cliKey?: string) {
    // console.log('llega', opForm, clientForm, psp, razSoc, opKey, cliKey);
    let razSocObj;
    let checkPsp;
    if (!opKey) { opKey = this.apiData.getNewKey() }
    if (!cliKey) { cliKey = this.apiData.getNewKey() }
    if (!clientForm['ops']) { clientForm['ops']= {} }

    clientForm['ops'][opKey] = true;
    opForm['clientKey'] = cliKey;

    let oportunity = this.apiData.fanOutObject(opForm, [`crm/op/${opKey}`], false);
    let client = this.apiData.fanOutObject(clientForm, [`crm/clients/${cliKey}`], false)
    if (psp) {
      checkPsp = this.apiData.fanOutObject(psp, [`crm/checkPsp`], false);      
    } else {
      checkPsp = {};
    }
    if (razSoc) {
      razSocObj = this.apiData.fanOutObject(razSoc, [`crm/razSoc`], true);
    } else {
      razSocObj = {};
    }
    let updateObj = Object.assign({}, oportunity, client, checkPsp, razSocObj);
    // console.log(updateObj);
    return this.apiData.fanUpdate(updateObj);
  }

  newClient(client) {
    return this.apiData.push('crm/client', client);
  }

  newAgendaNote(agenda) {
    let agendaKey = this.apiData.getNewKey();
    let opAgenda = {};
    opAgenda[agendaKey] = true;

    let agendaLog = this.apiData.fanOutObject(agenda, [`crm/agenda/${agendaKey}`], false);
    let opUpdate = this.apiData.fanOutObject(opAgenda, [`crm/op/${agenda.opKey}/agenda`], false);
    let updateObj = Object.assign({}, agendaLog, opUpdate);
    // console.log(updateObj);
    return this.apiData.fanUpdate(updateObj);
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

  newContact(contact) {
    let contactKey = this.apiData.getNewKey();
    let clientContact = {};
    clientContact[contactKey] = true;
    
    let contacts = this.apiData.fanOutObject(contact, [`crm/contacts/${contactKey}`], false);
    let clientUpdate = this.apiData.fanOutObject(clientContact, [`crm/clients/${contact.clientKey}/contacts`], false);
    let updateObj = Object.assign({}, contacts, clientUpdate);
    console.log(updateObj);
    return this.apiData.fanUpdate(updateObj);
  }

  updateOp(key: string, form: any) {
    return this.apiData.updateList('crm/op', key, form);
  }

  updateClient(key: string, form: any) {
    return this.apiData.updateList('crm/clients', key, form)
  }

  updateAgendaItem(key: string, form: any) {
    return this.apiData.updateList('crm/agenda', key, form);
  }

  updateContact(key: string, form: any) {
    return this.apiData.updateList('crm/contacts', key, form);
  }

  delteAgendaItem(agendaKey: string, opKey) {
    let deleteObj = {};
    deleteObj[`crm/agenda/${agendaKey}`] = null;
    deleteObj[`crm/op/${opKey}/agenda/${agendaKey}`] = null;
    return this.apiData.fanUpdate(deleteObj);
  }

  deleteContact(contactKey: string, clientKey: string) {
    let deleteObj = {};
    deleteObj[`crm/contacts/${contactKey}`] = null;
    deleteObj[`crm/clients/${clientKey}/contacts/${contactKey}`] = null;
    return this.apiData.fanUpdate(deleteObj);
  }

  updateFilters() {
    this.filterSubject.next(this.filters)
  }

}
