import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, Platform, PopoverController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';

import { SparePartsDataProvider, SettingsProvider, AuthDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-spare-parts-form',
  templateUrl: 'spare-parts-form.html',
})
export class SparePartsFormPage {

	spareForm: FormGroup;
  spareParts: any;
  submitType: string = 'new';
  updateKey:  string;
  updateForm: any;

  constructor(
    private fb: FormBuilder,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    private spareData: SparePartsDataProvider,
    private settingsData: SettingsProvider,
    private authData: AuthDataProvider
    ) {
  	this.buildForm();
  	if (this.navParams.data.detalle) {
    	this.updateForm = this.navParams.data;
    	this.edit()
    }
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
  }

  buildForm() {
    this.spareForm = this.fb.group({
      tipo: ['', Validators.required ],
      detalle: ['', Validators.required],
      destino: ['', Validators.required],
      cantidad: ['', Validators.required],
      unidad: ['', Validators.required],
      muestra: [false, ],
    });
  }

  edit() {
  	this.submitType = 'edit';
    let muestra
    if (this.updateForm.muestra === 'si' ) {
      muestra = true;
    } else {
      muestra = false;
    }
  	this.spareForm.patchValue({
      tipo: this.updateForm.tipo,
      detalle: this.updateForm.detalle,
      destino: this.updateForm.destino,
      cantidad: this.updateForm.cantidad,
      unidad: this.updateForm.unidad,
      muestra: muestra
    })
  	
  }

  onSubmit() {
    if (this.submitType === 'new') {
      this.pushNew();
    } else {
      this.update();
    }
  }

  update() {
    let form = this.spareForm.value;
    if (this.spareForm.value.muestra === true ) {
      form.muestra = 'si'
    } else {
      form.muestra = 'no'
    }
    this.spareData.updateSparePart(this.updateForm.$key, form)
    .then( ret => {
    })
    this.viewCtrl.dismiss();
  }

  pushNew() {
    let form = this.spareForm.value;
    form['fecha'] = firebase.database.ServerValue.TIMESTAMP
    form['status'] = 'Pendiente';
    form['user'] = {
      displayName: this.authData.current.displayName,
      uid: this.authData.current.uid
    }
    if (this.spareForm.value.muestra === true ) {
      form.muestra = 'si'
    } else {
      form.muestra = 'no'
    }
    this.spareData.pushSparePart(form)
    .then( ret => {
      this.spareForm.reset();
    })
  }

  toNew() {
    this.submitType = 'new';
    this.spareForm.reset();
  }

}
