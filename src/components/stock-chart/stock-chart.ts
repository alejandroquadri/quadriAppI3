import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SalesDataProvider, ChartBuilderProvider } from '../../providers';
import 'rxjs/add/operator/map';

import { ChartDrawComponent } from '../chart-draw/chart-draw';

@Component({
  selector: 'stock-chart',
  templateUrl: 'stock-chart.html'
})
export class StockChartComponent {

  stock: any;
  type: any;

  @ViewChild('stockChart', {read: ViewContainerRef}) stockChart: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private salesData: SalesDataProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
  	this.salesData.getStock()
  	.map( res => res.json())
  	.subscribe( data => {
  		this.stock = data.data;
  	})
  }

  stockFilter() {

  }

}
