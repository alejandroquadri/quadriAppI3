import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { CrmDataProvider } from '../../providers';
import { FieldFilterPipe, SortPipe, FilterPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-crm-new-psp',
  templateUrl: 'crm-new-psp.html',
})
export class CrmNewPspPage {

  pspSubs: any;
  checkedPspSubs: any;

  checkedPspsObj: any;
  pspObj: any;

  filteredPsp: any;
  salesRep = '';
  searchInput = '';
  viewArray: any;
  sortTerm = 'total';
  sortDir = false;
  offset = 100;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public crmData: CrmDataProvider,
    private fieldFilter: FieldFilterPipe,
    private searchFilter: FilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.pspSubs = this.crmData.calipsoObj;
    this.checkedPspSubs = this.crmData.getCheckedPsp();
    this.checkCurrentSalesRep();
    Observable.combineLatest(this.pspSubs, this.checkedPspSubs, (psps: any, checkedPsp: any) => ({psps, checkedPsp}))
    .subscribe( pair => {
      pair.checkedPsp? this.checkedPspsObj = pair.checkedPsp : this.checkedPspsObj = {};
      this.pspObj = pair.psps.psp;
      this.filterPsp();
      this.filter();
    })
  }

  checkCurrentSalesRep() {
    if (this.crmData.currentSalesRep) {
      this.salesRep = this.crmData.currentSalesRep;
    }
  }

  filterPsp() {
    !this.pspObj ? this.pspObj = {} : '' ;
    let filteredArray = [];

    let psp = Object.keys(this.pspObj);
    psp.filter( (psp:any) => {
      return (
                !(this.checkedPspsObj[psp]) &&
                // !(this.checkedPspsObj[psp]=== 'ignored') &&
                (this.pspObj[psp].flag === 'Pronostico' || this.pspObj[psp].flag ==='Pendiente')
              )
    })
    .forEach( psp => {
      filteredArray.push(this.pspObj[psp]);
    });
    this.filteredPsp = filteredArray;
  }

  filter(event?) {
    let salesFilter = this.fieldFilter.transform(this.filteredPsp,['salesRep'],[this.salesRep], false);
    this.viewArray = this.searchFilter.transform(salesFilter,this.searchInput, false);
    this.sort();
  }

  sort() {
    this.viewArray = this.sliceArray(this.sortPipe.transform(this.viewArray, this.sortTerm, this.sortDir, false));
  }

  changeSort(term) {
    this.sortTerm = term;
    this.sortDir = !this.sortDir;
    this.sort();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('infinite');
    setTimeout( () => {
      this.offset += 20;
      this.filter();
      infiniteScroll.complete()  
    }, 500)
  }

  seePsp(psp) {
    console.log(psp);
    let profileModal = this.modalCtrl.create('CrmPspDetailPage', psp);
    profileModal.present();
  }

  addOp(psp) {
    let profileModal = this.modalCtrl.create('CrmOpFormPage', psp);
    profileModal.present();
  }

  ignore(psp) {
    this.crmData.ignorePsp(psp);
  }

}
