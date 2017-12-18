import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {
  transform(array: any[], fields: any[], terms: any[], fb: boolean) {
      if (array) {
        return array.filter( object => {
          for (let i=0, m = terms.length ; i<m; i++) {
            for (let j=0, n = fields.length; j < n; j++) {
              let item;
              if(fb) { 
                item = object.payload.val()[fields[j]];
              } else {
                item = object[fields[j]];
              }
              if (item.toLowerCase() === terms[i].toLowerCase()) {
                return true;
              }
            }
          }
        });
      }
    }
  }
