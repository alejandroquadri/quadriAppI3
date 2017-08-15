import { Component, Input, Renderer, OnInit, ViewChild } from '@angular/core';
import { ChartBuilderProvider } from '../../providers';

@Component({
  selector: 'chart-draw',
  template: 
  `
    <div class="chart" (window:resize)="setChartSize()">
      <canvas #chart></canvas>
    </div>
  `
})
export class ChartDrawComponent implements OnInit {

  @Input() width: number;
  @Input() chartType: string
  @Input() labels: Array<any>
  @Input() datasets: Array<any>
  @ViewChild('chart') chartEl;

  constructor(
    private chartBuilder: ChartBuilderProvider,
    private renderer: Renderer
  ) {
  }

  ngOnInit() {
    let size = new Promise( (resolve, reject) => {
      this.setChartSize();
      resolve();
    });
    size.then( () => {
      this.chartBuilder.buildChart(
        this.chartEl.nativeElement, 
        this.chartType, 
        this.labels, 
        this.datasets
      );
    })
  }

  setChartSize() {
    this.renderer.setElementStyle(this.chartEl.nativeElement, 'width', `${this.width}px`);
  }

}
