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

	// variables para datos
	programSubs: any
	program: any;
	
	// calendario
	selected: any = moment();
	weekDays: Array <any>;
	weeks: Array <any>;

	// entregas
	showEntregas = false;

	// form
	showForm = false;
	editing = false;
	idEdit: string;
	artEdit: any;
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
  	return this.myForm = this._fb.group({
    	date: ['', Validators.required],
    	machine: ['', Validators.required],
    	color: ['', Validators.required],
    	dim: ['', Validators.required],
    	drawing: ['', Validators.required],
    	quantity: [''],
    	unit: [''],
    	obs: ['']
    })
  }

  submit() {
  	console.log(this.myForm.value);
  	this.editing ? this.update() : this.add(this.myForm.value) ;
  }

  edit(art, day, id, mach) {
  	console.log(art, mach);
  	this.idEdit = id;
  	this.artEdit = art;
  	this.artEdit['date'] = moment(day.date).format('YYYY-MM-DD');
  	this.artEdit['mach'] = mach;
  	this.machChange(mach).then( () => {
  		this.myForm.patchValue({
		  	date: moment(day.date).format('YYYY-MM-DD'),
		   	machine: mach,
	  	});
	  	console.log(art.color);
	  	setTimeout(() => {
        this.myForm.patchValue({
		     	color: art.color || '',
			    dim: art.dim || '',
			    drawing: art.drawing || '',
			    quantity: art.valor || '',
			    unit: art.unidad || '',
			    obs: art.observacion || ''
		  	});
      },150);
  	})
  	this.editing = true;
  	this.showForm = true;
  }

  newProgram(date?) {
  	this.editing = false;
  	this.showForm = true;
  	date ? this.myForm.patchValue({date: date.date.format('YYYY-MM-DD')}) : this.buildForm() ;
  }

  add(form: any) {
  	this.programData.addNew(form).then( () => {
			console.log('guardado');
		})
  }

  update() {
  	let diff = 'none';
  	if (this.artEdit.date !== this.myForm.value.date) {
  		diff = 'date';
  		this.myForm.value['oldDate'] = moment(this.artEdit.date).format('YYYYMMDD');
  	}  else if (this.artEdit.mach !== this.myForm.value.machine) { 
  		diff = 'mach';
  		this.myForm.value['oldMach'] = this.artEdit.mach
	  }
  	this.programData.update(this.myForm.value, this.idEdit, diff)
  	.then( () => {
  		console.log('editado');
  		this.buildForm();
  	})
  }

  remove() {
  	this.programData.remove(this.myForm.value, this.idEdit).then( () => {
  		console.log('borrado');
  		this.buildForm();
  	})
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
  	return new Promise((resolve, reject) => {
	    console.log(mach);
	    if (mach === 'Pastinas') {
	      this.colors = this.data.colorProductos['pastinas'];
				this.dims = this.data.dimProductos['pastinas'];
				this.drawings = ['pastina'];
				resolve(42);
	    } else {
	      this.colors = this.data.colorProductos['mosaicos'];
				this.dims = this.data.dimProductos['mosaicos'];
				this.drawings = this.data.drawing;
				resolve(42);
	    }
	  });
  	
  }

}
