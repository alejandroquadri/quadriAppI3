import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { CrmDataProvider } from '../../providers';
import { SortPipe, FilterPipe } from '../../pipes';

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

  pspTypes = ['Todos', 'Pendientes', 'Ignorados']

  filteredPsp: any;
  salesRep = '';
  pspType = 'Pendientes'
  searchInput = '';
  filteredArray: any;
  viewArray: any;
  sortTerm = 'total';
  sortDir = false;
  offset = 100;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public crmData: CrmDataProvider,
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
      let value = this.pspObj[psp]
      return (
        this.filterTypePsp(psp) &&
        this.filterSalesRep(value) &&
        (value.flag === 'Pronostico' || value.flag ==='Pendiente')
      )
    })
    .forEach( psp => {
      filteredArray.push(this.pspObj[psp]);
    });
    this.filteredPsp = filteredArray;
    this.filter();
  }

  filter(event?) {
    // this.viewArray = this.searchFilter.transform(this.filteredPsp,this.searchInput, false);
    this.filteredArray = this.searchFilter.transform(this.filteredPsp,this.searchInput, false);
    this.sort();
  }

  sort() {
    this.viewArray = this.sliceArray(this.sortPipe.transform(this.filteredArray, this.sortTerm, this.sortDir, false));
  }

  filterTypePsp(psp) {
    let ret
    switch (this.pspType) {
      case 'Todos':
        ret = true;
        break;
      
      case 'Pendientes':
        !this.checkedPspsObj[psp] ? ret = true : ret = false ;
        break;
      
      case 'Ignorados':
        this.checkedPspsObj[psp] === 'ignored' ? ret = true : ret = false;
        break;
    }
    return ret;
  }

  filterSalesRep(psp) {
    if (this.salesRep === '') {
      return true;
    } else {
      return psp.salesRep === this.salesRep;
    }
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
    setTimeout( () => {
      this.offset += 20;
      this.filter();
      infiniteScroll.complete()  
    }, 500)
  }

  seePsp(psp) {
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
