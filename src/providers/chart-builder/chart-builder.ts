import { Injectable } from '@angular/core';
import { StaticDataProvider } from '../static-data/static-data';
import Chart from 'chart.js';
import * as moment from 'moment';

@Injectable()
export class ChartBuilderProvider {

	contentWidth: number;
	chartsData: any = {};

  constructor(
    private staticData: StaticDataProvider
  ) {
  }

  buildChart(element, chartType: string, labels: Array<any>, datasets: Array<any>, xStacked?: boolean, yStacked?: boolean) {
    return new Chart(element, {
        type: chartType,
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
        scales: {
          xAxes: [{
                stacked: xStacked || false
            }],
          yAxes: [{
                stacked: yStacked || false
            }]
          }
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

   isFinished(log: any) {
    if (log.machine == 'Breton' ||
        log.machine == 'Lineal' ||
        log.machine == 'Pasado tablas' ||
        log.machine == 'Biseladora zocalos' ||
        log.machine == 'Desmolde' ||
        log.machine == 'Granalladora' ||
        log.machine == 'Biseladora') {
      return true;
    } else { return false; }
  }

  buildFilteredProdObj (filteredArray: Array<any>) {
    let filteredObj = {};

    filteredArray.forEach( log => {
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
    return filteredObj;
  }

  buildSalesObj(filteredArray: Array<any>, monthly?: boolean) {
    let filteredObj = {};

    filteredArray.forEach( sale => {
      let total = + sale.total_importe
      let date;
      if (monthly) {
        date = moment(sale.fecha_documento).format('YYYY-MM');
      } else {
        date = moment(sale.fecha_documento).format('YYYY-MM-DD');
      }
      if (!filteredObj[date]) {
        filteredObj[date] = {
          total: total,
        }
      } else {
        filteredObj[date].total += total;
      }
    })

    return filteredObj;
  }

  toSalesUnit(unit: string, dim) {
    let eq = this.staticData.equivalences[dim];
    let total: number = 0

    let itemN = +unit;
    total += itemN * eq.conv;

    return total;
  }

}
