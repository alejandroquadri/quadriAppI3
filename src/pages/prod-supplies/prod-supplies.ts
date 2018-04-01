import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as moment from 'moment';

import { StaticDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-supplies',
  templateUrl: 'prod-supplies.html',
})
export class ProdSuppliesPage {

sForm: any;
today = moment();

@ViewChild("dateInput") dateInput;
@ViewChild("machInput") machInput: ElementRef;
@ViewChild("cabInput") cabInput: ElementRef;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public fb: FormBuilder,
    public staticData: StaticDataProvider,
    public renderer: Renderer
  ) {
    this.buildForm();
  }

  ionViewDidLoad() {
    this.focus(this.machInput);
  }

  buildForm() {
    this.sForm = this.fb.group({
      date: ['', Validators.required],
      machine: ['', Validators.required],
      cab: ['', Validators.required],
      brick: ['', Validators.required]
    });
    this.setFormToday();
  }
  
  setFormToday() {
    this.sForm.patchValue({
      date: this.today.format('YYYY-MM-DD')
    });
  }

  onSubmit() {
    console.log(this.sForm.values)
    if (this.sForm.value.machine === 'Breton' || this.sForm.value.machine === 'Lineal') {
      this.sForm.patchValue({
        cab: '',
        brick: ''
      });
      this.focus(this.cabInput);
    }
  }

  clear() {
    this.sForm.reset();
    this.setFormToday();
    this.focus(this.machInput);
  }

  focus(variable){
    setTimeout(() => {
      console.log(this.machInput);
    	this.renderer.invokeElementMethod(variable.nativeElement,'focus'); 
    },150);
  }
}
