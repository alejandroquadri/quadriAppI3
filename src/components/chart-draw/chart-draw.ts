import { Component, Input, Renderer, OnInit, ViewChild } from '@angular/core';
import { ChartBuilderProvider } from '../../providers';

@Component({
  selector: 'chart-draw',
  template: 
  `
    <button ion-button (click)="setParentSize()">
      Size
    </button>
    <div #container class="chart">
      <canvas #chart></canvas>
    </div>
  `
})

// <div class="chart" (window:resize)="setChartSize()">
export class ChartDrawComponent implements OnInit {

  @Input() width: number;
  @Input() chartType: string
  @Input() labels: Array<any>
  @Input() datasets: Array<any>
  @ViewChild('chart') chart;
  @ViewChild('container') container;

  constructor(
    private chartBuilder: ChartBuilderProvider,
    private renderer: Renderer
  ) {
  }

  ngOnInit() {
    let size = new Promise( (resolve, reject) => {
      this.setSize();
      resolve();
    });
    size.then( () => {
      this.chartBuilder.buildChart(
        this.chart.nativeElement, 
        this.chartType, 
        this.labels, 
        this.datasets
      );
    })
  }

  ngAfterViewChecked() {
    console.log('viewchecked en chart-draw', this.width);
    this.setSize();
  }

  setSize() {
    let height = this.width * 0.5;
    console.log(this.width, height);
    this.renderer.setElementStyle(this.container.nativeElement, 'position', 'relative');
    this.renderer.setElementStyle(this.container.nativeElement, 'width', `${this.width}px`);
    this.renderer.setElementStyle(this.container.nativeElement, 'height', `${height}px`);
  }

}
