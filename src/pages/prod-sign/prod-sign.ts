import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform} from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';
import { SortPipe } from '../../pipes';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-prod-sign',
  templateUrl: 'prod-sign.html',
})
export class ProdSignPage {

  prodSubs:any;
	production: any;
	date = moment();
	prodObj: any;
	m2total = 0;
	mltotal = 0;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider,
    private sortPipe: SortPipe
  ) {
  }

  ionViewDidLoad() {
    this.prodSubs = this.prodData.getProduction().subscribe( prod => {
  		this.production = prod;
      this.fileterProd();
  	});
  }

  ionViewWillUnload() {
    console.log('willunload');
    console.log('desuscripcion prod sign');
    this.prodSubs.unsubscribe();
  }

  fileterProd() {
  	let month = this.date.format('M');
  	this.prodObj = {};
  	this.m2total = 0;
		this.mltotal = 0;

  	let filtered: Array<any> = this.production.filter( log => {
      if ( moment(log.date).format('M') === month &&
        (log.machine == 'Breton' ||
        log.machine == 'Lineal' ||
        log.machine == 'Pasado tablas' ||
        log.machine == 'Biseladora zocalos' ||
        log.machine == 'Desmolde' ||
        log.machine == 'Granalladora' ||
        log.machine == 'Biseladora')
        ) {
        return true;
      }
    });

    let filteredSorted = this.sortPipe.transform(filtered, 'date', true, false);

    filteredSorted.forEach( log => {
    	let m2 = 0;
    	let ml = 0;
  		let prod = this.toSalesUnit(log.prod, log.dim);
  		let date = moment(log.date).format('DD/MM/YYYY');

  		if (this.staticData.equivalences[log.dim].unit === 'm2') {
  			m2 = prod;
  			this.m2total += prod;
  		} else {
  			ml = prod;
  			this.mltotal += prod;
  		}

  		if (!this.prodObj[date]) {
  			this.prodObj[date] = {
  				m2: m2,
  				ml: ml
  			};
  		} else {
  			this.prodObj[date].m2 += m2;
  			this.prodObj[date].ml += ml;
  		}
    })
    // console.log(this.prodObj, this.m2total, this.mltotal);

  }

  toSalesUnit(unit: string, dim) {
    let eq = this.staticData.equivalences[dim];
    let total: number = 0
    let itemN = +unit;
    total += itemN * eq.conv;
    return total;
  }

  premio() {
  	if (this.m2total > 5000 ) {
	  	return (this.m2total - 5000)*this.staticData.premioProd.factorM2 + this.mltotal*this.staticData.premioProd.factorMl
	  } else {
	  	return 0;
	  }
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months')
    this.fileterProd();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months')
    this.fileterProd();
  }

}
