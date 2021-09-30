import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Router } from '@angular/router';
import { InterestRateCodesService } from '../service/interest-rate-codes.service';
import { InterestDetails, InterestRateCodes, InterestRateRequestBody } from '../model/interest-rate-codes.model';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-manage-interest-rates',
	templateUrl: './manage-interest-rates.component.html',
	styleUrls: ['./manage-interest-rates.component.scss']
})

/**
 * @author Sanjay Gupta
 */

export class ManageInterestRatesComponent implements OnInit {

	interestRateAction: string = CyncConstants.AddNewHeading;
	interestRateCodeResult: InterestRateCodes;
	interestRatesForm: FormGroup;
	interestRateCodeId: any;
	interestRateId: any;
	requestModel: any;
	rate_date: string;
	rate_value: string;
	id: string;
	deleteModel: any;
	isRequired: boolean = false;
	loanType: string = '';
	updatedDateFormat: string;
	currentAction: string = CyncConstants.ADD_OPERATION;
	yearRange: string = CyncConstants.MIN_DATE_RANG_YEAR + ":" + CyncConstants.MAX_DATE_RANG_YEAR;
	currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
	cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
	calendarYearRange: string = '';

	constructor(
		private _message: MessageServices,
		private _apiMapper: APIMapper,
		private _router: Router,
		private _helper: Helper,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private interest_rate_code_service: InterestRateCodesService) {
	}

	ngOnInit() {
		[] = [];
		this._message.showLoader(true);
		this.initCalendarYearRange();
		this.loanType = CyncConstants.getLoanType();
		this.initFormValidator();
		this._renderForm();
		this._helper.adjustUI();
	}

	/**
    * Get calendar year range list
    */
	initCalendarYearRange() {
		this.interest_rate_code_service.getCalendarYearRange(this._apiMapper.endpoints[CyncConstants.GET_CALENDAR_YEAR_RANGE]).subscribe(result => {
			this.calendarYearRange = result.start_year + ':' + result.end_year;
		})
	}
	/**
	* Initial form validation
	*/
	initFormValidator() {
		this.interestRatesForm = this.fb.group({
			rate_date: new FormControl('', Validators.compose([Validators.required])),
			rate_value: new FormControl('', Validators.compose([Validators.required]))
		});
	}

	/**
	* Render form
	*/
	_renderForm() {
		this.route.params.subscribe(params => {
			this.interestRateCodeId = params['intId'];
			this.interestRateId = params['rateId'];
			this.interest_rate_code_service.getInterestRatesCodeWithId(this._apiMapper.endpoints[CyncConstants.GET_INTEREST_RATE_CODE_DETAILS].replace('{interestRateCodeId}', this.interestRateCodeId)).subscribe(result => {
				this.interestRateCodeResult = result;
				if (this.interestRateId !== undefined && !this._helper.isCurrentActionAdd(this.interestRateId)) {
					this.currentAction = CyncConstants.EDIT_OPERATION;
					this.interestRateAction = CyncConstants.EditHeading;
					this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
					this.interest_rate_code_service.getInterestRatesWithId(this._apiMapper.endpoints[CyncConstants.GET_SINGLE_INTERESTRATE].replace('{interestRateCodeId}', this.interestRateCodeId).replace('{interestRateId}', this.interestRateId)).subscribe(result => {
						this.interestRatesForm.patchValue(result);
						this._message.showLoader(false);
					})
				}
				else {
					this.currentAction = CyncConstants.ADD_OPERATION;
					this._message.showLoader(false);
				}
			})
		});
	}

	/**
	 * This Method is used to check if the current action is add
	 */
	isCurrentActionAdd(): boolean {
		return this._helper.isCurrentActionAdd(this.currentAction);
	}

	/**
	* Save & Update interest rate
	*/
	saveData(model: InterestDetails, isValid: boolean) {
		if (isValid) {
			this._message.showLoader(true);
			this.updatedDateFormat = new DatePipe('en-US').transform(this.interestRatesForm.controls.rate_date.value, 'MM/dd/yyyy');
			model.interest_rate_code_id = this.interestRateCodeId;
			model.rate_date = this.updatedDateFormat;
			let requestBody = new InterestRateRequestBody();
			requestBody.interest_rate = model;
			if (this.isCurrentActionAdd()) {
				//Add new 
				this.interest_rate_code_service.saveInterestRates(this._apiMapper.endpoints[CyncConstants.ADD_INTERESTRATE].replace('{interestRateCodeId}', this.interestRateCodeId), requestBody).subscribe(results => {
					this._message.showLoader(false);
					this._message.addSingle('Record saved successfully.', 'success');
					this.navigateToHome();
				});
			} else {
				//Update
				this.interest_rate_code_service.updateInterestRate(this._apiMapper.endpoints[CyncConstants.UPDATE_INTERESTRATE].replace('{interestRateCodeId}', this.interestRateCodeId).replace('{interestRateId}', this.interestRateId), requestBody).subscribe(results => {
					this._message.showLoader(false);
					this._message.addSingle('Record updated successfully.', 'success');
					this.navigateToHome();
				});
			}
		}
	}

	/**
	* Navigate to home page
	*/
	navigateToHome() {
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.INTEREST_RATE_CODE_HOME_PAGE_REDIRECT_URL]);
		this._message.showLoader(false);
	}

	/**
	* CSS display according to validation
	* @param field
	*/
	displayFieldCss(field: string) {
		return this._helper.getFieldCss(field, this.interestRatesForm)
	}

	/**
	* Get form control validation
	* @param field
	*/
	getFormControl(field: string) {
		return this.interestRatesForm.get(field);
	}

	/**
	 * If user has not done any changes to form , this method is to check same and disable action btn save/update
	 */
	isFormValid(): boolean {
		if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.interestRatesForm.valid;
		} else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			// we have to disable form btn
			return !this.interestRatesForm.valid || this.interestRatesForm.pristine
		} else {
			// we dont have to disable btn
			return false;
		}
	}
}
