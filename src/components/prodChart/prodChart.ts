import { Component, ViewChild, OnInit, Renderer } from '@angular/core';
import { ChartBuilderProvider } from '../../providers';

@Component({
  selector: 'prodChart',
  templateUrl: 'prodChart.html'
})
export class ProdChartComponent implements OnInit {

	text: string;
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
  	this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.chartBuilder.contentWidth-52}px`);
  }

}
