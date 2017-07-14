import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objNgfor',
})
export class ObjNgforPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
  		console.log(value);
  		console.log(Object.keys(value));
      return Object.keys(value)//.map(key => value[key]);
    }
}

