import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { SplitShowProvider, CrmDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-crm-dashboard',
  templateUrl: 'crm-dashboard.html',
})
export class CrmDashboardPage {

  agendaObs: any;
  agendaList: any;
  agendaObj: any
  date: string = moment().format('YYYY-MM-DD');

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private splitShow: SplitShowProvider,
    private crmData: CrmDataProvider
  ) {
  }

  ionViewDidLoad() {
    this.agendaObs = this.crmData.getAgendaList().subscribe( agenda => {
      this.agendaList = agenda;
      this.buildAgendaObj();
    })
  }

  buildAgendaObj() {
    let agendaObj = {};

    this.agendaList.forEach( agendaItem => {
      let item = agendaItem.payload.val();
      item['$key'] = agendaItem.key;
      
      if (!agendaObj[item.time]) {
        agendaObj[item.time] = [];
        agendaObj[item.time].push(item);
      } else {
        agendaObj[item.time].push(item);
      }
    })
    this.agendaObj = agendaObj;
  }

  back() {
    this.date = moment(this.date).add(-1, 'days').format('YYYY-MM-DD');
    this.buildAgendaObj();
  }

  forward() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.buildAgendaObj();
  }

  changeCheck(agendaKey, check) {
    console.log(check);
    this.crmData.updateAgendaItem(agendaKey, { complete: check})
    .then( () => console.log('check actualizado'));
  }

  seeOp(key: string) {
    let op = {
      $key: key
    };
    this.navCtrl.push('CrmOpDetailPage', op);
  }

}
