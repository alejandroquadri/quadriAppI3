import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { CrmDataProvider } from '../../providers';
import { FilterPipe } from '../../pipes';

@IonicPage()
@Component({
  selector: 'page-client-select',
  templateUrl: 'client-select.html',
})
export class ClientSelectPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private filterPipe: FilterPipe,
    public viewCtrl: ViewController,
    private crmData: CrmDataProvider
  ) {
  }

  searchInput = '';
  clientsObs: any;
  clientsList: any;
  filteredClients;
  clients = [{name: 'Riva'}, {name:'Criba'}, {name:'Sudamericana'}];

  ionViewDidLoad() {
    this.clientsObs = this.crmData.getClients();
    this.clientsObs.subscribe( clients => {
      this.clientsList = clients;
      this.filter();
    })
  }

  filter(event?) {
    this.filteredClients = this.filterPipe.transform(this.clientsList, this.searchInput, true);
  }

  selectClient(name) {
    this.viewCtrl.dismiss(name);
  }

  newClient() {
    this.viewCtrl.dismiss(this.searchInput);
  }

}
