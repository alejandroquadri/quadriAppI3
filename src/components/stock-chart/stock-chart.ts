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
  type = '40x40 PT m2';
  stockChart: any;

  @ViewChild('stockChart', {read: ViewContainerRef}) stockChartEl: ViewContainerRef;
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
  		this.stockFilter();
  	})
  }

  ngAfterViewChecked() {
    this.setWidth();
  }

  stockFilter() {
    let labels: Array<any> = [];
    let general: Array<any> = [];
    let bloqueado: Array<any> = [];
    let reserved: Array<any> = [];

  	let filtered = this.stock.filter( art => {
        return ( art.marca === 'Quadri - Quadri' && 
          this.prodTypeFilter(art.dimension))
    });
    console.log(filtered);

    filtered.forEach( (art: any) => {
      labels.push(art.cod_producto);
      general.push(art.general);
      bloqueado.push(art.bloqueado);
      reserved.push(art.reservado);
    })

    let datasets = [
      this.chartBuilder.buildDatasets(general, 'stock', 'rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.8)'), 
      this.chartBuilder.buildDatasets(reserved, 'reservado',  'rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.8)'),
      this.chartBuilder.buildDatasets(bloqueado , 'bloqueado', 'rgba(255, 153, 0, 1)', 'rgba(255, 153, 0, 0.8)')
    ];

    this.buildStockChart(labels, datasets, labels.length);

  }

  prodTypeFilter(dim) {
  	let result
    switch (this.type) {
    	case '40x40 PT m2':
    		if (dim === '40 x 40'||
						dim === '40 x 40 durella') {
          result = true;
        } else {
          result = false;
        }
      break;
      case '60x40 PT m2':
        if (dim === '60 x 60' ) {
          result = true;
        } else {
          result = false;
        }
      break;
      case 'otros PT m2':
        if (dim === '20 x 20' ||
            dim === '50 x 50' ||
            dim === '60 x 60' ) {
          result = true;
        } else {
          result = false;
        }
      break;
      case 'PT ml':
      if (dim === "10 x 40" ||
		      dim === '40 x 50') {
          result = true;
        } else {
          result = false;
        }
      break;
      case 'PT unidades': 
      if (
	      dim === "Pastina" ||
	      dim === '30 x 30' ||
	      dim === '150 mm' ||
				dim === '180 mm' ||
				dim === '60') {
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

  setWidth() {
    if (this.stockChart) {
      this.stockChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    }
  }

  buildStockChart(labels, datasets, nArts: number) {
    console.log()
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ChartDrawComponent);
    if (this.stockChart) { this.stockChart.destroy() }
    this.stockChart = this.stockChartEl.createComponent(childComponent);
    this.stockChart.instance.yStacked = true;
    this.stockChart.instance.xStacked = true;
    this.stockChart.instance.width = this.chartContainer.nativeElement.clientWidth;
    this.stockChart.instance.height = nArts * 20;
    this.stockChart.instance.chartType = 'horizontalBar';
    this.stockChart.instance.labels = labels;
    this.stockChart.instance.datasets = datasets;
  }

}
