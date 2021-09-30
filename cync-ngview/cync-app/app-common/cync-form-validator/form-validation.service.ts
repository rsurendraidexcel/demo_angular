import { Injectable } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';


@Injectable()
export class FormValidationService {

	constructor() { }


	static getValidatorErrorMessage(validatorName: string, validatorValue?: any, labelName?: string) {
		let config = {
			'required': 'Enter ' + labelName,
			'invalidCreditCard': 'Is invalid credit card number',
			'invalidEmailAddress': 'Invalid email address',
			'invalidPassword': 'Password must be at least 6 characters long.',
			'minlength': `Minimum length ${validatorValue.requiredLength}`,
			'maxlength': `Maximum length ${validatorValue.requiredLength}`,
			'min': `Minimum range  to enter is ${validatorValue.min}`,
			'max': `Maximum range to enter is ${validatorValue.max}`,
			'invalidName': 'Only characters allowed',
			'invalidAddress': 'Not a valid Address',
			'invalidNumber': 'Not a valid Number',
			'invalidValue': 'Not a valid value',
			'invalidPhoneNumber': 'Not a valid Phone Number',
			'invalidDOB': 'Please enter the date of birth in dd/mm/yyyy format.',
			'invalidZipCode': 'Not a valid Zip Code',
			'invalidCouponCode': 'Enter a valid Coupon code',
			'invalidFranchiseCode': 'Only 3 alphanumeric character allowed',
			'invalidAmount': 'Enter a valid amount',
			'invalidCommision': 'Enter a valid Commision',
			'invalidFaxNumber': 'Enter a valid Fax',
			'DismatchPassword': 'Password does not match',
			'invalidNameWithSpecialCharacter': 'Not a valid name',
			'invalidIpAddress': 'Not a Valid IP Address',
			'invalidAlphaNumeric': 'Only aplha numberic is allowed',
			'pattern':'Invalid Pattern'
		};
		return config[validatorName];
	}

	validateIpAddress(c: FormControl){
		const IP_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return IP_ADDRESS_REGEX.test(c.value) || !c.value ? null : {
			invalidIpAddress: true
		};
	}

