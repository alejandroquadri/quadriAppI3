import { Component, ViewChild, OnInit, Renderer } from '@angular/core';
import { ChartBuilderProvider } from '../../providers';

@Component({
  selector: 'acChart',
  templateUrl: 'acChart.html'
})
export class AcChartComponent implements OnInit {

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
    	this.chartBuilder.chartsData.acChart.chartType, 
    	this.chartBuilder.chartsData.acChart.labels, 
    	this.chartBuilder.chartsData.acChart.datasets
  	);
	}

  setChartSize() {
  	this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.chartBuilder.contentWidth-52}px`);
  }

}
