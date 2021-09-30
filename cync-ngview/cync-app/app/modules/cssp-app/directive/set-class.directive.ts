import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSetClass]'
})
export class SetClassDirective {

  constructor(renderer: Renderer2, el: ElementRef) { 
  	renderer.addClass(el.nativeElement, 'errorStyle');
  }

}
