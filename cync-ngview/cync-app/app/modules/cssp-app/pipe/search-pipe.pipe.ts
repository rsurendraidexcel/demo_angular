import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
  pure: false
})
export class SearchPipePipe implements PipeTransform {

  transform(results: any[], searchTerm: string): any[] {  	
    if (!results || !searchTerm) {
			return results;
		}
	 return results.filter((item) => this.applyFilter(item, searchTerm));
  }

  applyFilter(allrequest, filter): boolean {    
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (allrequest.requestFieldValues[0].value.toLowerCase().indexOf(filter.toLowerCase()) === -1 && allrequest.issueKey.toLowerCase().indexOf(filter.toLowerCase()) === -1 && allrequest.requestFieldValues[2].value.value.toLowerCase().indexOf(filter.toLowerCase()) === -1 && allrequest.requestFieldValues[6].value.toLowerCase().indexOf(filter.toLowerCase()) === -1) {
            return false;
          }          
        } 
      }
    }
    return true;
  }

}
