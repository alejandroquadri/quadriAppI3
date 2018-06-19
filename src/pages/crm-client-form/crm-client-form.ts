import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { CrmDataProvider, StaticDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-client-form',
  templateUrl: 'crm-client-form.html',
})
export class CrmClientFormPage {

	clientKey: string;
	mode: string;
	editForm = false;
	editContactKey: string;
	salesRep: string;
	clientType: string;
	salesReps: any;
	clientTypes: any;
	clientName: any;

	clientForm: FormGroup;

	clientSubs: any;
	clientObj: any;
	contactSubs: any;
	contactObj: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
		private crmData: CrmDataProvider,
		private staticData: StaticDataProvider,
  	public viewCtrl: ViewController,
  	private fb: FormBuilder,
  	) {
  	this.clientKey = this.navParams.data.$key;
		this.mode = this.navParams.data.mode;
		this.salesReps = this.staticData.data.crm.salesReps;
		this.clientTypes = this.staticData.data.crm.clientTypes;
		this.buildForm();
  }

  ionViewDidLoad() {
		this.clientSubs = this.crmData.getClient(this.clientKey)
		this.contactSubs = this.crmData.getContactObj();
		
		Observable.combineLatest(this.clientSubs, this.contactSubs, (client: any, contacts: any) => ({client, contacts}))
		.subscribe( pair => {
			this.clientObj = pair.client;
			this.salesRep = this.clientObj.salesRep;
			this.clientType = this.clientObj.clientType;
			this.contactObj = pair.contacts;
			this.clientName = this.clientObj.name;
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
	
	change(field: string, value: string) {
		value === 'Tarruella Alberto Horacio'? value = 'Tarruella Alberto Horacio ': '';
    let form = {};
    form[field] = value;
    this.crmData.updateClient(this.clientKey, form)
    .then( () => console.log(`${field} actualizado`));
	}

	submit() {
  	if (!this.editForm) {
  		this.newContact();
  	} else {
  		this.editContact()
  	}
	}

	newContact() {
		let form = this.clientForm.value;
		form['clientKey'] = this.clientKey;
		this.crmData.newContact(form).then( _ => {
			this.clientForm.reset();
		})
	}

	switchEditContact(contact, contactKey) {
  	this.clientForm.patchValue( {
  		name: contact.name,
  		tel: contact.tel,
  		mail: contact.mail,
  		pos: contact.pos,
  		obs: contact.obs
  	})
		this.editForm = true;
		this.editContactKey = contactKey;
	}

	switchToNew() {
		this.editForm = false;
		this.editContactKey = undefined;
		this.clientForm.reset();
	}

	editContact() {
		console.log(this.editContactKey, this.clientForm);
		this.crmData.updateContact(this.editContactKey, this.clientForm.value)
		.then( _ => console.log('contact updated'));
	}

	deleteContact(contactKey) {
		this.crmData.deleteContact(contactKey, this.clientKey)
		.then( _ => console.log('contact deleted'));
	}

	editName(newName) {
		this.crmData.editClientName(newName, this.clientObj, this.clientKey);
	}
	


}
