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

	@ViewChild('lineCanvas') lineCanvas;
	chart: any;

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
    this.buildGraph(data, labels);
  }

  buildGraph(data, labels) {
  	if( data.length && labels.length ) {
  		this.chart = new Chart(this.lineCanvas.nativeElement, {
	      type: 'line',
	      data: {
			    labels: labels,
			    datasets: [
		        {	
		        	label: "Log de peso",
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
		        } ,
		        {	
		        	label: "Log de peso",
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
	            data: [23,30,16],
	            spanGaps: false,
		        }
			    ]
				},
				options: {
					legend: {
						display: false
					}
				}
	    });
  	}
  }

}
