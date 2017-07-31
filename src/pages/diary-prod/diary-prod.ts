import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';
import { FieldFilterPipe } from '../../pipes';
import { DecimalPipe } from '@angular/common';


import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-diary-prod',
  templateUrl: 'diary-prod.html',
})
export class DiaryProdPage {

  @ViewChild('prodChart') prodChartEl;
	@ViewChild('prodAcChart') prodAcChartEl;

	production: any;
	date: string = moment().add(-1, 'days').format('YYYY-MM-DD');
	dailyProd: any = {};
  prodNominal: any;

  constructor(
  	public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private number: DecimalPipe
  ) {
    this.prodNominal = this.staticData.prodNominal;
  }

  ionViewDidLoad() {
  	this.prodData.getProduction().subscribe( prod => {
  		this.production = prod;
  		this.dailyProdObj();
  	});
  }

  back() {
    this.date = moment(this.date).add(-1, 'days').format('YYYY-MM-DD');
    this.dailyProdObj();
  }

  forward() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.dailyProdObj();
  }

  dailyProdObj() {
  	const filteredArray = this.fieldFilterPipe.transform(this.production, ['date'], [this.date]);
		let obj = {};
		filteredArray.forEach( item => {
  		if (!obj[item.machine]) {
  			obj[item.machine] = {
  				logs: [],
  				total: {}
  			}
  			obj[item.machine]['logs'].push(item);
  			obj[item.machine]['total'] = {
  				prod: +item.prod,
  				rep: +item.rep,
  				seg: +item.seg,
  				broken: +item.broken
  			}
  		} else {
  			obj[item.machine]['logs'].push(item);
  			obj[item.machine]['total'].prod += (+item.prod);
  			obj[item.machine]['total'].rep += (+item.rep);
  			obj[item.machine]['total'].seg += (+item.seg);
  			obj[item.machine]['total'].broken += (+item.broken);
  		}
  	});
  	this.dailyProd = obj;
  }

  timeDiff(start: string, end: string) {
		return moment.duration(moment(end,"HH:mm:ss").diff(moment(start,"HH:mm:ss")))
		.asHours();
  }

  toSalesUnit(units: Array<any>, dim) {
  	if(dim) {
			let eq = this.staticData.equivalences[dim];
	  	let total: number = 0

	  	units.forEach( item => {
	  		let itemN = +item;
	  		total += itemN * eq.conv;
	  	})
      let total2Deacimal = this.number.transform(total, '1.0-2')
	  	return `${total2Deacimal} ${eq.unit}`;
  	}
  }

  totalSec(rep, seg, broken) {
  	let repN = +rep;
  	let segN = +seg;
  	let brokenN = +broken;

  	return repN + segN + brokenN;
  }

}
