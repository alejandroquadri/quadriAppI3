import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController, Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { SparePartsDataProvider, SplitShowProvider } from '../../providers';
import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-spare-parts',
  templateUrl: 'spare-parts.html',
})
export class SparePartsPage {

  obsSubs: Observable<any>;
  spareSubs: any;
  filterSubs: any;
  spareParts: any;
  sparePartsCrude: any;
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
    // this.filters = this.spareData.filters;
  }

  ionViewDidLoad() {
    this.spareSubs = this.spareData.getSparePartsMeta()
    this.filterSubs = this.spareData.filterObs

    this.obsSubs = Observable.combineLatest(this.spareSubs, this.filterSubs, (parts: any, filters: any) => ({parts, filters}))
    this.obsSubs.subscribe( (pair: any) => {
      this.sparePartsCrude = pair.parts;
      this.filters = pair.filters;
      this.filter();
    })
  }

  ionViewDidEnter() {
  }

  ionViewWillUnload() {
  }

  filter() {
    const filteredField = this.fieldFilterPipe.transform(this.sparePartsCrude, ['status'], this.changeFilters(this.filters), true);
    const filtered = this.filterPipe.transform(filteredField, this.searchInput, true);
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
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

  editPart(part: any, key) {
    part['$key'] = key;
    this.presentModal(part);
  }

  presentModal(form: any) {
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
    console.log('status changed', status, key);
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
