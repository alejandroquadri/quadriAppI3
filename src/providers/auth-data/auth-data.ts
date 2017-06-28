import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AuthDataProvider {

	user: Observable<firebase.User>;
  current: any;
  uid: string;

  constructor(
  	public afAuth: AngularFireAuth,
  	private googlePlus: GooglePlus
	) {
    this.user = afAuth.authState;
    afAuth.authState.subscribe( user => {
      this.uid = user.uid
      this.current = user;
    })
  }

  login(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  logout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signInWithGoogleWeb(): firebase.Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  signInWithGoogleDevice(): firebase.Promise<any> {
  	return this.googlePlus.login({
	    'webClientId': '872720422739-b5ja69fq45q4aevrik24o3j9nfeak8lg.apps.googleusercontent.com',
	    'offline': true
	  })
	  .then( res => {
	  	firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
	  })
  }

}
