import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController, ModalController, InfiniteScroll } from 'ionic-angular';

import { FinanceDataProvider } from '../../providers';
import { FilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-avion-list',
  templateUrl: 'avion-list.html',
})
export class AvionListPage {

  avionSubs: any;
  avionList: any;
  avionView: any;

  searchInput: string = '';
  field = 'date';
  total = 0;
  asc = false;
  offset = 50;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private fData: FinanceDataProvider,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
  }

  ionViewDidLoad() {
    this.avionSubs = this.fData.getAvionList().subscribe( avionList => {
      this.avionList = avionList;
      this.filter();
    });
  }

  filter() {
    const filtered = this.filterPipe.transform(this.avionList, this.searchInput, true);
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
    this.avionView = this.sliceArray(ordered);
    this.calcTotal();
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

  deletepart(key: string) {
    console.log(key);
    this.fData.deleteRecord(key);
  }

  editPart(record: any, key) {
    record['$key'] = key;
    this.presentModal(record);
  }

  presentModal(form: any) {
     let profileModal = this.modalCtrl.create('AvionFormPage', form);
     profileModal.present();
   }

  onChange(event) {
    this.offsetInit();
    this.searchInput = event;
    this.filter();
  }

  offsetInit() {
    this.offset = 50;    
  }

  calcTotal() {
    this.total = 0;
    this.avionView.forEach( record => {
      let val = record.payload.val();
      let amount = Number(val.amount);
      if (val.type === "Egreso") {
        amount = -amount;
      }
      this.total += amount;
    });
  }

}
