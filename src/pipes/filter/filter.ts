import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable()
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(array: any[], term: string) {
      if (array) {
        if (term === '') {
          return array;
        } else {
        	return array.filter( object => {
        		let arrayKeys = Object.keys(object);
        		for (let i=0 ; i < arrayKeys.length ; i++) {
              if (typeof object[arrayKeys[i]] === 'string') {
                if (object[arrayKeys[i]].toLowerCase().indexOf(term.toLowerCase()) > -1) {
                  return true;
                }
              } else {
                // if (object[arrayKeys[i]].toString().indexOf(term) > -1) {
                //   return true;
                // }
              }
        			
        		}
          })
        }
      }
    }
}
