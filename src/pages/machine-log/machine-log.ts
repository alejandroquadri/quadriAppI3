import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import * as moment from 'moment';
// import {IMyDpOptions} from 'mydatepicker';

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

  @ViewChild('form', { read: ElementRef }) form: ElementRef;
  @ViewChild('dataHeaders', { read: ElementRef }) dataHeaders: ElementRef;
  @ViewChild('data', { read: ElementRef }) data: ElementRef;

	// esto es lo del datepicker component para safari. No esta implementado
	// private myDatePickerOptions: IMyDpOptions = {
 //    // other options...
 //    dateFormat: 'dd.mm.yyyy',
 //  };

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
    this.getSettings();
  }

  buildForm() {
    this.machineForm = this.fb.group({
      date: ['', Validators.required ],
      title: ['', Validators.required],
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

   getSettings() {
    this.machineLogData.getSettings().subscribe( settings => {
      console.log(settings)
      if (settings.$value) {
        console.log('no hay settings');
      } else {
        if (!this.platform.is('mobile')){
          console.log('no es mobile', settings.form, settings.data);
          this.form.nativeElement.hidden = !settings.form;
          this.dataHeaders.nativeElement.hidden = !settings.data;
          this.data.nativeElement.hidden = !settings.data;
        }
      }
    })
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
  	this.form.nativeElement.hidden = false;
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
    // this.optionsEnabled = false
    let popover = this.popoverCtrl.create('OptionsPage',{
      form: this.form.nativeElement,
      data: this.data.nativeElement,
      dataHeaders: this.dataHeaders.nativeElement
    });
    popover.present({
      ev: myEvent
    });
  }

  showForm() {
  	// en desktop, tiene que verse si el usuario quiere
  	// en mobile, tiene que verse si esta en portrait
  	if (this.platform.is('mobile')) {
  		if (this.platform.isPortrait()) {
  			return true;
  		} else {
  			return false;
  		}
  	} else { return true; }
  }

  showData() {
  	// en desktop, tiene que verse si el usuario quiere
  	// en mobile, tiene que verse si esta no esta en lanscape landscape
  	if (this.platform.is('mobile')) {
  		if (this.platform.isLandscape()) {
  			return true;
  		} else {
  			return false;
  		}
  	} else { return true; }
  }

  showSearchBar() {
    if (this.platform.is('mobile')) {
      if (this.platform.isLandscape()) {
        return true;
      } else {
        return false;
      }
    } else { 
      return this.data.nativeElement.hidden; 
    }
  }

}
