import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController, Content } from 'ionic-angular';
// import {IMyDpOptions} from 'mydatepicker';

import { SparePartsDataProvider, SplitShowProvider } from '../../providers';
import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-spare-parts',
  templateUrl: 'spare-parts.html',
})
export class SparePartsPage {

  spareSubs: any;
  filterSubs: any;
  spareParts: any;
  sparePartsCrude: any;
  // @ViewChild(Content) content: Content;
  filters: any;
  searchInput: string = '';
  statusOptions = ['Pendiente', 'Encargado', 'Completo', 'Suspendido'];
  field = 'fecha';
  asc = false;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private spareData: SparePartsDataProvider,
    private splitShow: SplitShowProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
    this.filters = this.spareData.filters;
  }

  ionViewDidLoad() {
    this.spareSubs = this.spareData.getSpareParts().subscribe( parts => {
      this.sparePartsCrude = parts;
      this.filter();
    })
    this.filterSubs = this.spareData.filterObs.subscribe( filters => {
      this.filters = filters;
      this.filter();
    })
  }

  ionViewDidEnter() {
  }

  ionViewWillUnload() {
    this.spareSubs.unsubscribe();
    this.filterSubs.unsubscribe();
  }

  filter() {
    const filteredField = this.fieldFilterPipe.transform(this.sparePartsCrude, ['status'], this.changeFilters(this.filters));
    const filtered = this.filterPipe.transform(filteredField, this.searchInput)
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc);
    this.spareParts = ordered;
  }

  changeFilters(filters: any) {
    const keyArr: any[] = Object.keys(filters);
    let arrayFilter = [];
    keyArr.forEach(item => {
      if(filters[item]) {
        arrayFilter.push(item);
      }
    })
    return arrayFilter;
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

  // onChange(event) {
  //   this.spareData.searchInput = event;
  //   this.spareData.filter();
  // }

  onChange(event) {
    this.searchInput = event;
    this.filter();
  }

}
