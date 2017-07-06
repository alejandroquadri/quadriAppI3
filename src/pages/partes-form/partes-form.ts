import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';
// import * as firebase from 'firebase';

import { AuthDataProvider, StaticDataProvider } from '../../providers';

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
	    private staticData: StaticDataProvider
    ) { }

    ngOnInit() {
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
      	paradas: this._fb.array([]),

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

    addParada() {
      const control = <FormArray>this.myForm.controls['paradas'];
      control.push(this.initParada());
    }

    removeParada(i: number) {
      const control = <FormArray>this.myForm.controls['paradas'];
      control.removeAt(i);
    }

    save() {
      // call API to save
      // ...
      console.log(this.myForm.value);
      console.log(this.myForm);
      this.myForm.reset();
    }

    isPulidora() {
    	if (this.myForm.value.machine === 'Breton' || this.myForm.value.machine === 'Lineal') {
    		return true;
    	} else {
    		return false;
    	}
    }

    reset() {
    	this.myForm.reset();
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
