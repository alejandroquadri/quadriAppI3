import { Component} from '@angular/core';
import { IonicPage} from 'ionic-angular';
import { AuthDataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-metrics',
  templateUrl: 'prod-metrics.html',
})
export class ProdMetricsPage {

  constructor(
    private authData: AuthDataProvider
  ) {}

  permission(area: string) {
    return this.authData.checkRestriction(area);
  }

}
