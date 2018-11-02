import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StaticDataProvider, ProductionDataProvider, ChartBuilderProvider } from '../../providers';

import { ChartDrawComponent } from '../chart-draw/chart-draw';

import * as moment from 'moment';

@Component({
  selector: 'acChart',
  templateUrl: 'acChart.html'
})
export class AcChartComponent implements OnInit {

  prodSubs: any;
  production: Array<any>;
  acChart: any;
  staticData: any;
  equivalences: any

  date = moment();
  prodMonthObj: number = 8000;
  unit = 'm2';
  rangeDate:any = {lower: 33, upper: 60};

  @ViewChild('prodAcChart', {read: ViewContainerRef}) prodAcChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private prodData: ProductionDataProvider,
    private staticDataP: StaticDataProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }
  
  ngOnInit() {
    this.prodSubs = this.prodData.getProduction().subscribe( (prod: Array<any>) => {
      this.staticData = this.staticDataP.data.produccion;
      this.production = prod;
      this.acProdData();
    });
	}

  ngAfterViewChecked() {
    this.setWidth();
  }

  ngOnDestroy() {
    this.prodSubs.unsubscribe();
  }

  acProdData() {
    let labels: Array<any> = [];
    let finishedProd: Array<any> = [];
    let second: Array<any> = [];
    let objLine: Array<any> = [];
    let month = `${this.date.format('M')}-${this.date.format('Y')}`;
    let monthsDays = this.date.daysInMonth();
    let dailyProdObj = this.prodMonthObj/monthsDays;

    let filtered = this.production.filter( log => {
      const date = `${moment(log.date).format('M')}-${moment(log.date).format('Y')}`;
      // return (moment(log.date).format('M') === month &&
      return (date === month &&
      this.chartBuilder.isFinished(log) &&
        this.staticData.equivalences[log.dim].unit === this.unit)
    });

    let filteredObj = this.chartBuilder.buildFilteredProdObj(filtered);

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

    this.buildAcChart(labels, datasets);

  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months')
    this.acProdData();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months')
    this.acProdData();
  }

  buildAcChart(labels, datasets) {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ChartDrawComponent);
    if (this.acChart) { this.acChart.destroy() }
    this.acChart = this.prodAcChartEl.createComponent(childComponent)
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
          label: (tooltipItem) => this.chartBuilder.formatChartNumber(tooltipItem.yLabel, '1.0-2')
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
