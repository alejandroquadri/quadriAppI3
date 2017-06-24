import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController } from 'ionic-angular';
import * as moment from 'moment';
// import {IMyDpOptions} from 'mydatepicker';

import { SparePartsDataProvider, SettingsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-spare-parts',
  templateUrl: 'spare-parts.html',
})
export class SparePartsPage {

	spareForm: FormGroup;
  spareParts: any;
  submitType: string = 'new';
  updateKey:  string;
  searchInput: string = '';
  optionsEnabled: boolean = true;

  constructor(
    private fb: FormBuilder,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private spareData: SparePartsDataProvider,
    private settingsData: SettingsProvider,
	) {
    this.spareData.getSpareParts().subscribe( spareParts => {
      console.log(spareParts);
      this.spareParts = spareParts;  
    });
  }

  ionViewDidLoad() {
  }

  toNew() {
    this.submitType = 'new';
    this.spareForm.reset();
  }

  deletepart(key) {
    this.spareData.deleteSparePart(key);
  }

  update() {
    let form = this.spareForm.value;
    this.spareData.updateSparePart(this.updateKey, form)
    .then( ret => {
      this.submitType = 'new';
      this.spareForm.reset();
    })
  }

  editPart(part) {
    console.log(part);
    // this.submitType = 'edit'
    // let form = {
    //   date: part.date,
    //   title: part.title,
    //   orderNumber: part.orderNumber,
    //   description: part.description
    // }
    // this.updateKey = part.$key;
    this.presentModal(part);
    // this.spareForm.patchValue(form);
    // if( this.platform.is('mobile')) { this.presentToast() }
  }

  presentModal(form?: any) {
   let profileModal = this.modalCtrl.create('SparePartsFormPage', form);
   profileModal.present();
 }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Enderezar el telefono para editar',
      duration: 3000
    });
    toast.present();
  }

  presentOptions(myEvent) {
    // this.optionsEnabled = false
    // let popover = this.popoverCtrl.create('OptionsPage',{
    //   form: this.form.nativeElement,
    //   data: this.data.nativeElement,
    //   dataHeaders: this.dataHeaders.nativeElement
    // });
    let popover = this.popoverCtrl.create('OptionsPage');
    popover.present({
      ev: myEvent
    });
  }

  showForm() {
    // en desktop, tiene que verse si el usuario quiere
    // en mobile, tiene que verse si esta en portrait
    if (this.platform.is('mobile')) {
      if (this.platform.isPortrait()) {
        return true;
      } else {
        return false;
      }
    } else { return true; }
  }

  showData() {
    // en desktop, tiene que verse si el usuario quiere
    // en mobile, tiene que verse si esta no esta en lanscape landscape
    if (this.platform.is('mobile')) {
      if (this.platform.isLandscape()) {
        return true;
      } else {
        return false;
      }
    } else { return true; }
  }

  showSearchBar() {
    if (this.platform.is('mobile')) {
      if (this.platform.isLandscape()) {
        return true;
      } else {
        return false;
      }
    } else { 
      // return this.data.nativeElement.hidden; 
      return true;
    }
  }


}
