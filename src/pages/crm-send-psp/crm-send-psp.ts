import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CrmDataProvider, AuthDataProvider } from '../../providers';

import { map } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-crm-send-psp',
  templateUrl: 'crm-send-psp.html',
})
export class CrmSendPspPage {

  emailForm: FormGroup;
  psp: any;
  op: any;
  currentEmail: string;
  currentSalesMan: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fb: FormBuilder,
    private crmData: CrmDataProvider,
    private authData: AuthDataProvider
  ) {
    this.buildForm();
    this.currentEmail = this.authData.current.email;
    this.currentSalesMan = this.crmData.currentSalesRep;
    console.log(this.currentEmail);
  }

  ionViewDidLoad() {
    console.log(this.navParams.data.psp, this.navParams.data.op);
    this.psp = this.navParams.data.psp;
    this.op = this.navParams.data.op;
  }

  buildForm() {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: [''],
      obs: ['']
    })
  }

  onSubmit() {
    let today = moment().format('YYYY-MM-DD');

    let emailForm = this.emailForm.value;
    emailForm['date'] = this.psp.date;
    emailForm['number'] = this.psp.num;
    emailForm['razSoc'] = this.psp.razSoc;
    emailForm['salesRep'] = this.psp.salesRep;
    emailForm['total'] = this.psp.total;
    emailForm['items'] = this.psp.items;
    emailForm['currentEmail'] = this.currentEmail;
    console.log(emailForm);

    let activityForm = {
      time: today,
  		action: 'Envio de psp',
      desc: `Envio presupuesto ${this.psp.num} a ${emailForm.to}`,
      complete: true,
      salesRep: this.currentSalesMan
    }

    if (this.op) {
      activityForm = this.op;
      activityForm['time'] = today;
      activityForm['action'] = 'Envio de psp';
      activityForm['desc'] = `Envio presupuesto ${this.psp.num} a ${emailForm.to}`;
      activityForm['complete']  = true;
    }
    
    this.crmData.postPsp(emailForm)
    .pipe( 
      map( res => res.json())
    )
    .toPromise()
    .then( res => {
      console.log('mail enviado');
      this.crmData.newAgendaNote(activityForm)
    })
    .then( ret =>  {
      console.log('activity log cargado', ret);
      this.viewCtrl.dismiss('dismiss');
    })
    .catch( reason => {
      console.log('error en envio' , reason)
    })
  }

}
