import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search_Pipe',
  pure: false
})
export class Search_Pipe implements PipeTransform {
  transform(results: any[], searchTerm: string): any[] {
    if (!results || !searchTerm) {
			return results;
		}
	 return results.filter((item) => this.applyFilter(item, searchTerm));
  }

  applyFilter(allrequest, filter): boolean {
    //console.log(allrequest)
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (allrequest.currencyPair != undefined && (allrequest.currencyPair.currencyIdBase.currencyCode + '-' + allrequest.currencyPair.currencyIdTo.currencyCode).toLowerCase().indexOf(filter.toLowerCase()) === -1){
             return false;
          }
        }
      }
    }
    return true;
  }

}
