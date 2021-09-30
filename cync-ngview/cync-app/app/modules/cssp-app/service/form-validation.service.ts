import { Injectable } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Injectable()
export class FormValidationService {

  constructor() { }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {   
        let config = {
            'required': 'Required'                            
        };
        return config[validatorName];
    }
}
