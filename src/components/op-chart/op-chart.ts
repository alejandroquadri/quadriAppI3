import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ChartBuilderProvider, CrmDataProvider } from '../../providers';

import { ChartDrawComponent } from '../chart-draw/chart-draw';
import { SortPipe, FieldFilterPipe } from '../../pipes';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'op-chart',
  templateUrl: 'op-chart.html'
})
export class OpChartComponent implements OnInit {

  @ViewChild('opChart', {read: ViewContainerRef}) opChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  opChart: any;
  opSubs: any;
  opList: any;

  salesMan = '';

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private crmData: CrmDataProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sort: SortPipe,
    private fieldFilter: FieldFilterPipe
  ) {
  }

  ngOnInit() {
  	this.opSubs = this.crmData.getOpsListSimple().subscribe( ops => {
  		this.opList = ops;
  		this.buildOpData();
  	})
  }

  ngAfterViewChecked() {
    this.setWidth();
  }

  setWidth() {
    if (this.opChart) {
      this.opChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    }
  }

  buildOpData() {
  	let opObj = {};
  	let labels;
  	let pendiente = [];
  	let cerrado = [];
    let rechazado = [];
    let filteredList;

    filteredList = this.fieldFilter.transform(this.opList, ['salesRep'], [this.salesMan], false);
    console.log(filteredList);

  	filteredList.forEach( op => {
  		if (!opObj[op.closeMonth]) {
  			opObj[op.closeMonth] = {
  				pendiente: 0,
  				cerrado: 0,
  				rechazado: 0
  			};
  			opObj[op.closeMonth][op.status.toLowerCase()] += op.total;
  		} else {
  			opObj[op.closeMonth][op.status.toLowerCase()] += op.total;
  		}
  	});  	
    labels = Object.keys(opObj);
    labels = this.sort.transform(labels,'', true, false);
  	labels.forEach( month => {
  		pendiente.push(opObj[month].pendiente);
  		cerrado.push(opObj[month].cerrado);
  		rechazado.push(opObj[month].rechazado);
  	})

  	let datasets = [
  		this.chartBuilder.buildDatasets(pendiente, 'pendiente', 'rgba(255, 153, 0, 1)', 'rgba(255, 153, 0, 0.8)'),
  		this.chartBuilder.buildDatasets(cerrado, 'cerrado', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.8)'),
  		this.chartBuilder.buildDatasets(rechazado, 'rechazado', 'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.8)')
  	]

  	this.buildStockChart(labels, datasets);

  }

  buildStockChart(labels, datasets, nArts?: number) {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ChartDrawComponent);
    if (this.opChart) { this.opChart.destroy() }
    this.opChart = this.opChartEl.createComponent(childComponent);
    this.opChart.instance.options = this.chartOptions();
    this.opChart.instance.xStacked = true;
    this.opChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    this.opChart.instance.chartType = 'bar';
    this.opChart.instance.labels = labels;
    this.opChart.instance.datasets = datasets;
  }

  chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
          ticks: {
              callback: (value, index, values) => this.chartBuilder.formatChartNumber(value, '1.0')
          },
        }]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem) => this.chartBuilder.formatChartNumber(tooltipItem.yLabel, '1.0')
        }
      }
    }
  }

  

}
