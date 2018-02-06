import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ModalController, InfiniteScroll } from 'ionic-angular';

import { MachineLogDataProvider, SplitShowProvider } from '../../providers';
import { FilterPipe, SortPipe } from '../../pipes';


@IonicPage()
@Component({
  selector: 'page-machine-log',
  templateUrl: 'machine-log.html',
})
export class MachineLogPage {

  machineSubs: any;
  machineDataCrude: any;
	machineLogs: any;

	searchInput: string = '';
  field = 'date';
  asc = false;
  offset = 100;


  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public platform: Platform,
  	public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
  	private machineLogData: MachineLogDataProvider,
    private splitShow: SplitShowProvider,
    private filterPipe: FilterPipe,
    private sortPipe: SortPipe
	) {
  }

  ionViewDidLoad() {
    this.machineSubs = this.machineLogData.getMachineLogsMeta().subscribe(logs => {
      this.machineDataCrude = logs;
      this.filter();
    })
  }

  ionViewWillUnload() {
    this.machineSubs.unsubscribe();
  }

  filter() {
    const filtered = this.filterPipe.transform(this.machineDataCrude, this.searchInput, true)
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
    this.machineLogs = this.sliceArray(ordered);
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

  deleteLog(key) {
  	this.machineLogData.deleteLog(key);
  }

  editLog(log, key) {
    log['$key'] = key
    this.presentModal(log);
  }

  presentModal(form?: any) {
    let profileModal = this.modalCtrl.create('MachineLogFormPage', form);
    profileModal.present();
  }

  onChange(event) {
    this.searchInput = event;
    this.filter();
  }

  closeMenu() {
    this.splitShow.show = !this.splitShow.show;    
  }


}
