import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getUsername'
})
export class GetUsernamePipe implements PipeTransform {

  transform(value: any, args?: any): any {  	
  	let username = value.split(' (Cync user) added a comment - ');  	
  	if(username[1] != undefined) {
    return username[0];
	} else {
		return null;
	}
  } 

}
