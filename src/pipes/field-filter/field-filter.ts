import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {
  transform(array: any[], field: string, terms: any[]) {
      if (array) {
        return array.filter( item => {
          for (let i=0;  i < terms.length ; i++) {
            if (item[field].toLowerCase() === terms[i].toLowerCase()) {
              return true;
            }
          }
        });
      }
    }
  }
