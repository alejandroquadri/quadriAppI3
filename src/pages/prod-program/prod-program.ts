import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import * as moment from 'moment';

import { SplitShowProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-prod-program',
  templateUrl: 'prod-program.html',
})
export class ProdProgramPage {

	selected: any = moment();
	weekDays: Array <any>;
	weeks: Array <any>;
	showEntregas = false;

  constructor(
  	private splitShow: SplitShowProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdProgramPage');
    this.buildMonth();
  }

  next() {
  	console.log('next');
    let next = this.selected.clone();
    this.removeTime(next.month(next.month()+1)).day(0);
    this.selected.month(this.selected.month()+1);
    this.buildMonth(next);
  };

  previous() {
    let next = this.selected.clone();
    this.removeTime(next.month(next.month()-1)).day(0);
    this.selected.month(this.selected.month()-1);
    this.buildMonth(next);
  };

  private removeTime(date){
      return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  private buildWeek(start?) {
    
    if(!start) {start = moment()}
    let first = this.removeTime(start)
    let weekDays = [];
    let date = first.clone();

    for (var i = 0; i < 7; i++) {
      weekDays.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }

    this.weekDays = weekDays;
    return weekDays;
  }

  private buildMonth(start?) {
		if(!start) {start = moment()}
    this.weeks = [];
    let done = false;
    let date = start.clone();
    let monthIndex = date.month();
    let count = 0;
    while (!done) {
      this.weeks.push({ days: this.buildWeek(date.clone()) });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

}
