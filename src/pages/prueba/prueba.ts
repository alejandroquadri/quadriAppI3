import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';

/**
 * Generated class for the PruebaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-prueba',
  templateUrl: 'prueba.html',
})
export class PruebaPage {

  items: any;
 
constructor() {
 
  this.items = [];
 
  for(let i = 0; i < 2000; i++){
 
    let item = {
      title: 'Title',
      body: 'body',
      avatarUrl: 'https://avatars.io/facebook/random'+i
    };
 
    this.items.push(item);
  }
 
}

}
