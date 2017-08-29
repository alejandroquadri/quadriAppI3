import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, Platform, LoadingController, AlertController } from 'ionic-angular';

import { AuthDataProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	quadriImg: string = "./assets/images/quadri.jpg";
  loginForm: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
	userProfile: any = null;
  loading: any;

  constructor(
  	public platform: Platform,
  	private authData: AuthDataProvider,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
  	) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // this.loginForm = this.formBuilder.group({
    //   email: ['', Validators.compose([Validators.required])],
    //   password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    // });
  }

  loginGoogle () {
  	// if (this.platform.is('cordova') || !this.platform.is('mobileweb')) {
  	// 	this.authData.signInWithGoogleDevice();
  	// } else {
  		this.authData.signInWithGoogleWeb();
  	// } 
  }

  elementChanged(input){
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  loginUser(){
    this.submitAttempt = true;

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.login(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        console.log('va a root');
        // this.loading.dismiss().catch(() => {})
        // this.navCtrl.setRoot(TabsPage);
        // lo de arriba lo saco porque la observable del appcomponent ya lo esta direccionando y poniendo
        // el root en tabs cuando el usuario de loguea
      }, error => {
        console.log('hubo un error');
        this.loading.dismiss()
        .then(() => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        })
        .catch(() => {})
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  logOut2() {
    console.log('logout');
    this.authData.logout();
  }

}
