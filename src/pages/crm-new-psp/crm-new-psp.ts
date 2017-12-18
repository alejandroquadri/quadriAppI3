import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/zip";
import "rxjs/add/observable/combineLatest";
// import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { CrmDataProvider, SplitShowProvider } from '../../providers';
import { FieldFilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-crm-new-psp',
  templateUrl: 'crm-new-psp.html',
})
export class CrmNewPspPage {

  pspSubs: any;
  checkedPsps: any;
  pspObj: Array<any>;
  filteredPsp: any;
  salesRep = "";
  viewArray: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public crmData: CrmDataProvider,
    private splitShow: SplitShowProvider,
    private fieldFilter: FieldFilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.pspSubs = this.crmData.calipsoObj;
    this.pspSubs.subscribe( data => {
      this.filteredPsp = this.filterPsp(data);
      this.filterSalesRep();
  	});

  }

  filterPsp(filteredObj) {
    let filteredArray = [];

    let psp = Object.keys(filteredObj);
    psp.forEach( psp => {
      filteredArray.push(filteredObj[psp]);
    })

    filteredArray = this.sortPipe.transform(filteredArray, 'num', false, false);
    return filteredArray;
  }

  filterSalesRep() {
    if(this.salesRep !== "") {
      this.viewArray = this.fieldFilter.transform(this.filteredPsp,['salesRep'],[this.salesRep], false);
    } else  {
      this.viewArray = this.filteredPsp;
    }
  }

  filterCheckedPsp() {

  }

  addOp(psp) {
    let profileModal = this.modalCtrl.create('CrmOpFormPage', psp);
    profileModal.present();
  }

  ignore(psp) {

  }

}
