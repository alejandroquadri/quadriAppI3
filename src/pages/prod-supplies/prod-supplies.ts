import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as moment from 'moment';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';

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
    public renderer: Renderer,
    private prodData: ProductionDataProvider
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
      cab: [''],
      brick: [''],
      obs: ['']
    });
    this.setFormToday();
  }
  
  setFormToday() {
    this.sForm.patchValue({
      date: this.today.format('YYYY-MM-DD')
    });
  }

  onSubmit() {
    let form = this.sForm.value;
    let keys = Object.keys(form);
    keys.forEach(key => {
      if (form[key] === '') {
        delete form[key];
      }
    });
    this.prodData.pushSupply(form);
    this.clearPartial(this.sForm.value.machine);
  }

  clear() {
    this.sForm.reset();
    this.focus(this.machInput);
    this.setFormToday();
  }

  clearPartial(machine: string) {
    switch (machine) {
      case 'Breton':
        this.sForm.controls.cab.reset();
        this.sForm.controls.brick.reset();
        this.sForm.controls.obs.reset();
        this.focus(this.cabInput);
      break;
    
      case 'Lineal':
        this.sForm.controls.cab.reset();
        this.sForm.controls.brick.reset();
        this.sForm.controls.obs.reset();
        this.focus(this.cabInput);
      break;

      default:
        this.clear();
        break;
    }
  }

  focus(variable){
    setTimeout(() => {
    	this.renderer.invokeElementMethod(variable.nativeElement,'focus'); 
    },150);
  }
}
