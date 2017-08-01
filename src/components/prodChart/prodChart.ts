import { Component, ViewChild, OnInit, Renderer, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StaticDataProvider, ProductionDataProvider, ChartBuilderProvider } from '../../providers';

import { FieldFilterPipe, SortPipe } from '../../pipes';

import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'prodChart',
  templateUrl: 'prodChart.html'
})
export class ProdChartComponent implements OnInit {

  @ViewChild('prodChart', {read: ViewContainerRef}) prodChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  production: any;
  prodChart: any;

  machFilter;
  colorFilter;
  dimFilter;
  drawingFilter;
  typeFilter = 'PT';
  unit2 = 'm2';

  

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private prodData: ProductionDataProvider,
    private staticData: StaticDataProvider,
    private renderer: Renderer,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sortPipe: SortPipe,
  ) {
  }

  ngOnInit() {
		this.prodData.prodObs.subscribe( (prod: Array<any>) => {
      this.production = prod;
      this.filteredProdData();
    });
	}

  setWidth() {
    this.chartBuilder.chartsData.prodChart.width = this.chartContainer.nativeElement.clientWidth;
  }

  filteredProdData() {
    let labels: Array<any> = [];
    let prod: Array<any> = [];
    let second: Array<any> = [];

    let filtered = this.production.filter( log => {
      return ( 
        this.addFilter(this.machFilter, log.machine) &&
        this.addFilter(this.colorFilter, log.color) &&
        this.addFilter(this.dimFilter, log.dim) &&
        this.addFilter(this.drawingFilter, log.drawing) &&
        this.typeFilterRet(this.typeFilter, log)  &&
        this.staticData.equivalences[log.dim].unit === this.unit2
      )
    });

    let filteredObj = this.chartBuilder.buildFilteredObj(filtered);
    let filObjKeys = this.sortPipe.transform(Object.keys(filteredObj),'',true);

    filObjKeys.forEach( key => {
      labels.push(moment(key).format('D/M/YY'));
      prod.push(filteredObj[key].prod);
      second.push(filteredObj[key].seg);
    })

    let datasets = [
      this.chartBuilder.buildDatasets(prod, 'produccion', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)'), 
      this.chartBuilder.buildDatasets(second, 'segunda',  'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)')
    ];

    this.chartBuilder.chartsData['prodChart'] = {
      chartType: 'line',
      labels: labels,
      datasets: datasets,
      width: this.chartContainer.nativeElement.clientWidth
    }
    let size = new Promise( (resolve, reject) => {
      this.setWidth();
      resolve();
    });
    size.then( () => {
      this.buildProdChart();
    })
    
  }

  buildProdChart() {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ProdChartHelperComponent);
    if (this.prodChart) { this.prodChart.destroy() }
    this.prodChart = this.prodChartEl.createComponent(childComponent);
  }

  addFilter(filter, log) {
    if (!filter || filter === '') {
      return true;
    } else {
      if( log === filter) {
        return true;
      } else {
        return false;
      }
    }
  }

  typeFilterRet(type, log) {
    if (!type || type === '') {
      return true;
    } else if (type === 'PT') {
      return this.chartBuilder.isFinished(log) ? true: false;
    } else {
      return this.chartBuilder.isFinished(log) ? false: true;
    }
  }

}

@Component({
  selector: 'prodChart',
  template: 
  `
  <div class="chart" (window:resize)="setChartSize()">
    <canvas #chart></canvas>
  </div>
  `
})
export class ProdChartHelperComponent implements OnInit {

  @ViewChild('chart') chartEl;

  constructor(
    private chartBuilder: ChartBuilderProvider,
    private renderer: Renderer
  ) {
  }

  ngOnInit() {
    console.log('Init');
    this.setChartSize();
    this.chartBuilder.buildChart(
      this.chartEl.nativeElement, 
      this.chartBuilder.chartsData.prodChart.chartType, 
      this.chartBuilder.chartsData.prodChart.labels, 
      this.chartBuilder.chartsData.prodChart.datasets
    );
  }

  setChartSize() {
    this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.chartBuilder.chartsData.prodChart.width}px`);
  }

}
