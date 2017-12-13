import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crm',
  templateUrl: 'crm.html',
})
export class CrmPage {

  public query = '';
  public countries = [ "Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus",
                        "Belgium","Bosnia & Herzegovina","Bulgaria","Croatia","Cyprus",
                        "Czech Republic","Denmark","Estonia","Finland","France","Georgia",
                        "Germany","Greece","Hungary","Iceland","Ireland","Italy","Kosovo",
                        "Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia","Malta",
                        "Moldova","Monaco","Montenegro","Netherlands","Norway","Poland",
                        "Portugal","Romania","Russia","San Marino","Serbia","Slovakia","Slovenia",
                        "Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom","Vatican City"];

  public filteredList = [];
  public elementRef;

  constructor(myElement: ElementRef) {
    this.elementRef = myElement;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrmPage');
  }

}
