import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';
import * as firebase from 'firebase';

import { AuthDataProvider, StaticDataProvider, ProductionDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-partes-form',
  templateUrl: 'partes-form.html',
})
export class PartesFormPage implements OnInit {
    public myForm: FormGroup;

    constructor(
    	private _fb: FormBuilder,
    	public navParams: NavParams,
	    public platform: Platform,
	    public viewCtrl: ViewController,
	    private authData: AuthDataProvider,
	    private staticData: StaticDataProvider,
	    private prodData: ProductionDataProvider
    ) { }

    ionViewDidLoad() {
    	
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
      	// paradas: this._fb.array([this.initParada()]), esto si quiero que arranque con uno detro del array
      	stops: this._fb.array([]),

        // name: ['', [Validators.required, Validators.minLength(5)]],
        // addresses: this._fb.array([
        //     this.initAddress(),
        // ])
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
      	this.buildForm();
      });
      this.myForm.reset();
    }

    isPulidora() {
    	if (this.myForm.value.machine === 'Breton' || this.myForm.value.machine === 'Lineal') {
    		return true;
    	} else {
    		return false;
    	}
    }

}

		// initAddress() {
    //   return this._fb.group({
    //     street: ['', Validators.required],
    //     postcode: ['']
    //   });
    // }

    // addAddress() {
    //   const control = <FormArray>this.myForm.controls['addresses'];
    //   control.push(this.initAddress());
    // }

    // removeAddress(i: number) {
    //   const control = <FormArray>this.myForm.controls['addresses'];
    //   control.removeAt(i);
    // }
