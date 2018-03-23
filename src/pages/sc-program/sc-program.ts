import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/combineLatest";
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { ProdProgramDataProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-sc-program',
  templateUrl: 'sc-program.html',
})
export class ScProgramPage {

  npSubs: any;
  scProgSubs: any;
  subs: any;

  npList: any;
  scProgList: any;
  npObj: any;
  scObj: any;

  periodArray = [];

  scForm: FormGroup;
  showForm = true;
  editing = false;
  editKey: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private progData: ProdProgramDataProvider,
    private fb: FormBuilder
  ) {
    this.buildPeriodArray();
    this.buildForm();
  }

  ionViewDidLoad() {
    this.npSubs = this.progData.getNPPendientes()
    .pipe(
      map( (res:any) => res.json())
    );
    this.scProgSubs = this.progData.getScProgram();

    this.subs = Observable.combineLatest(this.npSubs, this.scProgSubs, (np: any, scProg:any) => ({np, scProg}));
    this.subs.subscribe( (pair: any) => {
      this.npList = pair.np.data;
      this.scProgList = pair.scProg;
      this.npObj = this.buildNpObj(this.npList);
      this.scObj = this.buildScObj(this.scProgList);
      // console.log(this.npList, this.scProgList, this.npObj, this.scObj);
      // console.log(this.scProgList, this.scObj);
    })
  }

  buildNpObj(npList: Array<any>) {
    let npObj = {};

    npList.forEach( np => {
      let item = {
        code: np.codigo,
        desc: np.descripcion,
        dim: np.dimension,
        original: np.original,
        entregado: np.entregado,
        pendiente: np.pendiente
      }
      if (!npObj[np.np]) {
        npObj[np.np] = {
          date: np.fecha,
          salesRep: np.vendedor,
          deliveryDate: np.entrega,
          client: np.cliente,
          items: []
        }
        npObj[np.np].items.push(item);
      } else {
        npObj[np.np].items.push(item);
      }
    });
    return npObj;
  }

  buildScObj(scList: Array<any>) {
    let scObj = {};

    scList.forEach( sc => {
      let values = sc.payload.val();
      let form = {
        quantity: values.quantity,
        paid: values.paid,
        delivery: values.delivery,
        takeAway: values.takeAway,
        obs: values.obs,
        $key: sc.key
      }

      if (!scObj[values.np]) {
        scObj[values.np] = {};
        scObj[values.np][values.code] = {};
        scObj[values.np][values.code][values.date] = form;
      } else {
        if (!scObj[values.np][values.code]) {
          scObj[values.np][values.code] = {};
          scObj[values.np][values.code][values.date] = form;
        } else {
          scObj[values.np][values.code][values.date] = form;
        }
      }

      // if (!scObj[values.code]) {
      //   console.log('viene por aca');
      //   scObj[values.code] = {};
      //   scObj[values.code][values.date] = form; 
      // } else {
      //   console.log('viene por aca 2');
      //   scObj[values.code][values.date] = form;
      // }
    })
    console.log(scObj)
    return scObj;
  }

  buildPeriodArray(start?, weeks?: number) {
    weeks ? '' : weeks = 2;

    if (start) {
      this.periodArray = [];
    } else {
      start = moment();
    }
    
    let startWeek = start.clone().startOf('isoWeek');
    // this.periodArray.push(startWeek);

    for (let i=0; i<weeks; i++) {
      if (i!==0) {
        startWeek.add(2, 'days');
      }
      for (let j=0; j<6; j++) {
        let add = 1;
        if (j===0) {add = 0};
        startWeek.add(add, 'days');
        let day = startWeek.clone();
        this.periodArray.push(day);
      }
    }
  }

  nextWeek() {
    let start = this.periodArray[6];
    this.buildPeriodArray(start);
    
  }

  prevWeek() {
    let start = moment(this.periodArray[6]).add(-14,'days');
    this.buildPeriodArray(start);
  }

  thisWeek() {
    let start = moment();
    this.buildPeriodArray(start);
  }

  isToday(date) {
    return moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD');
  }

  shortSales(salesRep: string) {
    let short;
    switch (salesRep) {
      case 'Alejandra Roldan':
        short = 'AR';
        break;
      
      case 'Tarruella Alberto Horacio ':
        short = 'AT';
        break;
    
      default:
        short = salesRep;
        break;
    }

    return short;
  }

  dateFormat(date: any, type:string) {
    if (date === "anterior") {
      return 'anterior'
    } else if (type === 'fechaObj') {
      return moment(date).format('YYYY-MM-DD');
    } else if (type === "dia") {
      return moment(date).format('dd');
    } else {
      return moment(date).format('DD-MM')
    }
  }

  returnQ(np: string, code: string, date: any) {
    let dateObj = this.dateFormat(date, 'fechaObj');

    if (this.scObj[np] && this.scObj[np][code] && this.scObj[np][code][dateObj]) {
      return this.scObj[np][code][dateObj];
    } else {
      return undefined;
    }
  }

  buildForm() {
  	return this.scForm = this.fb.group({
      date: ['', Validators.required],
      np: ['', Validators.required],
    	code: ['', Validators.required],
    	quantity: ['', Validators.required],
    	obs: [''],
    	paid: [''],
      delivery: [''],
      takeAway: [''],
    })
  }

  submit() {
    console.log(this.scForm.value);
    if (!this.editing) {
      this.newProg();
    } else {
      this.edit();
    }
  }

  newProg() {
    this.progData.pushNewScProg(this.scForm.value);
    this.scForm.reset();
  }

  edit() {
    this.progData.updateScProg(this.scForm.value, this.editKey);
  }

  remove() {
    console.log('delete');
    this.progData.deleteScProg(this.editKey)
    .then( () => {
      this.editKey = undefined;
      this.editing = false;
      this.scForm.reset();
    })
  }



  addToForm(np: string, code: string, date, value?) {
    console.log(value);
    if (value) {
      this.editing = true;
      this.editKey = value.$key;
      this.scForm.patchValue({
        date: moment(date).format('YYYY-MM-DD'),
        np: np,
        code: code,
        quantity: value.quantity || '',
        obs: value.obs || '',
        paid: value.paid || false,
        delivery: value.delivery || false,
        takeAway: value.takeAway || false,
      })
    } else {
      this.editing = false;
      this.editKey = undefined;
      this.scForm.patchValue({
        date: moment(date).format('YYYY-MM-DD'),
        np: np,
        code: code,
        quantity: '',
        obs: '',
        paid: false,
        delivery: false,
        takeAway: false
      })
    }
  }

}
