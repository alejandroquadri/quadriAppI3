import { Component} from '@angular/core';
import { IonicPage} from 'ionic-angular';

import { SplitShowProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {

  constructor(
  	private splitShow: SplitShowProvider
  ) {}

}
