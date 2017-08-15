import { Component, ViewChild, OnInit, Renderer, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StaticDataProvider, SalesDataProvider, ChartBuilderProvider } from '../../providers';
import 'rxjs/add/operator/map';

import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'ac-sales-chart',
  templateUrl: 'ac-sales-chart.html'
})
export class AcSalesChartComponent implements OnInit {

  sales: any;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private salesData: SalesDataProvider,
    private staticData: StaticDataProvider,
  	private renderer: Renderer,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
  	this.salesData.getRevenue()
  	.map( res => res.json())
  	.subscribe( data => {
  		this.sales = data.data;
  	})
  } 

}

@Component({
  selector: 'acSalesChartGraph',
  template: 
  `
  <div class="chart" (window:resize)="setChartSize()">
    <canvas #chart></canvas>
  </div>
  `
})
export class AcSalesChartHelperComponent implements OnInit {

  text: string;
  @ViewChild('chart') chartEl;

  constructor(
    private chartBuilder: ChartBuilderProvider,
    private renderer: Renderer
  ) {
  }

  ngOnInit() {
    console.log('Init');
    let size = new Promise( (resolve, reject) => {
      this.setChartSize();
      resolve();
    });
    size.then( () => {
      this.chartBuilder.buildChart(
        this.chartEl.nativeElement, 
        this.chartBuilder.chartsData.acChart.chartType, 
        this.chartBuilder.chartsData.acChart.labels, 
        this.chartBuilder.chartsData.acChart.datasets
      );
    })
  }

  setChartSize() {
    this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.chartBuilder.chartsData.acChart.width}px`);
  }

}
