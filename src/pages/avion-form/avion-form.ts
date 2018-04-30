import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';
import * as moment from 'moment';

import { FinanceDataProvider } from '../../providers';
import { avionStatic } from '../../assets/static-data/avion-static';
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
    public customCurrencyPipe: CustomCurrencyPipe
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

  onAmountChange(event) {
    let parsed = this.customCurrencyPipe.parse(event,0);
    this.amount = this.customCurrencyPipe.transform(parsed, 0);
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
