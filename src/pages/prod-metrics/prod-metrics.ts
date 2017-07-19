import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform} from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';
import { FieldFilterPipe, SortPipe } from '../../pipes';
import { DecimalPipe } from '@angular/common';

import Chart from 'chart.js';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {

	@ViewChild('prodChart') prodChartEl;
	@ViewChild('prodAcChart') prodAcChartEl;

	production: Array<any>;
  date = moment();
  prodMonthObj: number = 8000;
  unit = 'm2';

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private sortPipe: SortPipe,
    private number: DecimalPipe
  ) {
  }

  ionViewDidLoad() {
  	this.prodData.getProduction().subscribe( prod => {
  		this.production = prod;
      this.finishedProdData();
  	});

    console.log('ionViewDidLoad ProdMetricsPage');
    const data1 = [400, 434, 402, 450, 460];
    const data2 = [23,30,16,15,50];
    const data3 = [0,20,40,60,80];
    const labels = ['lun', 'mar', 'mier', 'jue', 'vier'];
    let datasets = [this.datasets(data1), this.datasets(data2)];
    this.buildChart(this.prodChartEl.nativeElement, 'line', labels, datasets)
  }

  buildChart(element, chartType: string, labels: Array<any>, datasets: Array<any>) {
    new Chart(element, {
        type: chartType,
        data: {
          labels: labels,
          datasets: datasets
        }
      }
    );

  }

  datasets(data: Array<any>, label?: string, color?: string, backgroundColor?: string) {
  	let dataset = {	
    	label: label || null,
      fill: true,
      // lineTension: 0.1,
      backgroundColor: backgroundColor || "rgba(75,192,192,0.4)",
      borderColor: color || "rgba(75,192,192,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: color || "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color || "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data,
      spanGaps: false,
    } 
    return dataset;
  }

  finishedProdData() {
    // let filtered: Array<any>;
    let labels: Array<any> = [];
    let finishedProd: Array<any> = [];
    let second: Array<any> = [];
    let objLine: Array<any> = [];
    let month = this.date.format('M');
    let monthsDays = this.date.daysInMonth();
    let dailyProdObj = this.prodMonthObj/monthsDays;
    let filteredObj = {};

    let filtered = this.production.filter( log => {
      if ( moment(log.date).format('M') === month &&
        (log.machine == 'Breton' ||
        log.machine == 'Lineal' ||
        log.machine == 'Pasado tablas' ||
        log.machine == 'Biseladora zocalos' ||
        log.machine == 'Desmolde' ||
        log.machine == 'Granalladora' ||
        log.machine == 'Biseladora') &&
        this.staticData.equivalences[log.dim].unit === this.unit
        ) {
        return true;
      }
    });

    filtered.forEach( log => {
      let prod = this.toSalesUnit(log.prod, log.dim);
      let seg = this.toSalesUnit(log.seg, log.dim);
      let broken = this.toSalesUnit(log.broken, log.dim);
      let rep = +this.toSalesUnit(log.rep, log.dim);
      if (!filteredObj[log.date]) {
        filteredObj[log.date] = {
          prod: prod,
          seg: seg + broken + rep
        }
      } else {
        filteredObj[log.date].prod += prod;
        filteredObj[log.date].seg += seg + broken + rep;
      }
    })

    let totalProd = 0;
    let totalseg = 0;
    let totalObj = 0;

    for (let i=1 ; i <= monthsDays ; i++) {
      let date = this.date.date(i).format('YYYY-MM-DD'); //asigno a la fecha
      labels.push(i);
      if (filteredObj[date]) {
        totalProd += filteredObj[date].prod;
        totalseg += filteredObj[date].seg;
      }
      totalObj += dailyProdObj;
      finishedProd.push(totalProd);
      second.push(totalseg);
      objLine.push(totalObj);
    }

    let datasets = [
      this.datasets(finishedProd, 'produccion', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)'), 
      this.datasets(second, 'segunda',  'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)'), 
      this.datasets(objLine , 'objetivo', 'rgba(51, 102, 204, 1)', 'rgba(51, 102, 204, 0.2)')
    ];

    this.buildChart(this.prodAcChartEl.nativeElement, 'line', labels, datasets );
  }

  toSalesUnit(unit: string, dim) {
    let eq = this.staticData.equivalences[dim];
    let total: number = 0

    let itemN = +unit;
    total += itemN * eq.conv;

    // let total2Deacimal = this.number.transform(total, '1.0-2')
    return total;
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months')
    this.finishedProdData();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months')
    this.finishedProdData();
  }

  pushPrint() {
    this.navCtrl.push('ProdSignPage', {production: this.production});
  }

}
