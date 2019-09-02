import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  transform(array: any[], key: string, value: any): any {
    if (key && value) {
      return array.filter(item => item.hasOwnProperty(key) && item[key] === value);
    }
    return array;
  }

}