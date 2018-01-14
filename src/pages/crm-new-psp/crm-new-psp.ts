import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";

import { CrmDataProvider } from '../../providers';
import { FieldFilterPipe, SortPipe } from '../../pipes';

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
  salesRep = "";
  viewArray: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public crmData: CrmDataProvider,
    private fieldFilter: FieldFilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.pspSubs = this.crmData.calipsoObj;
    this.checkedPspSubs = this.crmData.getCheckedPsp();

    Observable.combineLatest(this.pspSubs, this.checkedPspSubs, (psps: any, checkedPsp: any) => ({psps, checkedPsp}))
    .subscribe( pair => {
      this.checkedPspsObj = pair.checkedPsp;
      this.pspObj = pair.psps.psp;
      this.filterPsp();
      this.filterSalesRep(); 
    })
  }

  filterPsp() {
    !this.pspObj ? this.pspObj = {} : '' ;
    let filteredArray = [];

    let psp = Object.keys(this.pspObj);
    psp.filter( (psp:any) => {
      return (!this.checkedPspsObj[psp] && (this.pspObj[psp].flag === 'Pronostico' || this.pspObj[psp].flag ==='Pendiente'))
    })
    .forEach( psp => {
      filteredArray.push(this.pspObj[psp]);
    })
    this.filteredPsp = this.sortPipe.transform(filteredArray, 'num', false, false);;
  }

  filterSalesRep() {
    if(this.salesRep !== "") {
      this.viewArray = this.fieldFilter.transform(this.filteredPsp,['salesRep'],[this.salesRep], false);
    } else  {
      this.viewArray = this.filteredPsp;
    }
  }

  addOp(psp) {
    let profileModal = this.modalCtrl.create('CrmOpFormPage', psp);
    profileModal.present();
  }

  ignore(psp) {

  }

}
