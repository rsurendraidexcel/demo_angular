import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
 name: 'dateFormatPipe'
})
export class DatePipePipe extends DatePipe implements PipeTransform {

	transform(results: any[], dateValue: any) { 
		return super.transform(new Date(dateValue), 'MM/dd/yyyy hh:mm a');
	}
}