	validateEmail(c: FormControl) {
		let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
		return EMAIL_REGEXP.test(c.value) || !c.value ? null : {
			invalidEmailAddress: true
		};
	}
	validateName(c: FormControl) {
		//let NAME_REGEXP =/^(?!\s)([a-z A-Z])*[^\s0-9]+$/;
		let NAME_REGEXP = /^(?!\s)([A-Za-z ])+$/;
		return NAME_REGEXP.test(c.value) ? null : {
			invalidName: true
		};
	}
	validateAddress(c: FormControl) {
		let ADDRESS_REGEXP = /(?!\s)([0-9a-zA-Z #,-.])+$/
		return ADDRESS_REGEXP.test(c.value) ? null : {
			invalidAddress: true
		};
	}

	min(c: FormControl) {
		let ADDRESS_REGEXP = /(?!\s)([0-9a-zA-Z #,-.])+$/
		return ADDRESS_REGEXP.test(c.value) ? null : {
			invalidAddress: true
		};
	}

	validateNumber(c: FormControl) {
		let NUMBER_REGEXP = /^(?!\s)([0-9])+$/;
		return NUMBER_REGEXP.test(c.value) ? null : {
			invalidNumber: true
		};
	}
	validatePhoneNumber(c: FormControl) {
		let PHONE_REGEXP = /^(?!\s)([0-9 ;:{}.,-/+()])+$/;
		return PHONE_REGEXP.test(c.value) || !c.value ? null : {
			invalidPhoneNumber: true
		};
	}
	validatePassword(c: FormControl) {
		if (!c.value) {
			return null;
		} else {
			let PASSWORD_REGEXP = /^[a-zA-Z0-9!@#$%^&*]{6,}$/;
			return PASSWORD_REGEXP.test(c.value) ? null : {
				invalidPassword: true
			};
		}
	}
	validateDOB(c: FormControl) {
		/* /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/ */
		let DOB_REGEXP = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
		return DOB_REGEXP.test(c.value) ? null : {
			invalidDOB: true
		};
	}
	validateCreditCardNumber(c: FormControl) {
		let CREDITCARD_REGEXP = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
		return CREDITCARD_REGEXP.test(c.value) ? null : {
			invalidCreditCard: true
		};
	}
	validateZipCode(c: FormControl) {
		let ZIPCODE_REGEXP = /(?!\s)((^\d{6}$)|(^\d{5}-\d{4}$))[^\s]+$/;
		return ZIPCODE_REGEXP.test(c.value) ? null : {
			invalidZipCode: true
		};
	}

	validateIsoCode(c: FormControl) {
		let ISO_REGEXP = /^(?!\s)([a-zA-Z]{3})$/;
		return ISO_REGEXP.test(c.value) ? null : {
			invalidIsoCode: true
		};
	}
	validateDecimal(c: FormControl) {
		let DE_REGEXP = /^\d+(\.\d{1,4})?$/i;
		return DE_REGEXP.test(c.value) ? null : {
			invalidValue: true
		};
	}

	validateWebsite(c: FormControl) {
		let WEB_REGEXP = /^(?!\s)((http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1})[^\s0-9]+$/;
		return WEB_REGEXP.test(c.value) ? null : {
			invalidWebsite: true
		};
	}
	validateMapCoordinate(c: FormControl) {
		let MAP_REGEXP = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;
		return MAP_REGEXP.test(c.value) ? null : {
			invalidMapCoordinate: true
		};
	}
	validateNameWithSpecialCharacter(c: FormControl) {
		//let NAMESPEC_REGEXP =  /^(?!\s)([a-zA-Z .'])*[^\s0-9]+$/;
		let NAMESPEC_REGEXP = /^([a-zA-Z .'-])*$/;
		return NAMESPEC_REGEXP.test(c.value) ? null : {
			invalidNameWithSpecialCharacter: true
		};
	}

	validationAlphaNumeric(c: FormControl){
		let NAMESPEC_REGEXP = /^[a-zA-Z0-9\.]*$/
		return NAMESPEC_REGEXP.test(c.value) ? null : {
			invalidAlphaNumeric: true
		};
	}

	validateAmount(c: FormControl) {
		let AMOUNT_REGEXP = /^\d/;
		return AMOUNT_REGEXP.test(c.value) ? null : {
			invalidAmount: true
		};
	}
	validateCouponCode(c: FormControl) {
		let COUPONCODE_REGEXP = /^[a-zA-Z0-9]+$/;
		return COUPONCODE_REGEXP.test(c.value) ? null : {
			invalidCouponCode: true
		};
	}
	validateFranchiseCode(c: FormControl) {
		let COUPONCODE_REGEXP = /^[a-zA-Z0-9]{3}$/;
		return COUPONCODE_REGEXP.test(c.value) ? null : {
			invalidFranchiseCode: true
		};
	}
	validateCommision(c: FormControl) {
		let COMMISION_REGEXP = /^[0-9.]+$/;
		return COMMISION_REGEXP.test(c.value) ? null : {
			invalidCommision: true
		};
	}
	validateFaxNumber(c: FormControl) {
		let FAX_REGEXP = /^\d{10}$/;
		return FAX_REGEXP.test(c.value) ? null : {
			invalidFaxNumber: true
		};
	}


	/* static password(c:AbstractControl){
		console.log(c);
		let pass  = c.get('password').value;
		let confPass = c.get('confpassword').value;
		console.log("---------------------");
		if(!pass){
				pass = null;
				console.log("pass",pass);
		}
		if(!confPass){
			confPass = null;
			console.log("confPass",confPass);
		}
		console.log("pass",pass);    	
		console.log("conf",confPass);
		console.log("If",confPass == pass);
    if (confPass == pass) {
			console.log('passwords  match');
			console.log("---------------------");
      return null;
      } else {
				console.log("---------------------");
				c.get('confpassword').setErrors({mismatch : true})
      //	return { DismatchPassword: true };
			}
    }	

	confirmPassword(c:FormControl){ 
		let pass  = c.value;
		let confPass = c.root.value['password'];
		
		//console.log("pass",pass);    	
		//console.log("conf",confPass);
		//console.log("If",confPass == pass);   	

		if(!pass){
				pass = null;
				//console.log("pass",pass);
		}
		if(!confPass){
			confPass = null;
			//console.log("confPass",confPass);
		}
    if (confPass == pass) {
      //console.log('passwords  match');
      return null;
      } else {
      	return { DismatchPassword: true };
      }
    } */
}


