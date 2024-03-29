import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/es';

import { ProdProgramDataProvider, StaticDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-program',
  templateUrl: 'prod-program.html',
})
export class ProdProgramPage {

	// variables para datos
	programSubs: any;
	npSubs: any;
	subsObs: any;
	program: any;
	npList: any;
	
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

	// entregas
	entregasSubs: any;
	entregas: any;
	items: any;
	weeksEntregas: any;
	scProgSubs: any

	public myForm: FormGroup;

  constructor(
  	private _fb: FormBuilder,
  	private programData: ProdProgramDataProvider,
  	private staticData: StaticDataProvider,
  ) {
  	this.data = this.staticData.data.produccion;
  	this.buildForm();
  }

  ionViewDidLoad() {
    this.buildMonth();
    this.programSubs = this.programData.getProgram().subscribe( prog => {
    	this.program = prog;
    })
		this.weeksEntregas = this.buildNextWeeks();

		this.npSubs = this.programData.getNPPendientes()
    .pipe(
      map( (res:any) => res.json())
		);
		
		this.scProgSubs = this.programData.getScProgram()
		this.subsObs = Observable.combineLatest(this.npSubs, this.scProgSubs, (np:any, scProg) => ({np, scProg}));
		this.subsObs.subscribe( pair => {
			this.npList = pair.np.data;
			this.sumaSemanaFb(pair.scProg);
		});

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
    this.buildForm()
  	date ? this.myForm.patchValue({date: date.date.format('YYYY-MM-DD')}) : '' ;
  }

  add(form: any) {
  	this.programData.addNew(form).then( () => {
		})
  }

  update() {
  	let diff = 'none';
    this.myForm.value['oldDate'] = moment(this.artEdit.date).format('YYYYMMDD');
    this.myForm.value['oldMach'] = this.artEdit.mach;
  	if (this.artEdit.date !== this.myForm.value.date) {
  		diff = 'date';
  	}  else if (this.artEdit.mach !== this.myForm.value.machine) { 
  		diff = 'mach';
	  }
  	this.programData.update(this.myForm.value, this.idEdit, diff)
  	.then( () => {
  		this.buildForm();
  	})
  }

  remove() {
  	this.programData.remove(this.myForm.value, this.idEdit).then( () => {
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

  // private removeTime(date){
  //     return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  // }

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
	
	sumaSemanaFb(scList: Array<any>) {
		let artXSem = {};
		let items = {};
		
		scList.forEach( scProg => {
			let sc = scProg.payload.val();
			// console.log(this.checkNp(`${sc.np}${sc.code}`));

			if(this.checkNp(`${sc.np}${sc.code}`)) {

				let date = moment(sc.date);
				let semana = date.format('wwYYYY')
				let valor = sc.quantity;
	
				if (valor < 0) {
					valor = Math.abs(valor)
					if(!artXSem[sc.code]) {
						artXSem[sc.code] = {};
						artXSem[sc.code][semana] = valor;
					} else {
						if (!artXSem[sc.code][semana]) {
							artXSem[sc.code][semana] = valor;
						} else {
							artXSem[sc.code][semana] += valor;
						}
					}
		
					if (items[sc.code]) {
						items[sc.code] += valor;
					} else {
						items[sc.code] = valor;        	
					}
				}
			
			}

		});

		this.entregas = artXSem;
		this.items = this.buildItemsArray(items);

	}

	checkNp (npCodigo: string) {
		// console.log(npCodigo);
		for(let i=0, len = this.npList.length; i<len; i++) {
			let valueNp = `${this.npList[i].np}${this.npList[i].codigo}`;
			// console.log(npCodigo, valueNp, npCodigo ===  valueNp);
			if (valueNp === npCodigo) {
				// console.log(valueNp, npCodigo);
				return true;
			}
		}


		// return this.npList.map( item => {
		// 	// console.log(npCodigo);
		// 	return `${item.np}${item.codigo}`;
		// }).indexOf(`npCodigo`) !== -1;
	}

  buildNextWeeks () {
  	let weeks = [];	
  	let today = moment();

  	for (let i=0; i < 4; i ++) {
  		let semana = today.format('wwYYYY');
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

// sumaSemana(datos){
// 	let titulos = datos[0];
// 	let artXSem = {};
// 	let items = {};

// 	for (let i = 1 ; i < datos.length ; i++ ) {
// 		for (let j = 7; j< datos[0].length ; j++ ) {
// 			let valor = datos[i][j];

// 			if (valor === "" || !valor) {continue;}
// 			valor = parseFloat(datos[i][j].replace(/,/g, '.'));
// 			if (valor >= 0) {continue;}
// 			let fechaString = titulos[j];

// 			let date = fechaString.substring(4, 6);
// 			let month = fechaString.substring(7, 9);
// 			let year = ("20"+fechaString.substring(10, 12))
// 			let fecha = moment(`${year}-${month}-${date}`);

// 			let codigo = datos[i][3];
// 			let semana = fecha.week()+""+fecha.year();
// 			// let semana = fecha.format('wwMM');
// 			if (!(codigo in artXSem)) {
// 				artXSem[codigo] = {};
// 				if (!(semana in artXSem[codigo])){
// 					artXSem[codigo][semana] = Math.abs(valor);
// 				} else { artXSem[codigo][semana] += Math.abs(valor);}
// 			} else  {
// 				if (!(semana in artXSem[codigo])){
// 					artXSem[codigo][semana] = Math.abs(valor);
// 				} else { artXSem[codigo][semana] += Math.abs(valor);}
// 			}
// 			if (items[codigo]) {
// 				items[codigo] += Math.abs(valor);
// 			} else {
// 				items[codigo] = Math.abs(valor);        	
// 			}
// 		}
// 	}
// 	return {
// 		sem: artXSem,
// 		items: items
// 	}
// }
