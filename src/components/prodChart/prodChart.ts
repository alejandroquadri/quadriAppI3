import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StaticDataProvider, ProductionDataProvider, ChartBuilderProvider } from '../../providers';

import { SortPipe } from '../../pipes';

import { ChartDrawComponent } from '../chart-draw/chart-draw';

import * as moment from 'moment';

@Component({
  selector: 'prodChart',
  templateUrl: 'prodChart.html'
})
export class ProdChartComponent implements OnInit {

  @ViewChild('prodChart', {read: ViewContainerRef}) prodChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  prodSubs: any;
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
    private componentFactoryResolver: ComponentFactoryResolver,
    private sortPipe: SortPipe,
  ) {
  }

  ngOnInit() {
		this.prodSubs = this.prodData.getProduction().subscribe( (prod: Array<any>) => {
      this.production = prod;
      this.filteredProdData();
    });
	}

  ngAfterViewChecked() {
    this.setWidth();
  }

  ngOnDestroy() {
    this.prodSubs.unsubscribe();
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

    let filteredObj = this.chartBuilder.buildFilteredProdObj(filtered);
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

    this.buildProdChart(labels, datasets);    
  }

  buildProdChart(labels, datasets) {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ChartDrawComponent);
    if (this.prodChart) { this.prodChart.destroy() }
    this.prodChart = this.prodChartEl.createComponent(childComponent);
    this.prodChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    this.prodChart.instance.chartType = 'line';
    this.prodChart.instance.options = this.chartOptions();
    this.prodChart.instance.labels = labels;
    this.prodChart.instance.datasets = datasets;
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
    if (this.prodChart) {
      this.prodChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    }
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
