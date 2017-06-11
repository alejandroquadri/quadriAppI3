import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';

import { MachineLogDataProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-machine-log',
  templateUrl: 'machine-log.html',
})
export class MachineLogPage {

	machineForm: FormGroup;
	machineLogs: any;
	submitType: string = 'new';
	updateKey:  string;
	searchInput: string = '';
	showForm: boolean = true;
	showData: boolean = false;

	// esto es lo del datepicker component para safari. No esta implementado
	private myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public platform: Platform,
  	public popoverCtrl: PopoverController,
  	private machineLogData: MachineLogDataProvider,
  	private fb: FormBuilder,
	) {
  	this.buildForm();
  	this.machineLogs = this.machineLogData.machineLogs;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MachineLogPage');
  }

  buildForm() {
    this.machineForm = this.fb.group({
      date: ['', Validators.required ],
      title: ['', Validators.required],
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
  	if (this.submitType === 'new') {
  		this.pushNew();
  	} else {
  		this.update();
  	}
  }

  pushNew() {
  	let form = this.machineForm.value;
  	form['timestamp'] = moment().format();
  	this.machineLogData.pushMachineLog(form)
  	.then( ret => {
  		this.machineForm.reset();
  	})
  }

  deleteLog(key) {
  	this.machineLogData.deleteLog(key);
  }

  update() {
  	let form = this.machineForm.value;
  	this.machineLogData.updateLog(this.updateKey, form)
  	.then( ret => {
  		this.submitType = 'new';
  		this.machineForm.reset();
  	})
  }

  editLog(log) {
  	console.log(log);
  	this.submitType = 'edit'
  	this.showForm = true;
  	let form = {
  		date: log.date,
      title: log.title,
      orderNumber: log.orderNumber,
      description: log.description
  	}
  	this.updateKey = log.$key;
  	this.machineForm.patchValue(form);
  }

  presentOptions(myEvent) {
    let popover = this.popoverCtrl.create('OptionsPage',{
    	form: this.showForm,
			data: this.showData
    });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss( (data) => {
    	console.log('cerrado popover', data);
    	this.showForm = data.form;
    	this.showData = data.data;
    })
  }

}
