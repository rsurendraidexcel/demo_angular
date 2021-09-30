import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppConfig } from '@app/app.config';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { LoanTypeModel, UpdateRequestBody } from '../model/loan-type.model';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { LoanTypeService } from '../service/loan-type.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of, interval } from 'rxjs';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';

@Component({
	selector: 'app-manage-loan-type',
	templateUrl: './manage-loan-type.component.html'
})

export class ManageLoanTypeComponent {

	loanTypeForm: FormGroup;
	loanTypeId: any;
	currentAction: string = CyncConstants.ADD_OPERATION;
	asyncData: any;
	currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
	saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
	cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
	IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;

	constructor(
		private _router: Router,
		private _helper: Helper,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private _apiMapper: APIMapper,
		private loanTypeService: LoanTypeService,
		private _service: CustomHttpService,
		private _msgLoader: MessageServices
	) { }

	ngOnInit() {
		this._helper.adjustUI();
		this.initFormValidator();
		this.renderForm();
	}

	/**
   * This method Initializes form data
   */
	initFormValidator() {
		this.loanTypeForm = this.fb.group({
			id: new FormControl('', Validators.compose([])),
			loan_type_name: new FormControl('', Validators.compose([Validators.required])),
			loan_type_desc: new FormControl('', Validators.compose([])),
			created_at: new FormControl('', Validators.compose([])),
			updated_at: new FormControl('', Validators.compose([])),
		});
	}


	/**
   * Render Form with values as per the Add / Edit operation
   */
	renderForm() {
		this.route.params.subscribe(params => {
			this.loanTypeId = params['id'];
			if (this.loanTypeId !== undefined && !this._helper.isCurrentActionAdd(this.loanTypeId)) {
				this.currentAction = CyncConstants.EDIT_OPERATION;
				this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
				this.showLoanTypeForm();
			} else {
				this.currentAction = CyncConstants.ADD_OPERATION;
			}
		});
	}

	/**
 	* Method to map Loan Type Model Values with Loan Type Form
 	*/
	showLoanTypeForm() {
		this._msgLoader.showLoader(true);
		this.loanTypeService.getLoanTypeById(this._apiMapper.endpoints[CyncConstants.LOAN_TYPE_BY_ID].replace('{id}', this.loanTypeId)).subscribe(loanTypeResponse => {
			this.loanTypeForm.patchValue(loanTypeResponse);
			this._msgLoader.showLoader(false);
		});
	}

	/**
 	* This Method is used to check if the current action is add
 	*/
	isCurrentActionAdd(): boolean {
		return this._helper.isCurrentActionAdd(this.currentAction);
	}

	/**
    * Method to save Loan Type
    * @param model
    * @param isValid
    */
	saveLoanType(model: LoanTypeModel, isValid: boolean, isNew: boolean) {
		let loanTypeModel = new UpdateRequestBody();
		loanTypeModel.non_abl_loan_type = model;
		if (isValid) {
			if (this.isCurrentActionAdd()) {
				this.createLoanType(loanTypeModel, isNew);
			} else {
				this.updateLoanType(loanTypeModel)
			}
		}
	}

	/**
	 * Method to Create New Loan Type
	 * @param requestBody
	 * @param isNew
	 */
	createLoanType(model: UpdateRequestBody, isNew: boolean) {
		this._msgLoader.showLoader(true);
		this.loanTypeService.saveLoanType(this._apiMapper.endpoints[CyncConstants.LOAN_TYPE_API], model).subscribe(res => {
			let message: string = 'Loan Type saved successfully,';
			this._helper.showApiMessages(message, 'success');
			this._msgLoader.showLoader(false);
			if (!isNew) {
				this.navigateToLoanTypeList();
			} else {
				this.loanTypeForm.reset();
			}
		});
	}

	/**
	 * Method to Update Loan Type
	 * @param model
	 * @param isValid
	 */
	updateLoanType(model: UpdateRequestBody) {
		this.loanTypeService.updateLoanType(this._apiMapper.endpoints[CyncConstants.LOAN_TYPE_BY_ID].replace('{id}', this.loanTypeId), model).subscribe(res => {
			let message: string = 'Loan Type updated successfully';
			this._helper.showApiMessages(message, 'success');
			this.navigateToLoanTypeList();
		});
	}

	/**
	* Method to navigate back to loan type list
	*/
	navigateToLoanTypeList() {
		this._router.navigateByUrl(MenuPaths.LOAN_TYPE_PATH);
	}

	/**
	* Method to hightlight mandatory fileds if form validations fail
	* @param field
	*/
	displayCssField(field: string) {
		return this._helper.getFieldCss(field, this.loanTypeForm);
	}

	/**
   	* Get Form Control field
    * @param field
    */
	getFormControl(field: string) {
		return this.loanTypeForm.get(field);
	}

	/**
	* If user has not done any changes to form , this method is to check same and disable action btn save/update
	*/
	isFormValid(): boolean {
		if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.loanTypeForm.valid;
		}

		if (CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.loanTypeForm.valid || this.loanTypeForm.pristine
		} else {
			return false;
		}
	}
}