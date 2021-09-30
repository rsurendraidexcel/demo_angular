import { Component, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormvalidationService } from './formvalidation.service';

@Component({
  selector: 'control-messages',
  template: `<div style='color:red' *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})

/**
 * 
 */
export class ControlMessagesComponent {
  @Input() control: FormControl;

  constructor(private el: ElementRef) { }

  /**
   * 
   */
  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if ((this.control.errors.hasOwnProperty(propertyName) && this.control.touched)) {
        return FormvalidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}