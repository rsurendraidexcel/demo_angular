import { Component, OnInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { TermCodesService } from "../service/term-codes.service";
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, FormControlName } from '@angular/forms';
import { TermCodeModel, TermCodeRequestModel } from '../model/term-codes.model';

@Component({
	selector: 'app-manage-term-codes',
	templateUrl: './manage-term-codes.component.html',
	styleUrls: ['./manage-term-codes.component.scss']
})
export class ManageTermCodesComponent implements OnInit {

	termCodesForm: FormGroup;
	termCodesAPIResponse: any;
	isNew: boolean;
	selectedRowData: any;
	getStatusDropdown = ['active', 'inactive'];
	disableField: any;

	constructor(
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private _commonAPIs: CommonAPIs,
		private _message: MessageServices,
		private _termCodesService: TermCodesService,
		private _router: Router,
		private _fb: FormBuilder,
		private elementRef: ElementRef
	) { }

	ngOnInit() {
		this._message.showLoader(true);
		this.renderFormType();
		this.createForm();
		this.initializeTermCodes();
	}

	/**
	* Render form type add or edit
	*/
	renderFormType() {
		this.selectedRowData = CyncConstants.getTermCodeRowData();
		if (this.selectedRowData !== '' && this.selectedRowData !== undefined && this.selectedRowData !== null) {
			this.isNew = false;
		} else {
			this.isNew = true;
		}
	}

	/**
	* Initial Form creation
	*/
	createForm() {
		this.termCodesForm = this._fb.group({
			'id': new FormControl(),
			'name': new FormControl('', Validators.compose([Validators.required])),
			'description': new FormControl(),
			'days': new FormControl('', Validators.compose([Validators.required])),
			'status': new FormControl('active', Validators.compose([]))
		});
	};

	/**
	* Initialize Term Codes
	*/
	initializeTermCodes() {
		if (!this.isNew) {
			let url = this._apiMapper.endpoints[CyncConstants.GET_TERM_CODES_DATA_BY_ID].replace('{id}', this.selectedRowData.id);
			this._termCodesService.getTermCodeByID(url).subscribe(res => {
				this.disableField = res.in_use;
				this.termCodesAPIResponse = res;
				this.termCodesForm.patchValue(res);
				this._message.showLoader(false);
			}, error => {
				this._message.showLoader(false);
			});
		} else {
			this._message.showLoader(false);
		}
	};

	/**
	* Cancel button click event
	*/
	@Output() close = new EventEmitter();
	onClose() {
		let isFormUpdated = false;
		let tempObject = this.termCodesForm.value;
		const formValues = Object.keys(tempObject).map(key => tempObject[key]);
		for (let i = 0; i < formValues.length - 1; i++) {
			if (formValues[i] != null && formValues[i] != "" && formValues[i] != undefined) {
				isFormUpdated = true;
			}
		}
		if (this.termCodesForm.dirty) {
			// This is for create new term code if all values are not empty/undefined/null
			if (isFormUpdated) {
				const popupParam = { 'title': CyncConstants.CONFIRMATION_POPUP_TITLE, 'message': CyncConstants.CANCEL_BUTTON_POPUP_MESSAGE, 'msgType': 'warning' };
				this._helper.openConfirmPopup(popupParam).subscribe(result => {
					if (result) {
						CyncConstants.setTermCodeRowData('');
						this.close.emit(null);
					} else {
						return false
					}
				});
			} else {
				CyncConstants.setTermCodeRowData('');
				this.close.emit(null);
			}
		} else {
			CyncConstants.setTermCodeRowData('');
			this.close.emit(null);
		}
	}

	/**
	* Save or update term data
	* @param model 
	* @param isValid 
	*/
	saveTermCode(model: TermCodeModel, isValid: any) {
		this._message.showLoader(true);
		let requestBody = new TermCodeRequestModel();
		requestBody.term_code = model;
		if (this.isNew) {
			// Create new term code
			let url = this._apiMapper.endpoints[CyncConstants.ADD_TERM_CODES];
			this._termCodesService.saveTermCode(url, requestBody).subscribe(result => {
				this._helper.showApiMessages(CyncConstants.SAVE_MESSAGE, CyncConstants.SUCCESS_CSS);
				this._message.showLoader(false);
				CyncConstants.setTermCodeRowData('');
				this.close.emit(null);
			}, error => {
				console.log("Inside create new error block: ", error);
				this._message.showLoader(false);
			});

		} else {
			// Update existing term code
			let url = this._apiMapper.endpoints[CyncConstants.UPDATE_TERM_CODES].replace('{id}', this.termCodesAPIResponse.id);
			this._termCodesService.updateTermCode(url, requestBody).subscribe(result => {
				this._helper.showApiMessages(CyncConstants.UPDATE_MESSAGE, CyncConstants.SUCCESS_CSS);
				this._message.showLoader(false);
				CyncConstants.setTermCodeRowData('');
				this.close.emit(null);
			}, error => {
				console.log("Inside update error block: ", error);
				this._message.showLoader(false);
			});
		}
	}

	/**
	* Get form control value
	* @param field
	*/
	getFormControl(field: string) {
		return this.termCodesForm.get(field);
	}

	/**
	* Method to hightlight mandatory fileds if form validations fail
	* @param field 
	*/
	displayCssField(field: string) {
		return this._helper.getFieldCss(field, this.termCodesForm);
	}

	/**
	* Change status dropdown value event
	*/
	changeStatus() {
		let selectedValue = this.termCodesForm.get('status').value;
		this.termCodesForm.get('status').setValue(selectedValue);
	}
}
