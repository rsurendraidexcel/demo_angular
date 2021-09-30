import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Router } from '@angular/router';
import { InterestRateCodesService } from '../service/interest-rate-codes.service';
import { InterestRateCodes, InterestRateCodesRequestBody } from '../model/interest-rate-codes.model';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-manage-interest-rate-codes',
	templateUrl: './manage-interest-rate-codes.component.html',
	styleUrls: ['./manage-interest-rate-codes.component.scss']
})

/**
 * @author Sanjay Gupta
 */

export class ManageInterestRateCodesComponent implements OnInit {

	interestRateCodeAction: string = CyncConstants.AddNewHeading;
	interestRateCodeForm: FormGroup;
	interestRateCodeId: any;
	interestRateCodeDtls: any;
	requestModel: any;
	loan_type: string;
	rate_code: string;
	rate_name: string;
	id: string;
	deleteModel: any;
	isRequired: boolean = false;
	loanType: string = '';
	currentAction: string = CyncConstants.ADD_OPERATION;
	currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
	saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
	cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button

	constructor(private _message: MessageServices,
		private _apiMapper: APIMapper,
		private _router: Router,
		private _helper: Helper,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private interest_rate_code_service: InterestRateCodesService) {
	}

	ngOnInit() {
		this._message.showLoader(true);
		this.loanType = CyncConstants.getLoanType();
		this.initFormValidator();
		this._renderForm();
		this._helper.adjustUI();
	}

	/**
	* Initial form validation
	*/
	initFormValidator() {
		this.interestRateCodeForm = this.fb.group({
			rate_code: new FormControl('', Validators.compose([Validators.required])),
			rate_name: new FormControl('', Validators.compose([Validators.required])),
			rate_description: new FormControl('', Validators.compose([])),
			rate_divisor: new FormControl('360', Validators.compose([Validators.required])),
			rate_precision: new FormControl('8', Validators.compose([Validators.required])),
			loan_type: new FormControl('', Validators.compose([]))
		});
	}

	/**
	* Render form
	*/
	_renderForm() {
		this.route.params.subscribe(params => {
			this.interestRateCodeId = params['id'];
			if (this.interestRateCodeId !== undefined && !this._helper.isCurrentActionAdd(this.interestRateCodeId)) {
				this.currentAction = CyncConstants.EDIT_OPERATION;
				this.interestRateCodeAction = CyncConstants.EditHeading;
				this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
				this.interest_rate_code_service.getInterestRatesCodeWithId(this._apiMapper.endpoints[CyncConstants.GET_INTEREST_RATE_CODE_DETAILS].replace('{interestRateCodeId}', this.interestRateCodeId)).subscribe(result => {
					this.interestRateCodeForm.patchValue(result);
					this._message.showLoader(false);
				})
			}
			else {
				this.currentAction = CyncConstants.ADD_OPERATION;
				this._message.showLoader(false);
			}
		});
	}

	/**
	 * This Method is used to check if the current action is add
	 */
	isCurrentActionAdd(): boolean {
		return this._helper.isCurrentActionAdd(this.currentAction);
	}

	/**
	* Save & Update interest rate code data
	*/
	saveData(model: InterestRateCodes, isValid: boolean, isNew: boolean) {
		if (isValid) {
			this._message.showLoader(true);
			let requestBody = new InterestRateCodesRequestBody();
			model.loan_type = this.loanType;
			requestBody.interest_rate_code = model;

			if (this.isCurrentActionAdd()) {
				//Add new 
				this.interest_rate_code_service.saveInterestRateCodes(this._apiMapper.endpoints[CyncConstants.ADD_INTERESTRATECODE_LIST], requestBody).subscribe(results => {
					this._message.showLoader(false);
					this._message.addSingle('Record saved successfully.', 'success');
					if (!isNew) {
						this.goToListInterestRateCodes();
					} else {
						this.interestRateCodeForm.reset();
					}
				});
			} else {
				//Update
				this.interest_rate_code_service.updateInterestRateCode(this._apiMapper.endpoints[CyncConstants.GET_INTEREST_RATE_CODE_DETAILS].replace('{interestRateCodeId}', this.interestRateCodeId), requestBody).subscribe(results => {
					this._message.showLoader(false);
					this._message.addSingle('Record updated successfully.', 'success');
					this.goToListInterestRateCodes();
				});
			}
		}
	}

	/**
	* Navigate to home page
	*/
	goToListInterestRateCodes() {
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.INTEREST_RATE_CODE_HOME_PAGE_REDIRECT_URL]);
		this._message.showLoader(false);
	}

	/**
	* CSS display according to validation
	* @param field
	*/
	displayFieldCss(field: string) {
		return this._helper.getFieldCss(field, this.interestRateCodeForm)
	}

	/**
	* Get form control validation
	* @param field
	*/
	getFormControl(field: string) {
		return this.interestRateCodeForm.get(field);
	}

	/**
	 * If user has not done any changes to form , this method is to check same and disable action btn save/update
	 */
	isFormValid(): boolean {
		if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.interestRateCodeForm.valid;
		} else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			// we have to disable form btn
			return !this.interestRateCodeForm.valid || this.interestRateCodeForm.pristine
		} else {
			// we dont have to disable btn
			return false;
		}
	}
}
