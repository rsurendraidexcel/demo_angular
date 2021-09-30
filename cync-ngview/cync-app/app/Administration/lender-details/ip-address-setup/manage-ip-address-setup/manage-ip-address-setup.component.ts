import { Component, OnInit } from '@angular/core';
import { IpAddressSetupService } from '../services/ip-address-setup.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import {
	IPAddressRecord,
	IPAddressRequestOrResponse,
	IPAddressType
} from '@app/Administration/lender-details/ip-address-setup/models/ip-address-setup.model';

@Component({
	selector: 'app-manage-ip-address-setup',
	templateUrl: './manage-ip-address-setup.component.html',
	styleUrls: ['./manage-ip-address-setup.component.scss']
})
export class ManageIpAddressSetupComponent implements OnInit {

	headerText: string;
	currentAction: string = CyncConstants.ADD_OPERATION;
	addEditIpAddress: FormGroup;
	ipAddressId: number;
	currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
	saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
	cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
	IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;
	isFixedSelected: boolean;
	isRangeSelected: boolean;
	removedFields: IPAddressType[] = [];

	constructor(
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _fb: FormBuilder,
		private _msgServices: MessageServices,
		private _ipAddressSetupService: IpAddressSetupService,
		private _formValidationService: FormValidationService
	) { }

	ngOnInit() {
		this.initializeForm();
	}

	/**
	   * Method to initialize the form
	   */
	initializeForm() {
		this.addEditIpAddress = this._fb.group({
			// dropdown array
			'ipTypesList': new Array(),
			'id': new FormControl(),
			'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])), // Label Name : Name
			'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])), // Label Name : Description
			'ip_type': new FormControl('', Validators.compose([Validators.required])), // Label Name : IP Type
			'active': new FormControl(''), // Label Name :Status
			'ip_ranges': this._fb.array([
				this.initializeIpRangeFields()
			])
		});
		this.getDropdownValues();
	}

	/**
	 * Method to initialize Fixed and Range Fields
	 */
	initializeIpRangeFields() {
		return this._fb.group({
			'id': new FormControl(),
			'name': new FormControl(''), // Label Name : Name
			'fixed_ip': new FormControl(''), // Label Name : IP
			'description': new FormControl(''), // Label Name : Description
			'range_from': new FormControl(''), // Label Name : From
			'range_to': new FormControl('') // Label Name : To
		});
	}

	/**
	 * Method to return Form Array control
	 * to display multiple Fixed and Range Fields
	 */
	get IpRangeControls() {
		return <FormArray>this.addEditIpAddress.get('ip_ranges');
	}

	/**
	 * Method to get all the drop down values
	 */
	getDropdownValues() {
		this._msgServices.showLoader(true);
		this._ipAddressSetupService.getIpTypeList(this._apiMapper.endpoints[CyncConstants.GET_IP_TYPE_LIST])
			.subscribe(ipTypeResponse => {
				// console.log("::: ipTypeResponse----", ipTypeResponse);
				this.addEditIpAddress.get('ipTypesList').patchValue(ipTypeResponse);
				this.addEditIpAddress.get('ip_type').setValue(CyncConstants.FIXED);
				this.checkCurrentAction();
			});
	}

	/**
	 * Method to check the current action (add or update)
	 */
	checkCurrentAction() {
		this._activatedRoute.params.subscribe(params => {
			const tmpId = params['id'];
			if (tmpId !== undefined && tmpId !== 'add') {
				// Update Action
				this.ipAddressId = tmpId;
				this.currentAction = CyncConstants.EDIT_OPERATION;
				this.headerText = 'IP Address Setup - Edit';
				this.getRecordAndUpdateFormFields();
				this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
			} else {
				// Create Action
				this.currentAction = CyncConstants.ADD_OPERATION;
				this.headerText = 'IP Address Setup - Add';
				this.setDefaultValues();
			}
		});
	}

	/**
	 * Method to set Default values for few form fields
	 */
	setDefaultValues() {
		this.addEditIpAddress.get('active').setValue(true);
		const control = <FormArray>this.addEditIpAddress.get('ip_ranges');
		const ipType = this.addEditIpAddress.get('ip_type').value;
		if (ipType === CyncConstants.FIXED) {
			this.setValidationsForFixedFields(control, 0);
		}
		this._msgServices.showLoader(false);
	}

