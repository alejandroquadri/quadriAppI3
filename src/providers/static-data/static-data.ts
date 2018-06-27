import { Injectable } from '@angular/core';
import { ApiDataProvider } from '../api-data/api-data';

@Injectable()
export class StaticDataProvider {

  data: any;

  constructor(
    private apiData: ApiDataProvider
  ) {
  }

  getStaticData(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.apiData.getObjectOnce('staticData')
      .then( ret => {
        this.data = ret.val();
        console.log('static data available', this.data);
        resolve(this.data);
      })
      .catch( err => {
        reject( err );
      })
    })
  }

}



