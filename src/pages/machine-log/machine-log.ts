import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ModalController } from 'ionic-angular';
import * as moment from 'moment';

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
	optionsEnabled: boolean = true;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public platform: Platform,
  	public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
  	private machineLogData: MachineLogDataProvider,
  	private fb: FormBuilder,
	) {
  }

  ionViewDidLoad() {
    this.machineLogs = this.machineLogData.machineLogsObs
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

  toNew() {
  	this.submitType = 'new';
  	this.machineForm.reset();
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
  	let form = {
  		date: log.date,
      title: log.title,
      orderNumber: log.orderNumber,
      description: log.description
  	}
  	this.updateKey = log.$key;
  	this.machineForm.patchValue(form);
  }

  presentModal(form?: any) {
     let profileModal = this.modalCtrl.create('MachineLogFormPage', form);
     profileModal.present();
  }

  onChange(event) {
    this.machineLogData.searchInput = event;
    this.machineLogData.filter();
  }


}
