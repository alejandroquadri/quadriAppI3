import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {
  transform(array: any[], fields: any[], terms: any[]) {
      if (array) {
        return array.filter( item => {
          for (let i=0, m = terms.length ; i<m; i++) {
            for (let j=0, n = fields.length; j < n; j++) {
              if (item[fields[j]].toLowerCase() === terms[i].toLowerCase()) {
                return true;
              }
            }
          }
        });
      }
    }
  }
