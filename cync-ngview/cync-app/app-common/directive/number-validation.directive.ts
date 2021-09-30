import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[numberValidation]'
})
export class numberValidationDirective {

	regexStr = '^[0-9]*$';
	@Input() isNumber: boolean;

	constructor(private el: ElementRef) { }

	@HostListener('keypress', ['$event']) onKeyPress(event) {
		return new RegExp(this.regexStr).test(event.key);
	}
}