	/**
	 * Method to get Record Details on Update Action
	 * and update the form fields
	 */
	getRecordAndUpdateFormFields() {
		let endpoint: string = this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_IP_ADDRESS_SETUP];
		if (this.ipAddressId > 0) {
			endpoint = endpoint + this.ipAddressId;
			this._ipAddressSetupService.getRecord(endpoint).subscribe(response => {
				// console.log("::: record response----", response);
				this.bindValuesToFormFields(response);
				// console.log("::: form value----", this.addEditIpAddress.value);
				this._msgServices.showLoader(false);
			});
		}
	}

	/**
	 * Method to set the validations and add multiple Fixed or Range fields
	 * based on the fetched record details
	 * @param response
	 */
	bindValuesToFormFields(response: IPAddressRecord) {
		if (response.ip_ranges.length > 1) {
			const control = <FormArray>this.addEditIpAddress.get('ip_ranges');
			for (let i = 1; i < response.ip_ranges.length; i++) {
				control.push(this.initializeIpRangeFields());
				if (i === (response.ip_ranges.length - 1)) {
					this.setValidationsForIpRangeFields(response.ip_type, response);
				}
			}
		} else {
			this.setValidationsForIpRangeFields(response.ip_type, response);
		}
	}

	/**
	 * Method to return the Header text that needs to be displayed
	 * on the UI based on the selected IP Type
	 */
	getSelectedIpType(): string {
		if (this.addEditIpAddress.get('ip_type').value === CyncConstants.FIXED) {
			return CyncConstants.HEADER_FIXED;
		}
		return CyncConstants.HEADER_RANGE;
	}

	/**
	 * Set validations for Fixed or Range Fields
	 * @param ipType
	 * @param response
	 */
	setValidationsForIpRangeFields(ipType: string, response: IPAddressRecord) {
		// console.log(":: Inside setValidationsForIpRangeFields");
		const ip_ranges_control = <FormArray>this.addEditIpAddress.get('ip_ranges');
		for (let i = 0; i < ip_ranges_control.length; i++) {
			if (ipType === CyncConstants.FIXED) {
				this.setValidationsForFixedFields(ip_ranges_control, i);
			}
			if (ipType === CyncConstants.RANGE) {
				this.setValidationsForRangeFields(ip_ranges_control, i);
			}
			if (i === (ip_ranges_control.length - 1)) {
				// console.log(":: binding values");
				this.addEditIpAddress.patchValue(response);
				this._msgServices.showLoader(false);
			}
		}

	}

	/**
	 * Set Validations for Fixed Fields
	 * @param ip_ranges_control
	 * @param index
	 */
	setValidationsForFixedFields(ip_ranges_control: FormArray, index: number) {
		// Set Validators for Name Field
		const name_control = <FormControl>ip_ranges_control.at(index).get('name');
		name_control.setValidators(Validators.compose([Validators.required, Validators.max(100)]));
		name_control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		name_control.reset();
		// set Validators for IP Field
		const fixed_ip_control = <FormControl>ip_ranges_control.at(index).get('fixed_ip');
		fixed_ip_control.setValidators(Validators.compose([Validators.required,
		this._formValidationService.validateIpAddress]));
		fixed_ip_control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		fixed_ip_control.reset();
	}

	/**
	 * Set Validations for Range Fields
	 * @param ip_ranges_control
	 * @param index
	 */
	setValidationsForRangeFields(ip_ranges_control: FormArray, index: number) {
		// Set Validators for Desrcription Field
		const description_control = <FormControl>ip_ranges_control.at(index).get('description');
		description_control.setValidators(Validators.compose([Validators.required, Validators.max(100)]));
		description_control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		description_control.reset();
		// set Validators for IP Range From Field
		const range_from_control = <FormControl>ip_ranges_control.at(index).get('range_from');
		range_from_control.setValidators(Validators.compose([Validators.required,
		this._formValidationService.validateIpAddress]));
		range_from_control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		range_from_control.reset();
		// set Validators for IP Range To Field
		const range_to_control = <FormControl>ip_ranges_control.at(index).get('range_to');
		range_to_control.setValidators(Validators.compose([Validators.required,
		this._formValidationService.validateIpAddress]));
		range_to_control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		range_to_control.reset();
	}



	/**
	   * @param field the formControl field name
	   * @param isFormArray if validations are to be done for formarray elements, this will be true
	   * @param index this will be index of each form array element
	   */
	getFormControl(field: string, isFormArray: boolean, index: number) {
		if (isFormArray) {
			return this.addEditIpAddress.controls['ip_ranges']['controls'][index].get(field);
		}
		return this.addEditIpAddress.get(field);
	}


	/**
	 * @param field the formControl field name
	 * @param isFormArray if validations are to be done for formarray elements, this will be true
	 * @param index this will be index of each form array element
	 */
	displayFieldCss(field: string, isFormArray: boolean, index: number) {
		if (isFormArray) {
			return this._helper.getFieldCss(field, this.addEditIpAddress.controls['ip_ranges']['controls'][index]);
		}
		return this._helper.getFieldCss(field, this.addEditIpAddress);
	}

	/**
	  * This Method is used to check if the current action is add
	  */
	isCurrentActionAdd(): boolean {
		return this._helper.isCurrentActionAdd(this.currentAction);
	}


	/**
	   * If user has not done any changes to form , this method is to check same and disable action btn save/update
	   */
	isFormValid(): boolean {
		if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.addEditIpAddress.valid;
		} else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			// we have to disable form btn
			return !this.addEditIpAddress.valid || this.addEditIpAddress.pristine;
		} else {
			// we dont have to disable btn
			return false;
		}
	}

	/**
	 * Method for routing to Summary Page
	 */
	navigateToIpAddressSetupSummary() {
		this._router.navigateByUrl(MenuPaths.IP_ADDRESS_SETUP_PATH);
	}

	/**
	 * Method to add multiple Fixed or Range Fields,
	 * based on the selected IP Type set validations for the
	 * newly added fields
	 * @param index
	 */
	addField(index: number) {
		const control = <FormArray>this.addEditIpAddress.get('ip_ranges');
		control.push(this.initializeIpRangeFields());
		const ipType = this.addEditIpAddress.get('ip_type').value;
		if (ipType === CyncConstants.FIXED) {
			this.setValidationsForFixedFields(control, index + 1);
		}
		if (ipType === CyncConstants.RANGE) {
			this.setValidationsForRangeFields(control, index + 1);
		}
	}

	/**
	 * Method to delete added Fixed or Range fields and
	 * maintain a backup array to store deleted fields
	 * @param index
	 */
	removeField(index: number) {
		const control = <FormArray>this.addEditIpAddress.get('ip_ranges');
		const tmpRemovedField: IPAddressType = control.at(index).value;
		tmpRemovedField._destroy = true;
		this.removedFields.push(tmpRemovedField);
		control.removeAt(index);
		this.addEditIpAddress.markAsDirty();
	}

	/**
	 * This event gets fired on change of IP Type
	 * @param ipType
	 */
	onChangeOfIpType(ipType: string) {
		// console.log("::: onChangeOfIpType -----", ipType);
		this.removeFieldsOnChangeOfIpType(ipType);
	}

	/**
	 * Remove and Set Validations for Fixed or Range fields
	 * based on the selected IP Type
	 * @param ipType
	 */
	removeFieldsOnChangeOfIpType(ipType) {
		const control = <FormArray>this.addEditIpAddress.get('ip_ranges');
		for (let i = control.length - 1; i > 0; i--) {
			control.removeAt(i);
		}
		if (ipType === CyncConstants.FIXED) {
			this.removeValidationsForRangeFields(control, 0);
			this.setValidationsForFixedFields(control, 0);
		}
		if (ipType === CyncConstants.RANGE) {
			this.setValidationsForRangeFields(control, 0);
			this.removeValidationsForFixedFields(control, 0);
		}
	}

	/**
	 * Method to clear validations for Fixed Fields
	 * @param ip_ranges_control
	 * @param index
	 */
	removeValidationsForFixedFields(ip_ranges_control: FormArray, index: number) {
		// Remove Validators for Name Field
		const name_control = <FormControl>ip_ranges_control.at(index).get('name');
		name_control.clearValidators();
		name_control.reset();
		// Remove Validators for IP Field
		const fixed_ip_control = <FormControl>ip_ranges_control.at(index).get('fixed_ip');
		fixed_ip_control.clearValidators();
		fixed_ip_control.reset();
	}

	/**
	 * Method to clear validations for Range Fields
	 * @param ip_ranges_control
	 * @param index
	 */
	removeValidationsForRangeFields(ip_ranges_control: FormArray, index: number) {
		// Remove Validators for Desrcription Field
		const description_control = <FormControl>ip_ranges_control.at(index).get('description');
		description_control.clearValidators();
		description_control.reset();
		// Remove Validators for IP Range From Field
		const range_from_control = <FormControl>ip_ranges_control.at(index).get('range_from');
		range_from_control.clearValidators();
		range_from_control.reset();
		// Remove Validators for IP Range To Field
		const range_to_control = <FormControl>ip_ranges_control.at(index).get('range_to');
		range_to_control.clearValidators();
		range_to_control.reset();
	}

	/**
	 * Method to add or update a record
	 * @param model
	 * @param isNew
	 */
	saveRecord(model: IPAddressRecord, isNew: boolean) {
		// console.log(":::inside saveRecord");
		if (this.addEditIpAddress.valid) {
			delete model['ipTypesList'];
			if (this.ipAddressId !== undefined && this.ipAddressId > 0) {
				// Update IP Address record
				this.updateRecord(this.modifyModelBeforeUpdate(model));
			} else {
				// Add IP Address record
				this.addRecord(model, isNew);
			}
		}
	}

	/**
	 * Method to add the removed fields to the request model
	 * before calling the update api
	 * @param model
	 */
	modifyModelBeforeUpdate(model: IPAddressRecord) {
		if (this.removedFields.length > 0) {
			const ip_ranges: IPAddressType[] = model.ip_ranges;
			this.removedFields.forEach(obj => {
				ip_ranges.push(obj);
			});
			model.ip_ranges = ip_ranges;
		}
		// console.log("::after---",model);
		return model;
	}

	/**
	 * Method to call the api for updating the record
	 * @param model
	 */
	updateRecord(model: IPAddressRecord) {
		// console.log(":::updateRecord model---", model);
		let endpoint: string = this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_IP_ADDRESS_SETUP];
		endpoint = endpoint + this.ipAddressId;
		const requestModel: IPAddressRequestOrResponse = new IPAddressRequestOrResponse();
		requestModel.ip_whitelist = model;
		this._msgServices.showLoader(true);
		this._ipAddressSetupService.updateRecord(endpoint, requestModel).subscribe(response => {
			if (response.status === CyncConstants.STATUS_204 || response.status === CyncConstants.STATUS_200) {
				// console.log(">>> successfully UPDATED IP Address record");
				this._msgServices.showLoader(false);
				// show success message
				this._helper.showApiMessages(CyncConstants.UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
				// redirect to summary page
				this.navigateToIpAddressSetupSummary();
			}
		});
	}

	/**
	 * Method to call the api for creating a record
	 * @param model
	 * @param isNew
	 */
	addRecord(model: IPAddressRecord, isNew: boolean) {
		// console.log(":::addRecord model---", model);
		const endpoint: string = this._apiMapper.endpoints[CyncConstants.ADD_IP_ADDRESS_SETUP];
		const requestModel: IPAddressRequestOrResponse = new IPAddressRequestOrResponse();
		requestModel.ip_whitelist = model;
		this._msgServices.showLoader(true);
		this._ipAddressSetupService.createRecord(endpoint, requestModel).subscribe(response => {
			if (response.status === CyncConstants.STATUS_201 || response.status === CyncConstants.STATUS_200) {
				// console.log("::successfully added IP Address setup record");
				this._msgServices.showLoader(false);
				// show success message
				this._helper.showApiMessages(CyncConstants.CREATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
				if (!isNew) {
					// redirect to summary page if isSaveAndNew is false
					this.navigateToIpAddressSetupSummary();
				} else {
					// reset form fields to add new record
					this.addEditIpAddress.reset();
					// initialize the removed fields array
					this.removedFields = [];
					this.initializeForm();
				}
			}
		});
	}

}
