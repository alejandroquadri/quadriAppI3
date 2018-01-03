import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { CrmDataProvider, SplitShowProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-op-detail',
  templateUrl: 'crm-op-detail.html',
})
export class CrmOpDetailPage {

	@ViewChild('status') status;
	statusBis;
	opKey: string;
	op: any;
	opObs: Observable<any>
	calipsoObs: Observable<any>;
	agendaObs: Observable<any>;
	obs: any;
	calipsoObj: any;
	agendaObj: any;
	presupuestos: any;
	statusOptions: any;
	months: any;
	actions: any;
	agendaForm: FormGroup;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private crmData: CrmDataProvider,
  	private splitShow: SplitShowProvider,
  	private fb: FormBuilder,
  	) {
  	this.months = this.crmData.buildCloseMonth();
  	this.statusOptions = this.crmData.statusOptions;
  	this.actions = this.crmData.actions;
  	this.buildForm();
  }

  ionViewDidLoad() {
  	this.opKey = this.navParams.data.$key;
    this.opObs = this.crmData.getOp(this.opKey);
    this.calipsoObs = this.crmData.calipsoObj;
    this.agendaObs = this.crmData.getAgendaObj();

    this.obs = Observable.combineLatest( this.opObs, this.calipsoObs, this.agendaObs, ( op: any, calipsoObj: any, agendaObj) => ({op, calipsoObj, agendaObj}))
    .subscribe( (pair: any) => {
    	this.op = pair.op;
    	if (this.op) {
    		this.statusBis = this.op.status;
    		this.op['$key'] = this.opKey
    	}
    	this.calipsoObj = pair.calipsoObj.psp;
    	this.agendaObj = pair.agendaObj;
    })
  }

  buildForm() {
  	this.agendaForm = this.fb.group( {
  		time: ['', Validators.required],
  		action: ['',Validators.required],
  		desc: ['', Validators.required]
  	})
  }

  changeStatus(status: string) {
  	this.statusBis = status;
    this.crmData.updateOp(this.op.$key, {status: status})
    .then( () => console.log('status actualizado'));
  }

  changeCloseMonth(closeMonth: string) {
    this.crmData.updateOp(this.op.$key, {closeMonth: closeMonth})
    .then( () => console.log('closeMonth actualizado'));
  }

  changeCheck(agendaKey, check) {
  	console.log(check);
  	this.crmData.updateAgendaItem(agendaKey, { complete: check})
  	.then( () => console.log('check actualizado'));
  }

  submit() {
  	let form = this.agendaForm.value;
		form['opKey'] = this.op.$key;
		form['clientKey'] = this.op.clientKey;
		form['complete'] = false;
		this.crmData.newAgendaNote(form)
		.then( ret =>  {
	  	this.agendaForm.reset();			
		})
  }

}
