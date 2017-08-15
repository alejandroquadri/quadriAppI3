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
