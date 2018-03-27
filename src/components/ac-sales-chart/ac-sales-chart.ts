import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { SalesDataProvider, ChartBuilderProvider } from '../../providers';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import { map } from 'rxjs/operators';

import { ChartDrawComponent } from '../chart-draw/chart-draw';

import * as moment from 'moment';

@Component({
  selector: 'ac-sales-chart',
  templateUrl: 'ac-sales-chart.html'
})
export class AcSalesChartComponent implements OnInit {

  salesSubs: any;
  objectiveSubs: any;
  obsSubs: any;
  sales: any;
  objectives: any;
  acChart: any;
  date = moment();

  salesMan = '';
  brand: string = '';
  eq = 1600000;
  obj = this.eq * 1.1;

  totalSales = 0;
  toCom = 0;

  @Input() showPrize: any = true;
  @ViewChild('salesAcChart', {read: ViewContainerRef}) salesAcChartEl: ViewContainerRef;
  @ViewChild('chartContainer') chartContainer;

  constructor(
  	private chartBuilder: ChartBuilderProvider,
    private salesData: SalesDataProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
    let today = moment();
    let end = today.format('YYYYMMDD');
    let start = today.date(1).subtract(6, 'months').format('YYYYMMDD');
    // this.objectiveSubs = this.salesData.getObjectives()
    // .pipe( map( res => res.json()));
    this.objectiveSubs = this.salesData.getObjectives();
    this.salesSubs = this.salesData.getRevenue(start, end)
    .pipe( map( res => res.json()));
    
    this.obsSubs = Observable.combineLatest(this.salesSubs, this.objectiveSubs, (sales: any, objectives: any) => ({sales, objectives}))
    .subscribe( pair => {
      this.sales = pair.sales.data;
      // this.objectives = pair.objectives.data;
      // this.eq = this.objectives[0][0].replace(/\./g,'');
      // this.obj = this.objectives[1][0].replace(/\./g,'');
      this.eq = pair.objectives.eq;
      this.obj = pair.objectives.obj;
      this.salesDataFilter();
    })
  }

  ngAfterViewChecked() {
    this.setWidth();
  }

  ngOnDestroy() {
    this.obsSubs.unsubscribe();
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
      let finishedQuantity: Array<any> = [];
      let objLine: Array<any> = [];
      let eqLine: Array<any> = [];
      let month = this.date.format('MM/YY');
      let monthDays = this.date.daysInMonth();
      let eq = this.eq;
      let salesObj = this.obj
      // let eq = this.objectives[0][0];
      // let salesObj = this.objectives[0][1];
      if (this.salesMan !== '') {
        eq = eq/2;
        salesObj = salesObj/2
      }
      let dailyEqSales = eq / monthDays
      let dailyObjSales = salesObj / monthDays;
      let totalSales = 0;
      let totalQuantity = 0;
      let totalObjSales = 0;
      let totalEqSales = 0;

      let filtered = this.sales.filter( sale => {
        let momentDate = moment(sale.fecha).format('MM/YY');
        return (momentDate === month && 
          this.salesManFilter(sale.vendedor) &&
          this.brandFilter(sale.marca)
        )
      });

      let obj = this.buildSalesObj(filtered);

      for (let i=1, n= monthDays ; i <= n; i++) {
        let date = this.date.date(i).format('YYYY-MM-DD');
        labels.push(i);
        if (obj[date]) {
          totalSales += obj[date].total;
          totalQuantity +=obj[date].quantity;
        }
        totalObjSales += dailyObjSales;
        totalEqSales += dailyEqSales;
        finishedQuantity.push(totalQuantity);
        finishedSales.push(totalSales);
        objLine.push(totalObjSales);
        eqLine.push(totalEqSales);
      }
      
      this.totalSales = finishedSales[finishedSales.length-1];
      this.eq/2 - this.totalSales > 0 ? this.toCom = this.eq/2 - this.totalSales : this.toCom = 0 ;

      let datasets = [
        this.chartBuilder.buildDatasets(finishedSales, 'ventas', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)', 'A'), 
        this.chartBuilder.buildDatasets(eqLine, 'equilibrio',  'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)', 'A'), 
        this.chartBuilder.buildDatasets(objLine , 'objetivo', 'rgba(51, 102, 204, 1)', 'rgba(51, 102, 204, 0.2)', 'A'),
        this.chartBuilder.buildDatasets(finishedQuantity , 'cantidad', 'rgba(255, 153, 0, 1)', 'rgba(255, 153, 0, 0.2)', 'B')
      ];
      this.buildAcChart(labels, datasets);
    }
    
  }

  buildSalesObj(filteredArray: Array<any>, monthly?: boolean) {
    let filteredObj = {};

    filteredArray.forEach( sale => {
      let total = + sale.total
      let cant = + sale.cantidad;
      let quantity;
      let date;

      if (sale.unidad_medida === "M2") {
        quantity = cant;
      } else {
        quantity = 0;
      }

      if (monthly) {
        date = moment(sale.fecha).format('YYYY-MM');
      } else {
        date = moment(sale.fecha).format('YYYY-MM-DD');
      }
      if (!filteredObj[date]) {
        filteredObj[date] = {
          total: total,
          quantity: quantity
        }
      } else {
        filteredObj[date].total += total;
        filteredObj[date].quantity += quantity;
      }
    })

    return filteredObj;
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

  brandFilter(brand: string) {
    let result
    switch (this.brand) {
      case "Quadri":
        if (brand === 'Quadri - Quadri') {
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
        yAxes: [
          {
            ticks: {
              callback: (value, index, values) => this.chartBuilder.formatChartNumber(value, '1.0')
            },
            id: 'A',
            type: 'linear',
            position: 'left'
          },
          {
            ticks: {
              callback: (value, index, values) => this.chartBuilder.formatChartNumber(value, '1.0')
            },
            id: 'B',
            type: 'linear',
            position: 'right'
          }
        ]
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
