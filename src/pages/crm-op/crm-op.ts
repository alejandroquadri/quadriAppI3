import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import * as moment from 'moment';

import { CrmDataProvider } from '../../providers';
import { FilterPipe, SortPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-crm-op',
  templateUrl: 'crm-op.html',
})
export class CrmOpPage {

  filtersObs: Observable<any>;
  opObs: Observable<any>;
  subs: Observable<any>;
  months: any;
  // statusOptions = ['Pendiente', 'Rechazado', 'Cerrado'];
  statusOptions: any;

	opListCrude: Array<any>;
  filters: any;	
  searchInput: string = '';
  sortTerm = 'total';
  sortDir = false;

  ascTotal = false;
  ascMonth = true;
  total: number = 0;

  opList: Array<any>;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private crmData: CrmDataProvider,
  	public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
    this.months = this.crmData.buildCloseMonth();
    this.statusOptions = this.crmData.statusOptions;
  }

  ionViewDidLoad() {
    this.opObs = this.crmData.getOpsList();
    this.filtersObs = this.crmData.filterObs;

    this.subs = Observable.combineLatest(this.opObs, this.filtersObs, (ops: any, filters:any) => ({ops, filters}));
    this.subs.subscribe( (pair: any) => {
      this.opListCrude = pair.ops;
      this.filters = pair.filters;
      console.log(this.filters);
      this.filter();
    })
  }

  filter() {
    const fieldsFiltered = this.fieldFilter(this.opListCrude);
    this.opList = this.filterPipe.transform(fieldsFiltered, this.searchInput, true);
    this.sort();
    this.calcTotal(this.opList);
  }

  fieldFilter(array: Array<any>) {
    return array.filter( itemMeta => {
      let item = itemMeta.payload.val();
      return (this.statusFilter(item) && this.salesRepFilter(item) && this.monthFilter(item));
    })
  }

  calcTotal(array: Array<any>) {
    this.total = 0;
    array.forEach( itemM => {
      let total = +itemM.payload.val().total;
      this.total += total;
    })
  }

  sort() {
    this.opList =  this.sortPipe.transform(this.opList, this.sortTerm, this.sortDir, true);
  }

  changeSort(term) {
    this.sortTerm = term;
    this.sortDir = !this.sortDir;
    this.sort();
  }

  searchBar(event) {
    this.searchInput = event;
    this.filter();
  }

  statusFilter(item) {
    let fields = this.changeFilters(this.filters.status);
    for (let j=0, n = fields.length; j < n; j++) {
      if (item.status.toLowerCase() === fields[j].toLowerCase()) {
        return true;
      }
    }
  }

  salesRepFilter(item) {
    let fields = this.changeFilters(this.filters.salesRep);
    for (let j=0, n = fields.length; j<n; j++) {
      if (item.salesRep.toLowerCase() === fields[j].toLowerCase()) {
        return true;
      }
    }
  }

  monthFilter(item) {
    let month = this.filters.month;
    if (month === '') {
      return true;
    } else {
      if (item.closeMonth === month) {
        return true;
      }
    }
  }

  changeFilters(filters: any) {
    const keyArr: any[] = Object.keys(filters);
    let arrayFilter = [];
    keyArr.forEach(item => {
      if(filters[item]) {
        if (item === 'month') {
          arrayFilter.push(filters[item])
        } else if (item === 'roldan') {
          arrayFilter.push('Alejandra Roldan')
        } else if (item === 'tarruella') {
          arrayFilter.push('Tarruella Alberto Horacio ')
        } else {
          arrayFilter.push(item);
        }
      }
    })
    return arrayFilter;
  }

  changeStatus(status: string, key: string) {
    this.crmData.updateOp(key, {status: status})
    .then( () => console.log('status actualizado'));
  }

  changeCloseMonth(closeMonth: string, key: string) {
    let month = moment(closeMonth, 'MMM YY').format('YYYY-MM');
    this.crmData.updateOp(key, {closeMonth: month})
    .then( () => console.log('closeMonth actualizado'));
  }

  seeOp(op: any, key: string) {
    op['$key'] = key;
    this.navCtrl.push('CrmOpDetailPage', op);
  }

  presentFilters(myEvent) {
    let popover = this.popoverCtrl.create('CrmOpFiltersPage');
    popover.present({
      ev: myEvent
    });
  }

  presentModal() {
    let profileModal = this.modalCtrl.create('CrmOpFormPage', {state:'addNew'});
    profileModal.present();
  }

  oldMonth(month: string) {
    return moment().isAfter(month, 'month');
  }

}
