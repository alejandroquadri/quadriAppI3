import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';

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

  constructor(
  	public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdMetricsPage');
    const data = [400, 434, 402, 450, 460];
    const labels = ['lun', 'mar', 'mier', 'jue', 'vier'];
    this.buildProdChart(data, labels);
    this.buildProdAcChart(data, labels);
  }

  buildProdChart(data, labels) {
  	if( data.length && labels.length ) {
  		const chart = new Chart(this.prodChartEl.nativeElement, 
			  this.chartOpts(labels, [this.chartData(data), this.chartData([23,30,16,15,50])])
		    );
  	}
  }

  buildProdAcChart(data, labels) {
  	if( data.length && labels.length ) {
  		const chart = new Chart(this.prodAcChartEl.nativeElement, 
			  this.chartOpts(labels, [this.chartData(data), this.chartData([0,20,40,60,80])])
		    );
  	}
  }

  chartOpts(labels, data: Array<any>) {
  	let opts = {
	      type: 'line',
	      data: {
			    labels: labels,
			    datasets: data
				},
				options: {
					legend: {
						display: false
					}
				}
	    }
    return opts;
  }

  chartData(data) {
  	let dataset = {	
    	// label: "Log de peso",
      fill: true,
      // lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data,
      spanGaps: false,
    } 
    return dataset;
  }

}
