import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController } from 'ionic-angular';
// import {IMyDpOptions} from 'mydatepicker';

import { SparePartsDataProvider, SettingsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-spare-parts',
  templateUrl: 'spare-parts.html',
})
export class SparePartsPage {

  spareParts: any;
  submitType: string = 'new';
  updateKey:  string;
  searchInput: string = '';
  optionsEnabled: boolean = true;
  statusOptions = ['Pendiente', 'Encargado', 'Completo', 'Suspendido']

  constructor(
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

  deletepart(key) {
    this.spareData.deleteSparePart(key);
  }

  editPart(part) {
    this.presentModal(part);
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
    let popover = this.popoverCtrl.create('OptionsPage');
    popover.present({
      ev: myEvent
    });
  }

  changeStatus() {
    console.log('status change');
  }

}
