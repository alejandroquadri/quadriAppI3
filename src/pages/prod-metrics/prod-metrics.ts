import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { IonicPage, Content, NavController, NavParams, ViewController, Platform} from 'ionic-angular';
import { DecimalPipe } from '@angular/common';

import { StaticDataProvider, ProductionDataProvider, ChartBuilderProvider } from '../../providers';
import { FieldFilterPipe, SortPipe } from '../../pipes';
import { AcChartComponent, ProdChartComponent } from '../../components';

import Chart from 'chart.js';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {

  @ViewChild(Content) content: Content;

  @ViewChild('prodAcChart', {read: ViewContainerRef}) prodAcChartEl: ViewContainerRef;
  @ViewChild('prodChart', {read: ViewContainerRef}) prodChartEl: ViewContainerRef;

	production: Array<any>;
  date = moment();
  prodMonthObj: number = 8000;
  unit = 'm2';
  rangeDate:any = {lower: 33, upper: 60};

  machFilter;
  colorFilter;
  dimFilter;
  drawingFilter;
  typeFilter = 'PT';
  unit2 = 'm2';

  acChart: any;
  prodChart: any;

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    private componentFactoryResolver: ComponentFactoryResolver,
    private staticData: StaticDataProvider,
    private prodData: ProductionDataProvider,
    private chartBuilder: ChartBuilderProvider,
    private fieldFilterPipe: FieldFilterPipe,
    private sortPipe: SortPipe,
    private number: DecimalPipe
  ) {
    
  }

  ionViewDidLoad() {
    this.chartBuilder.contentWidth = this.content._elementRef.nativeElement.clientWidth;
  	this.prodData.getProduction().subscribe( prod => {
  		this.production = prod;
      this.acProdData();
      this.filteredProdData();
  	});
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
        this.isFinished(log) &&
        this.staticData.equivalences[log.dim].unit === this.unit)
    });

    let filteredObj = this.buildFilteredObj(filtered);

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
      datasets: datasets
    }

    this.buildAcChart();
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

    let filteredObj = this.buildFilteredObj(filtered);
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
      datasets: datasets
    }

    this.buildProdChart();
  }

  toSalesUnit(unit: string, dim) {
    let eq = this.staticData.equivalences[dim];
    let total: number = 0

    let itemN = +unit;
    total += itemN * eq.conv;

    return total;
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months')
    this.acProdData();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months')
    this.acProdData();
  }

  isFinished(log: any) {
    if (log.machine == 'Breton' ||
        log.machine == 'Lineal' ||
        log.machine == 'Pasado tablas' ||
        log.machine == 'Biseladora zocalos' ||
        log.machine == 'Desmolde' ||
        log.machine == 'Granalladora' ||
        log.machine == 'Biseladora') {
      return true;
    } else { return false; }
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
      return this.isFinished(log) ? true: false;
    } else {
      return this.isFinished(log) ? false: true;
    }
  }

  buildFilteredObj (filteredArray: Array<any>) {
    let filteredObj = {};

    filteredArray.forEach( log => {
      let prod = this.toSalesUnit(log.prod, log.dim);
      let seg = this.toSalesUnit(log.seg, log.dim);
      let broken = this.toSalesUnit(log.broken, log.dim);
      let rep = +this.toSalesUnit(log.rep, log.dim);
      if (!filteredObj[log.date]) {
        filteredObj[log.date] = {
          prod: prod,
          seg: seg + broken + rep
        }
      } else {
        filteredObj[log.date].prod += prod;
        filteredObj[log.date].seg += seg + broken + rep;
      }
    })
    return filteredObj;
  }

  onResize(event) {
    this.chartBuilder.contentWidth = this.content._elementRef.nativeElement.clientWidth;
  }

  buildAcChart() {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(AcChartComponent);
    if (this.acChart) { this.acChart.destroy() }
    this.acChart = this.prodAcChartEl.createComponent(childComponent);
  }

  buildProdChart() {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ProdChartComponent);
    if (this.prodChart) { this.prodChart.destroy() }
    this.prodChart = this.prodChartEl.createComponent(childComponent);
  }

}
