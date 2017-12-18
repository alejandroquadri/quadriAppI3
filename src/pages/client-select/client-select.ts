import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { CrmDataProvider } from '../../providers';
import { FieldFilterPipe, FilterPipe, SortPipe } from '../../pipes';

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
    private viewCtrl: ViewController,
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
    this.filteredClients = this.filterPipe.transform(this.clientsList, this.searchInput, false);
  }

  selectClient(name) {
    this.viewCtrl.dismiss(name);
  }

}
