import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ModalController } from 'ionic-angular';

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
	// submitType: string = 'new';
	// updateKey:  string;

	searchInput: string = '';
  field = 'date';
  asc = false;


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
    // this.machineLogs = this.machineLogData.machineLogsObs
    this.machineSubs = this.machineLogData.getMachineLogs().subscribe(logs => {
      this.machineDataCrude = logs;
      this.filter();
    })
  }

  ionViewWillUnload() {
    console.log('willunload');
    console.log('desuscripcion machine logs');
    this.machineSubs.unsubscribe();
  }

  filter() {
    const filtered = this.filterPipe.transform(this.machineDataCrude, this.searchInput)
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc);
    this.machineLogs = ordered;
  }

  deleteLog(key) {
  	this.machineLogData.deleteLog(key);
  }

  editLog(log) {
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
