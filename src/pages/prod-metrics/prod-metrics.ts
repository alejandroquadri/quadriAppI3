import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavParams, ViewController, Platform} from 'ionic-angular';

import { StaticDataProvider, ProductionDataProvider } from '../../providers';
import { FieldFilterPipe } from '../../pipes';

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

	production: any;

  constructor(
  	public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider,
    private fieldFilterPipe: FieldFilterPipe
  ) {}

  ionViewDidLoad() {
  	this.prodData.getProduction().subscribe( prod => {
  		this.production = prod;
  	});

    console.log('ionViewDidLoad ProdMetricsPage');
    const data1 = [400, 434, 402, 450, 460];
    const data2 = [23,30,16,15,50];
    const data3 = [0,20,40,60,80];
    const labels = ['lun', 'mar', 'mier', 'jue', 'vier'];
    this.buildChart(labels, this.prodChartEl.nativeElement, data1, data2)
    this.buildChart(labels, this.prodAcChartEl.nativeElement, data1, data3);
  }

  buildChart(labels: Array<any>, element, data: Array<any>, data2?: Array<any>, data3?: Array<any>, data4?: Array<any>, data5?: Array<any>) {
  	if( data.length && labels.length ) {
  		const chart = new Chart(element, 
			  this.chartOpts(labels, [
			  	this.chartData(data), 
			  	this.chartData(data2), 
			  	this.chartData(data3), 
			  	this.chartData(data4), 
			  	this.chartData(data5)
			  	])
		    );
  	}
  }

  chartOpts(labels: Array<any>, data: Array<any>) {
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

  chartData(data: Array<any>) {
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
