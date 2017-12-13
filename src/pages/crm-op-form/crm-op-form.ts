import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import * as moment from 'moment';

import { CrmDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-op-form',
  templateUrl: 'crm-op-form.html',
})
export class CrmOpFormPage {

  opForm: any;
  submitType: string;
  newClient: boolean;
  months: any;
  pspData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private crmData: CrmDataProvider
  ) {
    this.pspData = this.navParams.data;
    this.buildForm(this.pspData);
    this.buildMonths();
    console.log(this.navParams.data);
  }

  ionViewDidLoad() {
  }

  buildForm(form?) {
    this.opForm = this.fb.group({
      obra: ['', Validators.required ],
      client: ['', Validators.required],
      salesRep: [form.salesRep || '', Validators.required],
      closeMonth: ['', Validators.required],
      total: [form.total || '', Validators.required],
    });
  }

  client() {
    let profileModal = this.modalCtrl.create('ClientSelectPage', {pablo:'pelotudo'});
    profileModal.onDidDismiss(data => {
      this.opForm.patchValue({
        client: data
      });
      console.log(this.opForm.value);
    })
    profileModal.present();
  }

  buildMonths() {
    this.months = [];
    for (let i = 0; i < 24; i++) {
      let today =  moment();
      let item = today.add(i, 'month').format('MM-YYYY');
      this.months.push(item);
    }
  }

  onSubmit() {
    if (this.submitType === 'new') {
      this.saveNewOPPsp();
    } else {
    }
  }

  saveNewOPPsp() {
    let form = this.opForm.value;
    form['psps'] = [this.pspData.num];
    let newOp = this.crmData.newOp(form);
    let checkedPsp = this.crmData.checkPsp(this.pspData.num);
    Promise.all([newOp, checkedPsp]).then( (ret) => {
      this.viewCtrl.dismiss();
    });
  }

  addClient() {
    this.newClient = true;
  }

  addOp() {
    this.submitType = 'new';
  }

  lookOp() {
    let profileModal = this.modalCtrl.create('OpSelectPage');
    profileModal.onDidDismiss(data => {
      this.opForm.patchValue({
        obra: data
      });
      console.log(this.opForm.value);
    })
    profileModal.present();
  }

}
