import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';
import * as moment from 'moment';

import { FinanceDataProvider } from '../../providers';
import { avionStatic } from '../../assets/static-data/avion-static';


@IonicPage()
@Component({
  selector: 'page-avion-form',
  templateUrl: 'avion-form.html',
})
export class AvionFormPage {

  avionForm: FormGroup;
  submitType: string = 'new';
  updateForm: any;
  today = moment();
  data: any;
  showSalesForm = false;

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private fData: FinanceDataProvider
  ) {
    this.data = avionStatic
    this.buildForm();
  }

  ionViewDidLoad() {
    if (this.navParams.data.date) {
      this.updateForm = this.navParams.data;
      this.edit()
    }
  }

  buildForm(type?: string) {
    this.avionForm = this.fb.group({
      date: [this.today.format('YYYY-MM-DD'), Validators.required],
      type: [type || '', Validators.required],
      amount: ['', Validators.required],
      account: ['', Validators.required],
      obs: [''],
    })
  }
  
  buildFormSales(type?: string) {
    this.avionForm = this.fb.group({
      date: [this.today.format('YYYY-MM-DD'), Validators.required],
      type: [type || '', Validators.required],
      amount: ['', Validators.required],
      account: ['', Validators.required],
      obs: [''],
      np: ['', Validators.required],
      salesRep: ['', Validators.required],
      client: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.submitType === 'new') {
      this.pushNew();
    } else {
      this.update();
    }
  }

  pushNew() {
    this.fData.pushRecord(this.avionForm.value);
    this.avionForm.reset();
  }

  update() {
    this.fData.updateRecord(this.avionForm.value, this.updateForm.$key)
    .then( () => this.viewCtrl.dismiss()); 
  }
  
  typeChange() {
    if (this.avionForm.value.type === 'Ingreso') {
      this.buildFormSales('Ingreso');
      this.showSalesForm = true;
    } else {
      this.showSalesForm = false;
      this.buildForm('Egreso');
    }
  }

  edit() {
    this.submitType = 'edit';

    if (this.updateForm.type === 'Ingreso') {
      this.buildFormSales('Ingreso');
      this.showSalesForm = true;
    }

    this.avionForm.patchValue({
      date: this.updateForm.date,
      type: this.updateForm.type,
      amount: this.updateForm.amount,
      account: this.updateForm.account,
      obs: this.updateForm.obs,
    })
    
    if(this.updateForm.type === 'Ingreso') {
      this.avionForm.patchValue({
        np: this.updateForm.np,
        salesRep: this.updateForm.salesRep,
        client: this.updateForm.client
      })
    }
  }

  toNew() {
    this.submitType = 'new';
    this.avionForm.reset();
  }

}
