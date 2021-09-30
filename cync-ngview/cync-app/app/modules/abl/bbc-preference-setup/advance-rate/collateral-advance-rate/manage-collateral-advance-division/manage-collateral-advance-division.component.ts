import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Router } from '@angular/router';
import { CollateralAdvanceRateService } from '../service/collateral-advance-rate.service';
import { AddOrUpdateAdvanceRateDivisionRequest, AddOrUpdateAdvacneRateDivision } from '../model/collateral-advance-rate.model';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-manage-collateral-advance-division',
	templateUrl: './manage-collateral-advance-division.component.html',
	styleUrls: ['./manage-collateral-advance-division.component.scss']
})

/**
* @author Sanjay Gupta
*/

export class ManageCollateralAdvanceDivisionComponent implements OnInit {

	advanceRateDivisionAction: string = CyncConstants.GET_ADD_ACTION;
	advanceRateDivisionForm: FormGroup;
	advanceRateDivisionId: any;
	currentAction: string = CyncConstants.ADD_OPERATION;
	currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
	saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
	cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
	borrowerId: string;

	constructor(private _message: MessageServices,
		private _apiMapper: APIMapper,
		private _router: Router,
		private _helper: Helper,
		private _activateRoute: ActivatedRoute,
		private fb: FormBuilder,
		private collateral_advance_rate_service: CollateralAdvanceRateService) {
		this.borrowerId = CyncConstants.getSelectedClient();
	}

	ngOnInit() {
		this._message.showLoader(true);
		this.initFormValidator();
		this._renderForm();
		this._helper.adjustUI();
	}

	/**
	  * Initial form validation
	  */
	initFormValidator() {
		this.advanceRateDivisionForm = this.fb.group({
			name: new FormControl('', Validators.compose([Validators.required])),
			description: new FormControl('', Validators.compose([Validators.required]))
		});
	}

	/**
	  * Render form
	  */
	_renderForm() {
		this._activateRoute.params.subscribe(params => {
			this.advanceRateDivisionId = params['id'];
			if (this.advanceRateDivisionId !== undefined && !this._helper.isCurrentActionAdd(this.advanceRateDivisionId)) {
				this.currentAction = CyncConstants.EDIT_OPERATION;
				this.advanceRateDivisionAction = CyncConstants.EditHeading;
				this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
				this.collateral_advance_rate_service.getAdvanceRateDivisionRecord(this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_COLLATERAL_DIVISION].replace('{selectedClientId}', this.borrowerId).replace('{selectedRecordId}', this.advanceRateDivisionId)).subscribe(result => {
					this.advanceRateDivisionForm.patchValue(result);
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
	  * Save & Update Advance rate code division data
	  */
	saveData(model: AddOrUpdateAdvacneRateDivision, isValid: boolean, isNew: boolean) {
		if (isValid) {
			this._message.showLoader(true);
			let requestBody = new AddOrUpdateAdvanceRateDivisionRequest();
			requestBody.division_code = model;

			if (this.isCurrentActionAdd()) {
				//Add new 
				this.collateral_advance_rate_service.saveAdvacnceRateDivision(this._apiMapper.endpoints[CyncConstants.ADD_COLLATERAL_DIVISION].replace('{selectedClientId}', this.borrowerId), requestBody).subscribe(results => {
					this._message.showLoader(false);
					this._message.addSingle('Record saved successfully.', 'success');
					if (!isNew) {
						this.goToListAdvacneRateDivision();
					} else {
						this.advanceRateDivisionForm.reset();
					}
				});
			} else {
				//Update
				this.collateral_advance_rate_service.updateAdvacnceRateDivision(this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_COLLATERAL_DIVISION].replace('{selectedClientId}', this.borrowerId).replace('{selectedRecordId}', this.advanceRateDivisionId), requestBody).subscribe(results => {
					this._message.showLoader(false);
					this._message.addSingle('Record updated successfully.', 'success');
					this.goToListAdvacneRateDivision();
				});
			}
		}
	}

	/**
	  * Navigate to home page
	  */
	goToListAdvacneRateDivision() {
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.COLLATERAL_ADVACNE_RATE_HOME_REDIRECT]);
		this._message.showLoader(false);
	}

	/**
	* CSS display according to validation
	* @param field
	*/
	displayFieldCss(field: string) {
		return this._helper.getFieldCss(field, this.advanceRateDivisionForm)
	}

	/**
	* Get form control validation
	* @param field
	*/
	getFormControl(field: string) {
		return this.advanceRateDivisionForm.get(field);
	}

	/**
	* If user has not done any changes to form , this method is to check same and disable action btn save/update
	*/
	isFormValid(): boolean {
		if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.advanceRateDivisionForm.valid;
		} else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			// we have to disable form btn
			return !this.advanceRateDivisionForm.valid || this.advanceRateDivisionForm.pristine
		} else {
			// we dont have to disable btn
			return false;
		}
	}
}
