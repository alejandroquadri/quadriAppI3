import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { CrmDataProvider } from '../../providers';
import { CustomCurrencyPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-crm-op-form',
  templateUrl: 'crm-op-form.html',
})
export class CrmOpFormPage {

  salesReps: any;
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
  amount: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private crmData: CrmDataProvider,
    private customCurrencyPipe: CustomCurrencyPipe
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
    this.salesReps = this.crmData.salesReps;
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
      console.log(form.total, form.total.toString());
      this.onAmountChange(form.total.toString());
    }
  }

  // para llamar a los modals

  lookClient() {
    let profileModal = this.modalCtrl.create('ClientSelectPage', {pablo:'pelotudo'});
    profileModal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        if (data.payload) {
          this.opForm.patchValue({
            client: data.payload.val().name
          });
          this.updateClientForm = data.payload.val();
          this.clientKey = data.key;
        } else {
          this.opForm.patchValue({
            client: data
          });
          this.clientKey = undefined;
        }
        if (this.opKey) {
          this.opForm.patchValue({
            obra: '',
            closeMonth: '',
          });
          this.opKey = undefined;
        }
      }
    })
    profileModal.present();
  }

  lookOp() {
    let profileModal = this.modalCtrl.create('OpSelectPage');
    profileModal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        if (data.op) {
          console.log('viene por aca');
          this.opForm.patchValue({
            obra: data.op.obra,
            closeMonth: data.op.closeMonth,
            client: data.op.client
          });
          this.updateOpForm = data.op;
          this.clientKey = data.op.clientKey;
          this.opKey = data.key;
          this.updateClientForm = this.clientObj[this.clientKey];
        } else {
          this.opForm.patchValue({
            obra: data
          });
          this.opKey = undefined;
        }
      }
    })
    profileModal.present();
  }
  
  onSubmit() {
    this.saveNewOPPsp();  
  }

  onAmountChange(event) {
    let parsed = this.customCurrencyPipe.parse(event,0);
    this.amount = this.customCurrencyPipe.transform(parsed, 0);
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
      // opForm.total = Number(this.opForm.value.total);
      opForm.total = Number(this.customCurrencyPipe.parse(this.opForm.value.total,0));      
      this.opForm.value.salesRep === 'Tarruella Alberto Horacio'? opForm.salesRep = 'Tarruella Alberto Horacio ': '';
      opForm['psps'] = {};
      opForm['status'] = 'Pendiente';
    } else {
      opForm = this.updateOpForm;
      // if (opForm.total !== Number( this.opForm.value.total)) {
      //   opForm.total = Number(this.opForm.value.total);
      // }
      if ( opForm.total !== Number(this.customCurrencyPipe.parse(this.opForm.value.total, 0)) ) {
        opForm.total = Number(this.customCurrencyPipe.parse(this.opForm.value.total, 0));
      }
    }
    !opForm['psps'] ? opForm['psps'] = {} : '' ;
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
