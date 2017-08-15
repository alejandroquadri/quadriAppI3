import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StaticDataProvider, SalesDataProvider, ChartBuilderProvider } from '../../providers';
import 'rxjs/add/operator/map';

import { ChartDrawComponent } from '../chart-draw/chart-draw';

import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'ac-sales-chart',
  templateUrl: 'ac-sales-chart.html'
})
export class AcSalesChartComponent implements OnInit {

  sales: any;
  acChart: any;
  date = moment();

  salesMan = '';
  obj = 1600000;

  @ViewChild('salesAcChart', {read: ViewContainerRef}) salesAcChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private salesData: SalesDataProvider,
    private staticData: StaticDataProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
  	this.salesData.getRevenue()
  	.map( res => res.json())
  	.subscribe( data => {
  		this.sales = data.data;
      console.log(this.sales);
      this.salesDataFilter();
  	})
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
      let month = this.date.format('M');

      let filtered = this.sales.filter( sale => {
        return (moment(sale.fecha_documento).format('M') === month && 
          this.salesManFilter(sale.nombreoriginantetr))
      })
      console.log(filtered);
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
    this.acChart.instance.chartType = 'line';
    this.acChart.instance.labels = labels;
    this.acChart.instance.datasets = datasets;
  }

  setWidth() {
    if (this.acChart) { 
      this.acChart.instance.width = this.chartContainer.nativeElement.clientWidth; 
    }
  }

}
