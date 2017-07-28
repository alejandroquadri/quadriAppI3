import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController, Content } from 'ionic-angular';
// import {IMyDpOptions} from 'mydatepicker';

import { SparePartsDataProvider, SettingsProvider, SplitShowProvider, ChartBuilderProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-spare-parts',
  templateUrl: 'spare-parts.html',
})
export class SparePartsPage {

  spareParts: any;
  @ViewChild(Content) content: Content;

  searchInput: string = '';
  statusOptions = ['Pendiente', 'Encargado', 'Completo', 'Suspendido'];

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private spareData: SparePartsDataProvider,
    private settingsData: SettingsProvider,
    private splitShow: SplitShowProvider,
    private chartBuilder: ChartBuilderProvider
	) {

  }

  ionViewDidLoad() {
    this.chartBuilder.contentWidth = this.content._elementRef.nativeElement.clientWidth;
    // la linea de arriba es porque esta es la landing page
    // necesito que ni bien se carga esta pagina se determine el ancho del ion-content
    // para que los graficos tomen correcto ancho
    this.spareData.sparePartsObs.subscribe( spareParts => {
      this.spareParts = spareParts;  
    });
  }

  ionViewDidEnter() {
    
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

  changeStatus(status: string, key: string) {
    console.log('status changed', status);
    this.spareData.updateSparePart(key, {status: status})
    .then( () => console.log('status actualizado'));
  }

  onChange(event) {
    this.spareData.searchInput = event;
    this.spareData.filter();
  }

}
