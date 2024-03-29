import { Component, Input, Renderer, OnInit, ViewChild } from '@angular/core';
import { ChartBuilderProvider } from '../../providers';

@Component({
  selector: 'chart-draw',
  template: 
  `
    <div #container class="chart">
      <canvas #chart></canvas>
    </div>
  `
})

export class ChartDrawComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  @Input() size: number;
  @Input() chartType: string;
  @Input() labels: Array<any>;
  @Input() datasets: Array<any>;
  @Input() options: any;
  @Input() xStacked: boolean = false;
  @Input() yStacked: boolean = false;
  @ViewChild('chart') chart;
  @ViewChild('container') container;
  screenHeight: any;

  constructor(
    private chartBuilder: ChartBuilderProvider,
    private renderer: Renderer
  ) {
  }

  ngOnInit() {
    this.screenHeight = window.screen.height
    let size = new Promise( (resolve, reject) => {
      this.setSize();
      resolve();
    });
    size.then( () => {
      this.chartBuilder.buildChart(
        this.chart.nativeElement, 
        this.chartType, 
        this.labels, 
        this.datasets,
        this.options
      );
    })
  }

  ngAfterViewChecked() {
    this.setSize();
  }

  setHeight() {
    if (this.height) {
      console.log(this.height);
      this.renderer.setElementStyle(this.container.nativeElement, 'position', 'relative');
      this.renderer.setElementStyle(this.container.nativeElement, 'height', `${this.height}px`);
      this.renderer.setElementStyle(this.container.nativeElement, 'width', `${this.width}px`);
    }
  }

  setSize() {
    let height;
    this.renderer.setElementStyle(this.container.nativeElement, 'position', 'relative');
    this.renderer.setElementStyle(this.container.nativeElement, 'width', `${this.width}px`);
    if (this.height) {
      this.height < 80 ? height = 80 : height = this.height;
    } else {
      !this.size ? this.size = 3 : '';
      height = this.width / this.size;
      if (height > (this.screenHeight - 200)) {
        height = (this.screenHeight - 200)
      }
    }
    this.renderer.setElementStyle(this.container.nativeElement, 'height', `${height}px`);
  }

}
