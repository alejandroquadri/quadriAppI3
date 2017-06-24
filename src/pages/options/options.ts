import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, /*ViewController */} from 'ionic-angular';

import { MachineLogDataProvider, SettingsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {

  options: any = {};
  form: any;
  dataHeaders: any;
  data: any;
  settings: any;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	// public viewCtrl: ViewController,
    private machineLogData: MachineLogDataProvider,
    private settingsData: SettingsProvider
	) {
    // if (this.navParams.data) {
    // 	this.form = this.navParams.data.form;
    // 	this.data = this.navParams.data.data;
    //   this.dataHeaders = this.navParams.data.dataHeaders;
    //   this.options.form = !this.form.hidden;
    //   this.options.data = !this.data.hidden;
    // }

    
  }

  // ionViewDidLoad() {
  //   this.settingsData.settingsObs.subscribe(settings => {
  //     console.log('vovlio', settings);
  //       this.settings = settings;
  //   })
  // }

  hideForm() {
  	// this.viewCtrl.dismiss(this.options);
    this.form.hidden = !this.options.form;
  }

  hideData() {
    this.data.hidden = !this.options.data;
    this.dataHeaders.hidden = !this.options.data;
  }

  changeView() {
    this.settingsData.changeView('spareParts',this.options);
  }

  save() {
    this.settingsData.updateSettings('spareParts', this.options);
  }

  savePreferences() {
    this.machineLogData.updateSettings(this.options.form, this.options.data)
    .then( () => {
      console.log('settings updated');
    })
  }

}
