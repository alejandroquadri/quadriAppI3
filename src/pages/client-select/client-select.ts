import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
    private viewCtrl: ViewController
  ) {
  }

  searchInput = '';
  filteredClients;
  clients = [{name: 'Riva'}, {name:'Criba'}, {name:'Sudamericana'}];

  ionViewDidLoad() {
    this.filter();
  }

  filter(event?) {
    this.filteredClients = this.filterPipe.transform(this.clients, this.searchInput)
  }

  selectClient(name) {
    this.viewCtrl.dismiss(name);
  }

}
