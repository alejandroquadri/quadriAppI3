import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { CrmDataProvider, StaticDataProvider } from '../../providers';
import { CustomCurrencyPipe } from '../../pipes';

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
  salesReps: any;
	agendaForm: FormGroup;
	edit = false;
	editAgendaKey: string;
	totalValue;
	opName;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
		private crmData: CrmDataProvider,
		private staticData: StaticDataProvider,
  	private fb: FormBuilder,
		public modalCtrl: ModalController,
		public viewCtrl: ViewController,
		private customCurrencyPipe: CustomCurrencyPipe
  ) {
  	this.months = this.crmData.buildCloseMonth();
  	this.statusOptions = this.staticData.data.crm.statusOptions;
  	this.actions = this.staticData.data.crm.actions;
    this.salesReps = this.staticData.data.crm.salesReps;
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
    		this.op['$key'] = this.opKey;
				// this.totalValue = this.op.total;
				this.totalValue = this.customCurrencyPipe.transform(this.op.total.toString(), 0);		
				this.opName = this.op.obra;
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

  change(field: string, value: any) {
		value === 'Tarruella Alberto Horacio'? value = 'Tarruella Alberto Horacio ': '';
		// field === 'total' ? value = Number(value) : '' ;
    field === 'total' ? value = Number( this.customCurrencyPipe.parse(value,0) ) : '' ;
    let form = {};
    form[field] = value;
    this.crmData.updateOp(this.op.$key, form)
    .then( () => console.log(`${field} actualizado`));
  }

  changeCheck(agendaKey, check) {
  	console.log(check);
  	this.crmData.updateAgendaItem(agendaKey, { complete: check})
  	.then( () => console.log('check actualizado'));
  }

  submit() {
  	if (!this.edit) {
  		this.newAgendaItem();
  	} else {
  		this.editAgendaItem()
  	}
  }

  newAgendaItem() {
  	let form = this.agendaForm.value;
		form['opKey'] = this.op.$key;
    form['op'] = this.op.obra;
		form['clientKey'] = this.op.clientKey;
    form['client'] = this.op.client;
		form['complete'] = false;
		form['salesRep'] = this.op.salesRep;

		this.crmData.newAgendaNote(form)
		.then( ret =>  {
	  	this.agendaForm.reset();			
		})
  }

  switchEditAgendaItem(agendaItem, key) {
  	console.log(agendaItem, key);
  	this.editAgendaKey = key;
  	this.agendaForm.patchValue( {
  		time: agendaItem.time,
  		action: agendaItem.action,
  		desc: agendaItem.desc
  	})
  	this.edit = true;
  }

  switchToNew() {
  	this.edit = false;
  	this.editAgendaKey = undefined;
  	this.agendaForm.reset();
  }

  editAgendaItem() {
  	let updateForm = {
  		time: this.agendaForm.value.time,
  		desc: this.agendaForm.value.desc,
  		action: this.agendaForm.value.action
  	};
  	this.crmData.updateAgendaItem(this.editAgendaKey, updateForm)
  	.then( () => console.log('updated'));
  }

  deleteAgendaItem(agendaKey) {
  	this.crmData.delteAgendaItem(agendaKey, this.op.$key);
  }

  seeClient(key: string) {
    let profileModal = this.modalCtrl.create('CrmClientFormPage', {$key: key, mode: 'edit'});
    profileModal.present();
	}

	changeClient(op) {
		let profileModal = this.modalCtrl.create('ClientSelectPage', {pablo:'pelotudo'});
    profileModal.onDidDismiss(data => {
      if (data) {
        if (data.payload) {
					let client = data.payload.val();
					this.crmData.changeClient(client.name, op.clientKey, op.$key, data.key);
        } else {
					this.crmData.changeClient(data, op.clientKey, op.$key);
        }
      }
    })
    profileModal.present();
	}
	
	deletePsp(psp) {
		console.log(psp, this.opKey);
		this.crmData.removePspOp(psp, this.opKey);
	}

	onAmountChange(event) {
    let parsed = this.customCurrencyPipe.parse(event,0);
    this.totalValue = this.customCurrencyPipe.transform(parsed, 0);
	}
	
	sendPsp(psp) {
		console.log(this.calipsoObj[psp]);
		let opForm = this.agendaForm.value;
		opForm['opKey'] = this.op.$key;
    opForm['op'] = this.op.obra;
		opForm['clientKey'] = this.op.clientKey;
    opForm['client'] = this.op.client;
		opForm['complete'] = false;
		opForm['salesRep'] = this.op.salesRep;


		let pspForm = this.calipsoObj[psp];
		let profileModal = this.modalCtrl.create('CrmSendPspPage', {'psp':pspForm, 'op':opForm});
    profileModal.onDidDismiss( data => {
      data === 'dismiss' ? this.viewCtrl.dismiss() : '' ;
    });
    profileModal.present();
	}


}
