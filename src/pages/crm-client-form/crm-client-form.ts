import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { CrmDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-client-form',
  templateUrl: 'crm-client-form.html',
})
export class CrmClientFormPage {

	clientKey: string;
	mode: string;
	editForm = false;

	clientForm: FormGroup;

	clientSubs: any;
	clientObj: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private crmData: CrmDataProvider,
  	public viewCtrl: ViewController,
  	private fb: FormBuilder,
  	) {
  	this.clientKey = this.navParams.data.$key;
  	this.mode = this.navParams.data.mode;
		this.buildForm();
  }

  ionViewDidLoad() {
    this.clientSubs = this.crmData.getClient(this.clientKey).subscribe( client => {
    	this.clientObj = client;
			console.log(this.clientObj);
    })
  }

  buildForm() {
  	this.clientForm = this.fb.group({
  		name: ['', Validators.required],
  		tel: [''],
  		mail: [''],
  		pos: [''],
  		obs: ['']
  	});
  }

}
