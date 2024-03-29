import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController, InfiniteScroll } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { SparePartsDataProvider, StaticDataProvider } from '../../providers';
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
  // statusOptions = ['Autorizacion', 'Pendiente', 'Encargado', 'Completo', 'Suspendido'];
  statusOptions: any;
  field = 'fecha';
  asc = false;
  offset = 50;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private spareData: SparePartsDataProvider,
    private staticData: StaticDataProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
    this.statusOptions = this.staticData.data.produccion.tipoStatus
  }

  ionViewDidLoad() {
    this.spareSubs = this.spareData.getSparePartsMeta();
    this.filterSubs = this.spareData.filterObs;

    this.obsSubs = Observable.combineLatest(this.spareSubs, this.filterSubs, (parts: any, filters: any) => ({parts, filters}))
    this.obsSubs.subscribe( (pair: any) => {
      this.sparePartsCrude = pair.parts;
      this.filters = pair.filters;
      this.offsetInit();      
      this.filter();
    })
  }

  filter() {
    const filteredField = this.fieldFilterPipe.transform(this.sparePartsCrude, ['status'], this.changeFilters(this.filters), true);
    const filtered = this.filterPipe.transform(filteredField, this.searchInput, true);
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
    this.spareParts = this.sliceArray(ordered);
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

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    setTimeout( () => {
      this.offset += 20;
      this.filter();
      infiniteScroll.complete()  
    }, 500)
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
    this.offsetInit();
    this.searchInput = event;
    this.filter();
  }

  offsetInit() {
    this.offset = 50;    
  }

}
