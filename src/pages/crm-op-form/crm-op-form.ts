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

  salesReps = ['Alejandra Roldan', 'Tarruella Alberto Horacio '];
  addPsp: boolean;
  addNew: boolean;
  edit: boolean;

  opForm: any;
  opKey: string;

  updateOpForm: any;
  // submitType: string;
  
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
    if (this.navParams.data.state === 'addNew') {
      this.addNew = true;
      this.edit = false;
      this.addPsp = false;
    } else if (this.navParams.data.state === 'edit') {
      this.addNew = false;
      this.edit = true;
      this.addPsp = false;
    } else {
      this.pspData = this.navParams.data;
      this.addNew = false;
      this.edit = false;
      this.addPsp = true;
    }
    this.buildForm(this.pspData);
    this.months = this.crmData.buildCloseMonth();
    // this.buildMonths();
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
      salesRep: ['', Validators.required],
      closeMonth: ['', Validators.required],
      total: ['', Validators.required],
    });
    if(this.addPsp) {
      this.opForm.patchValue({
        salesRep: form.salesRep,
        total: form.total
      })
    }
  }

  // para llamar a los modals
  lookClient() {
    let profileModal = this.modalCtrl.create('ClientSelectPage', {pablo:'pelotudo'});
    profileModal.onDidDismiss(data => {
      this.opForm.patchValue({
        obra: '',
        closeMonth: '',
        client: data.payload.val().name
      });
      this.updateClientForm = data.payload.val();
      this.clientKey = data.key;
      this.opKey = undefined;
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
    this.opKey = undefined;
    this.updateClientForm = undefined
    this.opForm.patchValue({
        obra: '',
        closeMonth: '',
        client: ''
    });
  }

  addOp() {
    this.opKey = undefined;
    this.clientKey = undefined;
    this.opForm.patchValue({
        obra: '',
        closeMonth: '',
        client: ''
      });
  }

  // construye los meses del select
  // buildMonths() {
  //   this.months = [];
  //   for (let i = 0; i < 24; i++) {
  //     let today =  moment();
  //     let item = today.add(i, 'month').format('YYYY-MM');
  //     this.months.push(item);
  //   }
  // }

  onSubmit() {
    this.saveNewOPPsp();  
  }

  saveNewOPPsp() {
    let opForm
    let clientForm;
    let psp = {};
    let razSoc
    this.addPsp? psp[this.pspData.num] = true: psp = undefined;

    if(!this.opKey) {
      console.log('viene por aca');
      opForm = this.opForm.value;
      opForm.total = Number(this.opForm.value.total);
      this.opForm.value.salesRep === 'Tarruella Alberto Horacio'? opForm.salesRep = 'Tarruella Alberto Horacio ': '';
      opForm['psps'] = {};
      opForm['status'] = 'Pendiente';
    } else {
      opForm = this.updateOpForm;
      if (opForm.total !== Number(this.opForm.value.total)) {
        opForm.total = Number(this.opForm.value.total);
      }
    }
    this.addPsp? opForm['psps'][this.pspData.num] = true: '';

    if (!this.clientKey) {
      clientForm = {
        name: this.opForm.value.client,
        ops: {},
        contacts: {}
      }
      if (this.addPsp) {
        clientForm['razSoc'] = [];
        clientForm['razSoc'].push(this.pspData.razSoc);
        razSoc = this.pspData.razSoc;
      }
    } else {
      clientForm = this.updateClientForm;
      if( this.addPsp ) {
        if (clientForm['razSoc'].indexOf(this.pspData.razSoc)===(-1)) {
          clientForm['razSoc'].push(this.pspData.razSoc);
          razSoc = this.pspData.razSoc;
        }
      }
    }
    this.crmData.saveNewOp(opForm, clientForm, psp, razSoc, this.opKey, this.clientKey)
    .then( () => this.viewCtrl.dismiss());
  }



}
