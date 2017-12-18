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
  opKey: string;

  updateOpForm: any;
  submitType: string;
  
  clientObs: any;
  clientObj: any;
  clientKey: string;
  updateClientForm: any;
  
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
  }

  ionViewDidLoad() {
    this.clientObs = this.crmData.getClientsObj();
    this.clientObs.subscribe( clients => {
      this.clientObj = clients;
    });
  }

  // construye el formulario
  buildForm(form?) {
    this.opForm = this.fb.group({
      obra: ['', Validators.required ],
      client: ['', Validators.required],
      salesRep: [form.salesRep || '', Validators.required],
      closeMonth: ['', Validators.required],
      total: [form.total || '', Validators.required],
    });
  }

  // para llamar a los modals
  lookClient() {
    let profileModal = this.modalCtrl.create('ClientSelectPage', {pablo:'pelotudo'});
    profileModal.onDidDismiss(data => {
      this.opForm.patchValue({
        client: data.payload.val().name
      });
      this.updateClientForm = data.payload.val();
      this.clientKey = data.key;
    })
    profileModal.present();
  }

  lookOp() {
    let profileModal = this.modalCtrl.create('OpSelectPage');
    profileModal.onDidDismiss(data => {
      this.opForm.patchValue({
        obra: data.op.obra,
        closeMonth: data.op.closeMonth,
        client: data.op.client
      });
      this.updateOpForm = data.op;
      this.clientKey = data.op.clientKey;
      this.opKey = data.key;
      this.updateClientForm = this.clientObj[this.clientKey];
    })
    profileModal.present();
  }

  addClient() {
    this.clientKey = undefined;
    this.updateClientForm = undefined
    this.opForm.patchValue({
        client: ''
    });
  }

  addOp() {
    this.opKey = undefined;
    this.opForm.patchValue({
        obra: '',
        closeMonth: '',
        client: ''
      });
  }

  // construye los meses del select
  buildMonths() {
    this.months = [];
    for (let i = 0; i < 24; i++) {
      let today =  moment();
      let item = today.add(i, 'month').format('MM-YYYY');
      this.months.push(item);
    }
  }

  onSubmit() {
    this.saveNewOPPsp();  
  }

  saveNewOPPsp() {
    let opForm
    let clientForm;
    let psp = {};
    let razSoc
    psp[this.pspData.num] = true;

    if(!this.opKey) {
      opForm = this.opForm.value;
      opForm['psps'] = {};
      opForm['satus'] = 'pendiente';
    } else {
      opForm = this.updateOpForm;
      if (opForm.total !== this.opForm.value.total) {
        opForm.total = this.opForm.value.total;
      }
    }
    opForm['psps'][this.pspData.num] = true;

    if (!this.clientKey) {
      clientForm = {
        name: this.opForm.value.client,
        razSoc: [],
        ops: {},
        contacts: {}
      }
      clientForm['razSoc'].push(this.pspData.razSoc);
      razSoc = this.pspData.razSoc;
    } else {
      clientForm = this.updateClientForm;
      if (clientForm['razSoc'].indexOf(this.pspData.razSoc)===(-1)) {
        clientForm['razSoc'].push(this.pspData.razSoc);
        razSoc = this.pspData.razSoc
      }
    }
    this.crmData.saveNewOp(opForm, clientForm, psp, razSoc, this.opKey, this.clientKey)
    .then( () => this.viewCtrl.dismiss());
  }

}
