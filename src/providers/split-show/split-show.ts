import { Injectable} from '@angular/core';

@Injectable()
export class SplitShowProvider {

	show = true;

  constructor(
  	) {
    console.log('Hello SplitShowProvider Provider');

  }

}