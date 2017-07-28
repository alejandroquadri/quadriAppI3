import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';
import * as firebase from 'firebase';
// import * as moment from 'moment';

import { MachineLogDataProvider, AuthDataProvider, StaticDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-machine-log-form',
  templateUrl: 'machine-log-form.html',
})
export class MachineLogFormPage {

	machineForm: FormGroup;
	submitType: string = 'new';
	updateForm: any;

  constructor(
  	private fb: FormBuilder,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private machineLogData: MachineLogDataProvider,
    private authData: AuthDataProvider,
    private staticData: StaticDataProvider
    ) 
  {
  	this.buildForm();
  }

  ionViewDidLoad() {
    if (this.navParams.data.date) {
      this.updateForm = this.navParams.data;
      this.edit()
    }
  }

  buildForm() {
  	this.machineForm = this.fb.group({
      date: ['', Validators.required ],
      title: ['', Validators.required],
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  edit() {
    console.log(this.updateForm);
  	this.submitType = 'edit';
 
  	this.machineForm.patchValue({
      date: this.updateForm.date,
      title: this.updateForm.title,
      orderNumber: this.updateForm.orderNumber,
      description: this.updateForm.description,
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
  	form['timestamp'] = firebase.database.ServerValue.TIMESTAMP;
  	form['user'] = {
      displayName: this.authData.current.displayName,
      uid: this.authData.current.uid
    }
  	this.machineLogData.pushMachineLog(form)
  	.then( ret => {
  		this.machineForm.reset();
  	})
  }

   update() {
  	let form = this.machineForm.value;
  	this.machineLogData.updateLog(this.updateForm.$key, form)
  	.then( ret => {
  		this.viewCtrl.dismiss();
  	})
  }

}
