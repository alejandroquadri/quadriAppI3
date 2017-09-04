import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import * as moment from 'moment';

import { SplitShowProvider, ProdProgramDataProvider } from '../../providers';

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

	programSubs: any
	program: any;

  constructor(
  	private splitShow: SplitShowProvider,
  	private programData: ProdProgramDataProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdProgramPage');
    this.buildMonth();
    this.programSubs = this.programData.getProgram().subscribe( prog => {
    	this.program = prog;
    })
  }

  ionViewWillUnload() {
    console.log('desuscripcion program');
    this.programSubs.unsubscribe();
  }

  next() {
    this.selected.month(this.selected.month()+1);
    this.buildMonth()
  };

  previous() {
    this.selected.month(this.selected.month()-1);
    this.buildMonth()
  };

  private removeTime(date){
      return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  private buildWeek(start) {
    let weekDays = [];
    let date = start.clone();
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

  private buildMonth() {
		let start = this.selected.clone();
		start.date(1).day(0); 
		// con date(1) voy a la primer fecha del mes, con day(0) voy al primer dia de la semana
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
