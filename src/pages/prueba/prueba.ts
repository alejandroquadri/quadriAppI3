import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import 'rxjs/add/operator/map';

import { HttpApiProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-prueba',
  templateUrl: 'prueba.html',
})
export class PruebaPage {

  items: any;
 
  constructor(
    private httpApi: HttpApiProvider,
  ) {}

  sales() {
    this.httpApi.get('facturaVenta')
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      this.items = data.data;
    })
  }

}
