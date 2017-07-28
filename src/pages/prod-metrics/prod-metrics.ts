import { Component, ViewChild} from '@angular/core';
import { IonicPage, Content} from 'ionic-angular';
import { DecimalPipe } from '@angular/common';

import { ChartBuilderProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {

  @ViewChild(Content) content: Content;

  constructor(
    private chartBuilder: ChartBuilderProvider,
  ) {}

  ionViewDidLoad() {
    this.chartBuilder.contentWidth = this.content._elementRef.nativeElement.clientWidth;
  }

  onResize(event) {
    console.log(this.chartBuilder.contentWidth);
    this.chartBuilder.contentWidth = this.content._elementRef.nativeElement.clientWidth;
  }

}
