import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { CrmDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-client-add',
  templateUrl: 'client-add.html',
})
export class ClientAddPage {

	clientForm

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private fb: FormBuilder,
    public viewCtrl: ViewController,
    private crmData: CrmDataProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientAddPage');
  }

  buildForm(form?) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required ],
      razSoc: ['', Validators.required],
    });
  }

}