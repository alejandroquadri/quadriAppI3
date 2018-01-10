import { Component } from '@angular/core';

/**
 * Generated class for the OpChartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'op-chart',
  templateUrl: 'op-chart.html'
})
export class OpChartComponent {

  text: string;

  constructor() {
    console.log('Hello OpChartComponent Component');
    this.text = 'Hello World';
  }

}
