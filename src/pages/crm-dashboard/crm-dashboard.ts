import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { CrmDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-dashboard',
  templateUrl: 'crm-dashboard.html',
})
export class CrmDashboardPage {

  agendaObs: any;
  agendaList: any;
  agendaObj: any
  date: string = moment().format('YYYY-MM-DD');

  salesMan = '';
  currentSalesMan: any;

  agendaForm: FormGroup;
  actions: any;
  edit = false;
  editAgendaKey: string;
  editAgenda: any;
  opName: string;
  opObject: any;
  showOp = true;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private crmData: CrmDataProvider,
    private fb: FormBuilder,
    public modalCtrl: ModalController
  ) {
    this.buildForm();
    this.agendaForm.patchValue({
      time: moment().format('YYYY-MM-DD')
    })
    this.actions = this.crmData.actions;
    this.currentSalesMan = this.crmData.currentSalesRep;
  }

  ionViewDidLoad() {
    this.agendaObs = this.crmData.getAgendaList().subscribe( agenda => {
      this.agendaList = agenda;
      // console.log(this.agendaList);
      this.buildAgendaObj();
    })
  }

  buildForm() {
  	this.agendaForm = this.fb.group( {
  		time: ['', Validators.required],
  		action: ['',Validators.required],
  		desc: ['', Validators.required]
  	});
  }

  buildAgendaObj() {
    let agendaObj = {};

    this.agendaList.forEach( agendaItem => {
      let item = agendaItem.payload.val();
      item['$key'] = agendaItem.key;
      
      if (!agendaObj[item.time]) {
        agendaObj[item.time] = [];
        agendaObj[item.time].push(item);
      } else {
        agendaObj[item.time].push(item);
      }
    })
    this.agendaObj = agendaObj;
    // console.log(this.agendaObj);
  }

  back() {
    this.date = moment(this.date).add(-1, 'days').format('YYYY-MM-DD');
    this.buildAgendaObj();
  }

  forward() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.buildAgendaObj();
  }

  changeCheck(agendaKey, check) {
    console.log(check);
    this.crmData.updateAgendaItem(agendaKey, { complete: check})
    .then( () => console.log('check actualizado'));
  }

  seeOp(key: string) {
    let op = {
      $key: key
    };
    this.navCtrl.push('CrmOpDetailPage', op);
  }

  submit() {
    console.log(this.agendaForm.value);
    if (!this.edit) {
  		this.newAgendaItem();
  	} else {
  		this.editAgendaItem()
  	}
  }

  lookOp(){
    let modal = this.modalCtrl.create('OpSelectPage', {from: 'activity'});
    modal.onDidDismiss( data => {
      if (data) {
        this.opName = data.op.obra;
        this.opObject = data.op;
        this.opObject['$key'] = data.key;
      }
    })
    modal.present();
  }

  addOp() {
    let modal = this.modalCtrl.create('CrmOpFormPage', {state:'addNew'});
    modal.onDidDismiss( data => {
      if (data) {
        this.opName = data.obra;
        this.opObject = data;
      }
    })
    modal.present();
  }

  newAgendaItem() {
    let form = this.agendaForm.value;

    if (this.opObject) {
      form['opKey'] = this.opObject.$key
      form['op'] = this.opObject.obra;
      form['clientKey'] = this.opObject.clientKey;
      form['client'] = this.opObject.client;
      form['complete'] = false;
      form['salesRep'] = this.opObject.salesRep;
    } else {
      form['salesRep'] = this.currentSalesMan || '';
    }

		this.crmData.newAgendaNote(form)
		.then( ret =>  {
      this.agendaForm.reset();
      this.opName = '';
      this.opObject = undefined;	
		})
  }

  editAgendaItem() {
    let updateForm = {
  		time: this.agendaForm.value.time,
  		desc: this.agendaForm.value.desc,
      action: this.agendaForm.value.action
    };
    if (this.opObject) {
      updateForm['op'] = this.opObject.obra;
      updateForm['opKey'] = this.opObject.$key;
    }

    // this.crmData.updateAgendaItem(this.editAgendaKey, updateForm)
    console.log(updateForm);
    this.crmData.editAgendaItem(updateForm, this.editAgendaKey)
  	.then( () => console.log('updated'));
  }

  deleteAgendaItem(agendaItem) {
    console.log(agendaItem);
    let opKey;
    agendaItem.opKey? opKey = agendaItem.opKey : opKey = undefined;
  	this.crmData.delteAgendaItem(agendaItem.$key, opKey);
  }

  switchEditAgendaItem(agendaItem,) {
  	console.log(agendaItem);
    this.editAgendaKey = agendaItem.$key;
    this.editAgenda = agendaItem;
    this.opName = '';
    this.opObject = undefined;	
  	this.agendaForm.patchValue( {
  		time: agendaItem.time,
  		action: agendaItem.action,
  		desc: agendaItem.desc
  	})
    this.edit = true;
    agendaItem.opKey? this.showOp = false : this.showOp = true;
  }

  switchToNew() {
    this.edit = false;
    this.showOp = true;
    this.editAgendaKey = undefined;
    this.editAgenda = undefined;
    this.opName = '';
    this.opObject = undefined;	
  	this.agendaForm.reset();
  }

}
