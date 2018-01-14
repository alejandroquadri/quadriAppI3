import { Component } from '@angular/core';
import { SplitShowProvider } from '../../providers';

@Component({
  selector: 'split-ctrl',
  templateUrl: 'split-ctrl.html'
})
export class SplitCtrlComponent {

	show;

  constructor(
    private splitShow: SplitShowProvider
  ) {
  	this.show = this.splitShow.show;
  }

}
