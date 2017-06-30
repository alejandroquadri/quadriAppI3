import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ModalController } from 'ionic-angular';


import { MachineLogDataProvider, SplitShowProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-machine-log',
  templateUrl: 'machine-log.html',
})
export class MachineLogPage {

	machineLogs: any;
	submitType: string = 'new';
	updateKey:  string;
	searchInput: string = '';
	optionsEnabled: boolean = true;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public platform: Platform,
  	public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
  	private machineLogData: MachineLogDataProvider,
    private splitShow: SplitShowProvider
	) {
  }

  ionViewDidLoad() {
    this.machineLogs = this.machineLogData.machineLogsObs
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
    this.machineLogData.searchInput = event;
    this.machineLogData.filter();
  }

  closeMenu() {
    if (this.splitShow.show) {
      this.splitShow.show = false;
    } else {
      this.splitShow.show = true;
    }
    
  }


}
