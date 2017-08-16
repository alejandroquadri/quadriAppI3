import { Component, ViewChild, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, Platform} from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-partes-form',
  templateUrl: 'partes-form.html',
})
export class PartesFormPage implements OnInit {

  public myForm: FormGroup;
  @ViewChild("dateInput") dateInput;
  updateForm: any
  editBtn = false;
  data: any

  constructor(
  	private _fb: FormBuilder,
    public navCtrl: NavController,
  	public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private prodData: ProductionDataProvider,
    private staticData: StaticDataProvider
  ) { 
    this.data = this.staticData;
  }

	ionViewDidLoad() {
    if (this.navParams.data.date) {
      this.editBtn = true;
      this.updateForm = this.navParams.data;
      console.log(this.updateForm);
      this.buildEdit();
    }
		this.focusDate();
	}

  ngOnInit() {
    this.buildForm(); 
  }

  buildForm() {
  	this.myForm = this._fb.group({
    	date: ['', Validators.required],
    	machine: ['',Validators.required],
    	color: ['',Validators.required],
    	dim: ['',Validators.required],
    	drawing: ['',Validators.required],
    	mod: ['',Validators.required],
    	start: ['',Validators.required],
    	end: ['',Validators.required],
    	prod: ['',Validators.required],
    	seg: ['',],
    	rep: ['',],
    	broken: ['',],
    	observaciones: [''],
    	stops: this._fb.array([]),
    });
  }

  buildEdit() {
    this.myForm.patchValue({
      date: this.updateForm.date,
      machine: this.updateForm.machine,
      color: this.updateForm.color,
      dim: this.updateForm.dim,
      drawing: this.updateForm.drawing,
      mod: this.updateForm.mod,
      start: this.updateForm.start,
      end: this.updateForm.end,
      prod: this.updateForm.prod,
      seg: this.updateForm.seg,
      rep: this.updateForm.rep,
      broken: this.updateForm.broken,
      observaciones: this.updateForm.observaciones,
    })

    if (this.updateForm.stops){
      console.log('hay paradas');
      const control = <FormArray>this.myForm.controls['stops'];
      const stopArr = Object.keys(this.updateForm.stops);
      stopArr.forEach( stop => {
        control.push(this.initEditParada(
          this.updateForm.stops[stop].startP, 
          this.updateForm.stops[stop].endP, 
          this.updateForm.stops[stop].cause)
        );
      })
    }
  }

  initParada() {
    return this._fb.group({
      startP: ['', Validators.required],
      endP: ['', Validators.required],
      cause:['', Validators.required]
    });
  }

  initEditParada(start, end, cause) {
    return this._fb.group({
      startP: [start, Validators.required],
      endP: [end, Validators.required],
      cause:[cause, Validators.required]
    });
  }

  addStop() {
    const control = <FormArray>this.myForm.controls['stops'];
    control.push(this.initParada());
  }

  removeStop(i: number) {
    const control = <FormArray>this.myForm.controls['stops'];
    control.removeAt(i);
  }

  clearStops(){
    this.myForm.controls['stops'] = this._fb.array([]);
  }

  submit() {
    if (!this.editBtn) {
      this.save();
    } else {
      this.edit();
    }
  }

  save() {
    let prod = this.myForm.value;
    let stops = this.myForm.value.stops;
    console.log(stops);
    delete prod.stops;

    this.prodData.pushProduction(prod)
    .then( (ret: any) => {
    	if (stops.length > 0) {
      	this.prodData.setProdStop(ret.key, prod, stops);
    	}
    })
    .then( () => {
    	console.log('stops saved');
    	this.buildForm(); // esto es para que borre las entradas de stops 
    });
    this.myForm.reset();
    this.focusDate();
  }

  edit() {
    let prod = this.myForm.value;
    let stops = this.myForm.value.stops;
    delete prod.stops;

    if(stops.length > 0) {
      let stopKeys = Object.keys(this.updateForm.stops);
      console.log(stopKeys);
      this.prodData.updateProdStop(this.updateForm['$key'], prod, stops, stopKeys)
      .then( () => console.log('terminado update stops'));
    }
    this.prodData.updateProduction(this.updateForm['$key'],prod)
    .then( () => {
      this.navCtrl.pop();
    })
  }

  isPulidora() {
  	if (this.myForm.value.machine === 'Breton' 
      || this.myForm.value.machine === 'Lineal'
      || this.myForm.value.machine === 'Pasado tablas'
      || this.myForm.value.machine === 'Granalladora'
      || this.myForm.value.machine === 'Desmolde') {
  		return true;
  	} else {
  		return false;
  	}
  }

  focusDate(){
  	if (!this.platform.is('mobile')) {
    	// let element = this.dateInput._elementRef.nativeElement.getElementsByTagName('input')[0];
    	// console.log('focus', element);
    	// // element.focus(); esta es otra opcion
    	// this.renderer.invokeElementMethod(element,'focus'); y esta otra
    	setTimeout(() => {
      this.dateInput.setFocus(); // le pongo un timeout para que haga focus cuando carga
    },150);
    }
  }

}
