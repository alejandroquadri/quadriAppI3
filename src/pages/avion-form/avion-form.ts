import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';
import * as moment from 'moment';

import { FinanceDataProvider, StaticDataProvider } from '../../providers';
import { CustomCurrencyPipe } from '../../pipes';


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
  formChangeSubs: any;

  amount: any;

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private fData: FinanceDataProvider,
    private staticData: StaticDataProvider,
    public customCurrencyPipe: CustomCurrencyPipe
  ) {
    this.data = this.staticData.data.avion;
    this.buildForm();
  }

  ionViewDidLoad() {
    if (this.navParams.data.date) {
      this.updateForm = this.navParams.data;
      this.edit()
    }
  }

  buildForm(account?: string) {
    let type, obs, amount;
    // account? type = this.avionForm.value.type : type = '';

    if (account) {
      type = this.avionForm.value.type;
      obs = this.avionForm.value.obs;
      amount = this.avionForm.value.amount;
      account = this.avionForm.value.account;
    }

    this.avionForm = this.fb.group({
      date: [this.today.format('YYYY-MM-DD'), Validators.required],
      type: [type, Validators.required],
      amount: [amount || '', Validators.required],
      account: [account || '', Validators.required],
      obs: [obs || ''],
    })
  }

  onAmountChange(event) {
    let parsed = this.customCurrencyPipe.parse(event,0);
    this.amount = this.customCurrencyPipe.transform(parsed, 0);
  }
  
  buildFormSales(account?: string) {
    let type, obs, np, salesRep, client, amount;
    // account? type = this.avionForm.value.type : type = '';

    if (account) {
      type = this.avionForm.value.type;
      obs = this.avionForm.value.obs;
      np = this.avionForm.value.np;
      salesRep = this.avionForm.value.salesRep;
      client = this.avionForm.value.client;
      amount = this.avionForm.value.amount;
      account = this.avionForm.value.account;
    }

    this.avionForm = this.fb.group({
      date: [this.today.format('YYYY-MM-DD'), Validators.required],
      type: [type, Validators.required],
      amount: [amount || '', Validators.required],
      account: [account || '', Validators.required],
      obs: [obs || ''],
      np: [np || '', Validators.required],
      salesRep: [salesRep || '', Validators.required],
      client: [client || '', Validators.required]
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
    let form = this.avionForm.value;
    let parsedAmount = this.customCurrencyPipe.parse(this.avionForm.value.amount)
    form.amount = parsedAmount;
    this.fData.pushRecord(form)
    .then( () => {
      this.avionForm.reset();
      this.avionForm.patchValue({
        date: this.today.format('YYYY-MM-DD')
      });
    })
  }

  update() {
    let form = this.avionForm.value;
    let parsedAmount = this.customCurrencyPipe.parse(this.avionForm.value.amount)
    form.amount = parsedAmount;
    this.fData.updateRecord(form, this.updateForm.$key)
    .then( () => this.viewCtrl.dismiss()); 
  }
  
  accountChange() {
    let account = this.avionForm.value.account;
    if (account === 'Venta') {
      this.showSalesForm = true;
      this.buildFormSales(account);
    } else {
      this.showSalesForm = false;
      this.buildForm(account);
    }
  }

  typeChange() {
    if (this.avionForm.value.account !== '') {
      this.showSalesForm = false;
      this.buildForm(this.avionForm.value.account);
    }
  }

  edit() {
    this.submitType = 'edit';

    if (this.updateForm.account === 'Venta') {
      this.buildFormSales(this.updateForm.account);
      this.showSalesForm = true;
    }
    console.log(this.updateForm.account);
    this.avionForm.patchValue({
      date: this.updateForm.date,
      type: this.updateForm.type,
      amount: this.updateForm.amount,
      account: this.updateForm.account,
      obs: this.updateForm.obs,
    })

    this.avionForm.patchValue({
      account: this.updateForm.account
    })
    
    if(this.updateForm.account === 'Venta') {
      this.avionForm.patchValue({
        np: this.updateForm.np,
        salesRep: this.updateForm.salesRep,
        client: this.updateForm.client
      })
      this.onAmountChange(this.updateForm.amount);
    }
  }

  toNew() {
    this.submitType = 'new';
    this.avionForm.reset();
  }

  consoleLog(value) {
    console.log(value);
  }

}
