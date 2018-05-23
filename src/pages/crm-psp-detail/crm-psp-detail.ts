import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crm-psp-detail',
  templateUrl: 'crm-psp-detail.html',
})
export class CrmPspDetailPage {

  psp: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.psp = this.navParams.data;
  }

  sendPsp() {
    let profileModal = this.modalCtrl.create('CrmSendPspPage', this.psp);
    profileModal.onDidDismiss( data => {
      data === 'dismiss' ? this.viewCtrl.dismiss() : '' ;
    });
    profileModal.present();
  }


}
