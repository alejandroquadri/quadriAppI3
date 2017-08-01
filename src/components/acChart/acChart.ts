import { Component, ViewChild, OnInit, Renderer, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StaticDataProvider, ProductionDataProvider, ChartBuilderProvider } from '../../providers';

import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'acChart',
  templateUrl: 'acChart.html'
})
export class AcChartComponent implements OnInit {


  production: Array<any>;
  acChart: any;

  date = moment();
  prodMonthObj: number = 8000;
  unit = 'm2';
  rangeDate:any = {lower: 33, upper: 60};

  @ViewChild('prodAcChart', {read: ViewContainerRef}) prodAcChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private prodData: ProductionDataProvider,
    private staticData: StaticDataProvider,
  	private renderer: Renderer,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
    this.prodData.prodObs.subscribe( (prod: Array<any>) => {
      this.production = prod;
      this.acProdData();
    });

	}

  setWidth() {
    this.chartBuilder.chartsData.acChart.width = this.chartContainer.nativeElement.clientWidth;
  }

  acProdData() {
    let labels: Array<any> = [];
    let finishedProd: Array<any> = [];
    let second: Array<any> = [];
    let objLine: Array<any> = [];
    let month = this.date.format('M');
    let monthsDays = this.date.daysInMonth();
    let dailyProdObj = this.prodMonthObj/monthsDays;

    let filtered = this.production.filter( log => {
      return (moment(log.date).format('M') === month &&
        this.chartBuilder.isFinished(log) &&
        this.staticData.equivalences[log.dim].unit === this.unit)
    });

    let filteredObj = this.chartBuilder.buildFilteredObj(filtered);

    let totalProd = 0;
    let totalseg = 0;
    let totalObj = 0;

    for (let i=1 ; i <= monthsDays ; i++) {
      let date = this.date.date(i).format('YYYY-MM-DD'); //asigno a la fecha
      labels.push(i);
      if (filteredObj[date]) {
        totalProd += filteredObj[date].prod;
        totalseg += filteredObj[date].seg;
      }
      totalObj += dailyProdObj;
      finishedProd.push(totalProd);
      second.push(totalseg);
      objLine.push(totalObj);
    }

    let datasets = [
      this.chartBuilder.buildDatasets(finishedProd, 'produccion', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)'), 
      this.chartBuilder.buildDatasets(second, 'segunda',  'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)'), 
      this.chartBuilder.buildDatasets(objLine , 'objetivo', 'rgba(51, 102, 204, 1)', 'rgba(51, 102, 204, 0.2)')
    ];

    this.chartBuilder.chartsData['acChart'] = {
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
      this.buildAcChart();
    })

  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months')
    this.acProdData();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months')
    this.acProdData();
  }

  buildAcChart() {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(AcChartHelperComponent);
    if (this.acChart) { this.acChart.destroy() }
    this.acChart = this.prodAcChartEl.createComponent(childComponent);
  }


}

@Component({
  selector: 'acChartGraph',
  template: 
  `
  <div class="chart" (window:resize)="setChartSize()">
    <canvas #chart></canvas>
  </div>
  `
})
export class AcChartHelperComponent implements OnInit {

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
    // console.log(this.chartBuilder.contentWidth);
    // this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.chartBuilder.contentWidth-52}px`);
    this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.chartBuilder.chartsData.acChart.width}px`);
  }

}
