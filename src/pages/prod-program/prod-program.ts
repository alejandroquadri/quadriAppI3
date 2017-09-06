import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { SplitShowProvider, ProdProgramDataProvider, StaticDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-program',
  templateUrl: 'prod-program.html',
})
export class ProdProgramPage {

	data: any;
	colors = [];
	dims = [];
	drawings = [];
	units = [
		'm2',
		'ml',
		'unidad',
		'bolsa',
	]

	selected: any = moment();
	weekDays: Array <any>;
	weeks: Array <any>;
	showEntregas = false;
	showForm = false;

	programSubs: any
	program: any;

	public myForm: FormGroup;

  constructor(
  	private _fb: FormBuilder,
  	private splitShow: SplitShowProvider,
  	private programData: ProdProgramDataProvider,
  	private staticData: StaticDataProvider,
  ) {
  	this.data = this.staticData;
  	this.buildForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdProgramPage');
    this.buildMonth();
    this.programSubs = this.programData.getProgram().subscribe( prog => {
    	this.program = prog;
    })
  }

  ionViewWillUnload() {
    console.log('desuscripcion program');
    this.programSubs.unsubscribe();
  }

  // formulario

  buildForm() {
  	this.myForm = this._fb.group({
    	date: ['', Validators.required],
    	machine: ['', Validators.required],
    	color: ['', Validators.required],
    	dim: ['', Validators.required],
    	drawing: ['', Validators.required],
    	quantity: [''],
    	unit: [''],
    	obs: ['']
    });
  }

  submit() {
  	console.log(this.myForm.value);
  }

  hideShowForm() {
  	this.buildForm();
  	this.showForm = !this.showForm;
  }

  // calendario

  next() {
    this.selected.month(this.selected.month()+1);
    this.buildMonth()
  };

  previous() {
    this.selected.month(this.selected.month()-1);
    this.buildMonth()
  };

  private removeTime(date){
      return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  private buildWeek(start) {
    let weekDays = [];
    let date = start.clone();
    for (var i = 0; i < 7; i++) {
      weekDays.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }

    this.weekDays = weekDays;
    return weekDays;
  }

  private buildMonth() {
		let start = this.selected.clone();
		start.date(1).day(0); 
		// con date(1) voy a la primer fecha del mes, con day(0) voy al primer dia de la semana
    this.weeks = [];
    let done = false;
    let date = start.clone();
    let monthIndex = date.month();
    let count = 0;
    while (!done) {
      this.weeks.push({ days: this.buildWeek(date.clone()) });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  machClass(mach) {
  	let res;
  	switch (mach) {
  		case "995":
  		case "650":
  			res = 'prensa';
  			break;

  		case "Breton":
  		case "Lineal":
  			res = 'pulidora';
  			break;
  		
  		default:
  			res = 'otro';
  			break;
  	}
  	return res;
  }

  machChange(mach) {
  	console.log(mach);
    if (mach === 'Pastinas') {
      this.colors = this.data.colorProductos['pastinas'];
			this.dims = this.data.dimProductos['pastinas'];
			this.drawings = ['pastina'];
    } else {
      this.colors = this.data.colorProductos['mosaicos'];
			this.dims = this.data.dimProductos['mosaicos'];
			this.drawings = this.data.drawing;
    }
  }

}
