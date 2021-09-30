import { Component, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormValidationService } from './form-validation.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'cync-input-field-error-msg',
  template: `<div *ngIf="errorMessage !== null" class="error-text-msg"> <small>{{errorMessage}}</small></div>`
})

/**
 * 
 */
export class FormValidationComponent {
  @Input() control: FormControl;
  @Input() labelName: string;
  constructor(private el: ElementRef) { }

  /**
   * 
   */
  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if ((this.control.errors.hasOwnProperty(propertyName) && this.control.touched)) {
        if (CyncConstants.FORM_VALIDATION_WITH_LABEL_MSG_PROPERTY) {
          return FormValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName], this.labelName);
        } else {
          return null;
        }
      }
    }
    return null;
  }
}