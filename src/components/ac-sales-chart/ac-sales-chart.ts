import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SalesDataProvider, ChartBuilderProvider } from '../../providers';
import { map } from 'rxjs/operators';

import { ChartDrawComponent } from '../chart-draw/chart-draw';

import * as moment from 'moment';

@Component({
  selector: 'ac-sales-chart',
  templateUrl: 'ac-sales-chart.html'
})
export class AcSalesChartComponent implements OnInit {

  salesSubs: any;
  sales: any;
  acChart: any;
  date = moment();

  salesMan = '';
  eq = 1600000;
  obj = this.eq * 1.1;

  @ViewChild('salesAcChart', {read: ViewContainerRef}) salesAcChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private salesData: SalesDataProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
  	this.salesSubs = this.salesData.getRevenue()
  	.pipe(
      map( res => res.json())
     )
  	.subscribe( data => {
  		this.sales = data.data;
      this.salesDataFilter();
  	});
  }

  ngAfterViewChecked() {
    this.setWidth();
  }

  ngOnDestroy() {
    this.salesSubs.unsubscribe();
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months')
    this.salesDataFilter();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months')
    this.salesDataFilter();
  }

  salesDataFilter() {
    if (this.sales) {
      let labels: Array<any> = [];
      let finishedSales: Array<any> = [];
      let objLine: Array<any> = [];
      let eqLine: Array<any> = [];
      let month = this.date.format('MM/YY');
      let monthDays = this.date.daysInMonth();
      let eq = this.eq;
      let salesObj = this.obj
      if (this.salesMan !== '') {
        eq = eq/2;
        salesObj = salesObj/2
      }
      let dailyEqSales = eq / monthDays
      let dailyObjSales = salesObj / monthDays;
      let totalSales = 0;
      let totalObjSales = 0;
      let totalEqSales = 0

      let filtered = this.sales.filter( sale => {
        // esto es para que la fecha salga en este formato (2017-11-22), sino se queja y tira una advertencia
        let ISODate = sale.fecha_documento.replace(/\//g, "");
        let momentDate = moment(ISODate, "YYYYMMDD").format('MM/YY')
        return (momentDate === month && 
          this.salesManFilter(sale.nombreoriginantetr))
      })

      let obj = this.chartBuilder.buildSalesObj(filtered);

      for (let i=1, n= monthDays ; i <= n; i++) {
        let date = this.date.date(i).format('YYYY-MM-DD');
        labels.push(i);
        if (obj[date]) {
          totalSales += obj[date].total;
        }
        totalObjSales += dailyObjSales;
        totalEqSales += dailyEqSales;
        finishedSales.push(totalSales);
        objLine.push(totalObjSales);
        eqLine.push(totalEqSales);
      }
      let datasets = [
        this.chartBuilder.buildDatasets(finishedSales, 'ventas', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)'), 
        this.chartBuilder.buildDatasets(eqLine, 'equilibrio',  'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)'), 
        this.chartBuilder.buildDatasets(objLine , 'objetivo', 'rgba(51, 102, 204, 1)', 'rgba(51, 102, 204, 0.2)')
      ];
      this.buildAcChart(labels, datasets);
    }
    
  }

  salesManFilter(salesMan) {
    let result
    switch (this.salesMan) {
      case "Alejandra Roldan":
        if (salesMan === 'Alejandra Roldan') {
          result = true;
        } else {
          result = false;
        }
      break;
      case "Alberto Tarruella":
        if (salesMan === 'Tarruella Alberto Horacio ') {
           result = true;
        } else {
          result = false;
        }
      break;
      default:
        result = true;
        break;
    }
    return result;
  }

  buildAcChart(labels, datasets) {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ChartDrawComponent);
    if (this.acChart) { this.acChart.destroy() }
    this.acChart = this.salesAcChartEl.createComponent(childComponent)
    this.acChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    this.acChart.instance.options = this.chartOptions();
    this.acChart.instance.chartType = 'line';
    this.acChart.instance.labels = labels;
    this.acChart.instance.datasets = datasets;
  }

  chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            callback: (value, index, values) => this.chartBuilder.formatChartNumber(value, '1.0')
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem) => this.chartBuilder.formatChartNumber(tooltipItem.yLabel, '1.0')
        }
      }
    }
  }

  setWidth() {
    if (this.acChart) { 
      this.acChart.instance.width = this.chartContainer.nativeElement.clientWidth; 
    }
  }

}
