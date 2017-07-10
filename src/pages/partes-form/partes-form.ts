import { Component, ViewChild, Renderer, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';

import { AuthDataProvider, StaticDataProvider, ProductionDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-partes-form',
  templateUrl: 'partes-form.html',
})
export class PartesFormPage implements OnInit {

  public myForm: FormGroup;
  @ViewChild("dateInput") dateInput;

  constructor(
  	private _fb: FormBuilder,
  	private renderer: Renderer,
  	public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private authData: AuthDataProvider,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider
  ) { }

	ionViewDidLoad() {
		this.focusDate();
	}

  ngOnInit() {
    this.buildForm(); 
  }

  buildForm() {
  	this.myForm = this._fb.group({
    	date: ['', Validators.required],
    	machine: ['',],
    	color: ['',],
    	dim: ['',],
    	drawing: ['',],
    	mod: ['',],
    	start: ['',],
    	end: ['',],
    	prod: ['',],
    	seg: ['',],
    	rep: ['',],
    	broken: ['',],
    	observaciones: [''],
    	stops: this._fb.array([]),
    });
  }

  initParada() {
    return this._fb.group({
      startP: ['', Validators.required],
      endP: ['', Validators.required],
      cause:['', Validators.required]
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

  save() {
    let prod = this.myForm.value;
    let stops = this.myForm.value.stops;
    console.log(stops);
    delete prod.stops;

    this.prodData.pushProduction(prod)
    .then( (ret: any) => {
    	console.log(ret.key);
    	console.log(stops.length);
    	if (stops.length > 0) {
    		prod['$key'] = ret.key;
      	this.prodData.setProdStop(prod, stops);
    	}
    })
    .then( () => {
    	console.log('stops saved');
    	this.buildForm(); // esto es para que borre las entradas de stops 
    });
    this.myForm.reset();
    this.focusDate();
  }

  isPulidora() {
  	if (this.myForm.value.machine === 'Breton' || this.myForm.value.machine === 'Lineal') {
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
