import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], filter, field): any {
    const myItems = [];
    if (!items || !filter) {
      return items;
    }
    items.forEach((item) => {
      if (item[field].toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        myItems.push(item);
      }
    });
    return myItems;
  }
}
