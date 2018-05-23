import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crm-send-psp',
  templateUrl: 'crm-send-psp.html',
})
export class CrmSendPspPage {

  emailForm: FormGroup;
  psp: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fb: FormBuilder,
  ) {
    this.buildForm();
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.psp = this.navParams.data;
  }

  buildForm() {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: ['', Validators.email],
      obs: ['']
    })
  }

  onSubmit() {
    console.log(this.emailForm.value);
    this.viewCtrl.dismiss('dismiss');
  }

}
