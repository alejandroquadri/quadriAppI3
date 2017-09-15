import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';

import * as moment from 'moment';
import 'moment/locale/es';

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

	// entregas
	entregasSubs: any;
	entregas: any;
	items: any;
	weeksEntregas: any;

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
    this.weeksEntregas = this.buildNextWeeks();
    this.entregasSubs = this.programData.getEntregas()
  	.map( res => res.json())
  	.subscribe( data => {
  		let sumaSemanasObj = this.sumaSemana(data.data)
  		this.entregas = sumaSemanasObj.sem;
  		this.items = this.buildItemsArray(sumaSemanasObj.items);
  		console.log(this.entregas, this.items);
  	});
  }

  ionViewWillUnload() {
    console.log('desuscripcion program');
    this.programSubs.unsubscribe();
    this.entregasSubs.unsubscribe();
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
  	this.idEdit = id;
  	this.artEdit = art;
  	this.artEdit['date'] = moment(day.date).format('YYYY-MM-DD');
  	this.artEdit['mach'] = mach;
  	this.machChange(mach).then( () => {
  		this.myForm.patchValue({
		  	date: moment(day.date).format('YYYY-MM-DD'),
		   	machine: mach,
	  	});
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

  sumaSemana(datos){
    let titulos = datos[0];
    let artXSem = {};
    let items = {};

    for (let i = 1 ; i < datos.length ; i++ ) {
      for (let j = 7; j< datos[0].length ; j++ ) {
        let valor = datos[i][j];

        if (valor === "" || !valor) {continue;}
        valor = parseFloat(datos[i][j].replace(/,/g, '.'));
        if (valor >= 0) {continue;}
        let fechaString = titulos[j];

        let date = fechaString.substring(4, 6);
        let month = fechaString.substring(7, 9);
        let year = ("20"+fechaString.substring(10, 12))
        let fecha = moment(`${year}-${month}-${date}`);

        let codigo = datos[i][3];
        let semana = fecha.week()+""+fecha.year();
        // let semana = fecha.format('wwMM');
        if (!(codigo in artXSem)) {
          artXSem[codigo] = {};
          if (!(semana in artXSem[codigo])){
            artXSem[codigo][semana] = Math.abs(valor);
          } else { artXSem[codigo][semana] += Math.abs(valor);}
        } else  {
          if (!(semana in artXSem[codigo])){
            artXSem[codigo][semana] = Math.abs(valor);
          } else { artXSem[codigo][semana] += Math.abs(valor);}
        }
        if (items[codigo]) {
        	items[codigo] += Math.abs(valor);
        } else {
        	items[codigo] = Math.abs(valor);        	
        }
      }
    }
    return {
    	sem: artXSem,
    	items: items
    }
  }

  buildNextWeeks () {
  	let weeks = [];	
  	let today = moment();

  	for (let i=0; i < 4; i ++) {
  		let semana = today.week()+""+today.year();
  		weeks.push(semana);
  		today.add(1, 'w');
  	}

  	return weeks;
  }

  buildItemsArray(obj: any) {
  	let keys = Object.keys(obj); 
  	let itemsArray = [];

  	keys.forEach( item => {
  		itemsArray.push({
  			code: item,
  			total: obj[item]
  		});
  	})

  	return itemsArray;
  }

}
