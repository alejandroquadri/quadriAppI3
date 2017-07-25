import { Injectable } from '@angular/core';
import Chart from 'chart.js';

@Injectable()
export class ChartBuilderProvider {

	contentWidth: number;
	chartsData: any = {};

  constructor() {
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

  buildDatasets(data: Array<any>, label?: string, color?: string, backgroundColor?: string) {
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

}
