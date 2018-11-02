import { Injectable } from '@angular/core';
import { ApiDataProvider } from '../api-data/api-data';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class StaticDataProvider {

  data: any;

  constructor(
    private apiData: ApiDataProvider,
    private authData: AuthDataProvider
  ) {
  }

  getStaticData(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.authData.user.subscribe( user => {
        if (user) {
          this.apiData.getObjectOnce('staticData')
          .then( ret => {
            this.data = ret.val();
            console.log('static data available', this.data);
            resolve(this.data);
          })
          .catch( err => {
            reject( err );
          })
        } else {
          console.log('no esta logueado');
          resolve();
        }
      })
    })
  }

}



