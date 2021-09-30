import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormValidationService } from './form-validation.service';

@Component({
  selector: 'control-messages',
  template: `<div class="errorvalidation" id="errorValidationField" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})

export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() form : FormGroup;
  setSubmitted;

  constructor() {}
  
  get errorMessage() {  

    if(this.form) {
        this.setSubmitted = this.form['_submitted']
    }

    for (let propertyName in this.control.errors) {      
      if ((this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.setSubmitted))) {
        return FormValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    
    return null;
  }
}