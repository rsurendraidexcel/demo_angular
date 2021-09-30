import { Component, OnInit } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { UdfDefinitionService } from '@app/Administration/user-defined-field/udf-definition/services/udf-definition.service';
import {
	UDFDefinitionRecord,
	UDFRequestOrReponse,
	UdfValidators,
	LOVFields
} from '@app/Administration/user-defined-field/udf-definition/models/udf-definition.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';

@Component({
	selector: 'app-manage-udf-definition',
	templateUrl: './manage-udf-definition.component.html',
	styleUrls: ['./manage-udf-definition.component.scss']
})
export class ManageUdfDefinitionComponent implements OnInit {

	currentAction: string = CyncConstants.ADD_OPERATION;
	addEditUdfDefinition: FormGroup;
	// isSaveAndNew: boolean;
	udfDefinitionId: number;
	headerText: string;
	currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
	saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
	cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
	IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;
	backupUdfRecord: UDFDefinitionRecord;
	isRangeSelected: boolean;
	isLengthSelected: boolean;
	isLOVSelected: boolean;


	constructor(
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _fb: FormBuilder,
		private _msgServices: MessageServices,
		private _udfDefinitionService: UdfDefinitionService,
		private _formValidationService: FormValidationService
	) { }

	ngOnInit() {
		this.initializeForm();
	}

	/**
	 * Method to initialize the form
	 */
	initializeForm() {
		this.addEditUdfDefinition = this._fb.group({
			// dropdown arrays
			'fieldTypeList': new Array(),
			'validationTypeList': new Array(),
			// form fields
			'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])), // Label Name :UDF Name
			'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])), // Label Name :Description
			'field_type': new FormControl('', Validators.compose([Validators.required])), // Label Name :Field Type
			'validation_type': new FormControl('', Validators.compose([Validators.required])), // Label Name :Validation Type
			'active': new FormControl(''), // Label Name :Status
			'is_mandatory': new FormControl(''), // Label Name :UDF Name
			'is_unique': new FormControl(''), // Label Name :UDF Name
			'is_updatable': new FormControl(''), // Label Name :UDF Name
			'is_unique_value': new FormControl(''), // Label Name :Unique Field Value
			'udf_value': new FormControl(''), // Label Name :Unique Field Value Text box, this will be displayed only if Unique Field Value is true
			'value_length': this.initializeLengthFields(),
			'value_range': this.initializeRangeFields(),
			'list_of_values': this._fb.array([
				this.initializeLOVFields()
			]),
			'is_sort_by_alphabetic': new FormControl('') // Label Name:Sort in Alphabetical Order
		});

		this.getDropdownValues();
		this.setDefaultValues();
	}

	initializeLengthFields() {
		return this._fb.group({
			'min_length': new FormControl(''), // Label Name :Min Length
			'max_length': new FormControl(''), // Label Name :Max Length
			'is_fixed_length': new FormControl(''), // Label Name :Fixed Length
			'length_value': new FormControl('')// Label Name :Length Value
		});
	}

	initializeRangeFields() {
		return this._fb.group({
			'range_min': new FormControl(''), // Label Name :Min Value
			'range_max': new FormControl(''), // Label Name :Max Value
		});
	}

	initializeLOVFields() {
		return this._fb.group({
			'id': new FormControl(''), // hidden field
			'lov_value': new FormControl(''), // Label Name :LOV Value
			'description': new FormControl(''), // Label Name :Description
			'is_default_value': new FormControl(''), // Label Name :Default Value
		});
	}

	/**
	 * Method to return Form Array control
	 * to display multiple LOV Fields
	 */
	get LOVControls() {
		return <FormArray>this.addEditUdfDefinition.get('list_of_values');
	}

	/**
	 * Check If current action is Add or Update
	 */
	checkCurrentAction() {
		this._activatedRoute.params.subscribe(params => {
			const tmpId = params['id'];
			if (tmpId !== undefined && tmpId !== 'add') {
				// Update Action
				this.udfDefinitionId = tmpId;
				this.currentAction = CyncConstants.EDIT_OPERATION;
				this.headerText = 'UDF Definition - Edit';
				// this._msgServices.showLoader(true);
				this.getRecordAndUpdateFormFields();
				this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
			} else {
				// Create Action
				this.currentAction = CyncConstants.ADD_OPERATION;
				this.headerText = 'UDF Definition - Add';
				this._msgServices.showLoader(false);
			}
		});
	}

	/**
	 * Method to fetch record details
	 * and update the form fields
	 */
	getRecordAndUpdateFormFields() {
		let endpoint: string = this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_UDF_DEFINITION];
		if (this.udfDefinitionId > 0) {
			endpoint = endpoint + this.udfDefinitionId;
			this._udfDefinitionService.getRecord(endpoint).subscribe(response => {
				// console.log(":::response----", response);
				/**
				 * While updating the record user may change the field type
				 * and validation type values hence maintaining a backup
				 * of the fetched record details
				 */
				this.backupUdfRecord = response;
				// get Validation Type dropdown values based on the field type
				// this.onChangeOfFieldType(response.field_type);
				this.fetchValidationTypeList(response.field_type);
				// console.log(":::before binding data----", this.addEditUdfDefinition.value);
				// update the form fields
				this.bindValuesToFormFields(response);
				// this.addEditUdfDefinition.patchValue(response);
				/**
				 * Based on the Validation Type set the validations
				 * for form fields and set default values
				 */
				if (response.validation_type === CyncConstants.RANGE) {
					this.isRangeSelected = true;
					this.setValidationForRangeFields();
				}
				if (response.validation_type === CyncConstants.LENGTH) {
					this.isLengthSelected = true;
					if (response.value_length.is_fixed_length !== null && response.value_length.is_fixed_length) {
						this.onChangeOfFixedLength(response.value_length.is_fixed_length);
					} else {
						this.onChangeOfFixedLength(false);
					}
				}
				if (response.validation_type === CyncConstants.LOV && !this.isLOVSelected) {
					this.isLOVSelected = true;
					this.setValidationForLovFields();
					this.addAndUpdateLovFields(response.list_of_values);
				}
				// CYNCS-3365 Issue changes
				if (response.is_unique_value) {
					this.setValidationForUdfValue();
				}
			});
		}
	}

	bindValuesToFormFields(response: UDFDefinitionRecord) {
		if ((this.addEditUdfDefinition.get('fieldTypeList').value !== null &&
			this.addEditUdfDefinition.get('fieldTypeList').value.length > 0) &&
			(this.addEditUdfDefinition.get('validationTypeList').value !== null &&
				this.addEditUdfDefinition.get('validationTypeList').value.length > 0)) {
			// console.log("::Binding values to form fields");
			// update the form fields
			this.addEditUdfDefinition.patchValue(response);
			this._msgServices.showLoader(false);
			// console.log(":::after binding data----", this.addEditUdfDefinition.value);
		}
	}

	/**
	 * Method to Add Multiple LOV Fields and update the LOV form fields
	 * @param list_of_values
	 */
	addAndUpdateLovFields(list_of_values: LOVFields[]) {
		if (list_of_values.length > 1) {
			const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
			for (let i = 1; i < list_of_values.length; i++) {
				control.push(this.initializeLOVFields());
			}
			control.patchValue(list_of_values);
		}
	}

	/**
	* This Method is used to check if the current action is add
	*/
	isCurrentActionAdd(): boolean {
		return this._helper.isCurrentActionAdd(this.currentAction);
	}

	/**
	 * Method to get Field type and Validation type
	 * dropdown values
	 */
	getDropdownValues() {
		this._msgServices.showLoader(true);
		this._udfDefinitionService.getFieldTypeList(
			this._apiMapper.endpoints[CyncConstants.GET_FIELD_TYPE_LIST]).subscribe(ftResponse => {
				// console.log("::FieldTypeList---", response);
				this.addEditUdfDefinition.controls['fieldTypeList'].patchValue(ftResponse);
				// set the first option of Field type as selected in Add Screen
				if (this.currentAction === CyncConstants.ADD_OPERATION) {
					this.addEditUdfDefinition.controls['field_type'].setValue(ftResponse[0].column_value);
				}

				this._udfDefinitionService.getValidationTypeList(
					this._apiMapper.endpoints[CyncConstants.GET_NUMERIC_VALIDATION_TYPE]).subscribe(vtResponse => {
						// console.log("::Numeric ValidationType---", response);
						this.addEditUdfDefinition.controls['validationTypeList'].patchValue(vtResponse);
						// set the NONE option of Validation type as selected in Add Screen
						if (this.currentAction === CyncConstants.ADD_OPERATION) {
							this.addEditUdfDefinition.controls['validation_type'].setValue(CyncConstants.NONE);
						}

						// Once the dropdown values are fetched, check the current action (Create or Update)
						this.checkCurrentAction();

					});

			});
	}

	/**
	 * Method to set default values of few form fields
	 */
	setDefaultValues() {
		// initially UDF definition record status has to be true
		this.addEditUdfDefinition.get('active').setValue(true);
		// Lov field attribute sort_by_alphabetic checkbox has to be unchecked, if default value is not set it takes blank values
		this.addEditUdfDefinition.get('is_sort_by_alphabetic').setValue(false);
		// setting the checkbox values as false(unchecked), bcoz if default value is not set it takes blank values
		this.addEditUdfDefinition.get('is_mandatory').setValue(false);
		this.addEditUdfDefinition.get('is_unique').setValue(false);
		this.addEditUdfDefinition.get('is_updatable').setValue(false);
		this.addEditUdfDefinition.get('is_unique_value').setValue(false);
		// set default values for length fields
		if (this.currentAction === CyncConstants.ADD_OPERATION) {
			this.setDefaultValuesForLengthFields();
		}
		// set first lov default value as true
		this.setLovDefaultValueAsChecked();

	}

	/**
	 * This event gets fired when Field Type dropdown value gets changed
	 * and based on the field type, validation type drop down values are fetched
	 * @param fieldType
	 */
	onChangeOfFieldType(fieldType: string) {
		this.fetchValidationTypeList(fieldType);
		this.resetValidationForLengthFields();
		this.resetValidationForRangeFields();
		this.resetValidationForLovFields();
		this.resetOtherConditions();
	}

	/**
	 * Method to fetch validation type drop down values based on the selected field type
	 * @param fieldType
	 */
	fetchValidationTypeList(fieldType: string) {
		if (fieldType === CyncConstants.ALPHA_NUMERIC) {
			this._msgServices.showLoader(true);
			// Fetch Validation Type drop down values for Field Type --> ALPHA_NUMERIC
			this._udfDefinitionService.getValidationTypeList(
				this._apiMapper.endpoints[CyncConstants.GET_ALPHANUMERIC_VALIDATION_TYPE]).subscribe(response => {
					// console.log("::AlphaNumeric ValidationType---", response);
					// populate dropdown values
					this.addEditUdfDefinition.controls['validationTypeList'].patchValue(response);
					if (this.currentAction === CyncConstants.ADD_OPERATION) {
						// set the NONE option of Validation type as selected in Add Screen
						this.addEditUdfDefinition.controls['validation_type'].setValue(CyncConstants.NONE);
					} else {
						if (this.backupUdfRecord.validation_type === CyncConstants.RANGE) {
							/**
							 * set the NONE option of Validation type as selected in Update Screen, since Validation Type --> RANGE
							 * does not exist for Field Type --> ALPHA_NUMERIC
							 */
							this.addEditUdfDefinition.controls['validation_type'].setValue(CyncConstants.NONE);
						} else {
							/**
							* set the option fetched from the record details as selected in Update Screen
							*/
							this.addEditUdfDefinition.controls['validation_type'].setValue(this.backupUdfRecord.validation_type);
						}
					}
					// since validation type drop down values are updated, hide all the fields based on the below conditions
					if (this.currentAction === CyncConstants.ADD_OPERATION ||
						(this.backupUdfRecord !== undefined &&
							(this.backupUdfRecord.validation_type !== this.addEditUdfDefinition.get('validation_type').value))) {
						this.hideOrShowValidationTypeFields(false, false, false);
					}
					this._msgServices.showLoader(false);
				});
		} else {
			this._msgServices.showLoader(true);
			// Fetch Validation Type drop down values for Field Type --> NUMERIC
			this._udfDefinitionService.getValidationTypeList(
				this._apiMapper.endpoints[CyncConstants.GET_NUMERIC_VALIDATION_TYPE]).subscribe(response => {
					// console.log("::Numeric ValidationType---", response);
					// populate dropdown values
					this.addEditUdfDefinition.controls['validationTypeList'].patchValue(response);
					if (this.currentAction === CyncConstants.ADD_OPERATION) {
						this.addEditUdfDefinition.controls['validation_type'].setValue(CyncConstants.NONE);
					} else {
						this.addEditUdfDefinition.controls['validation_type'].setValue(this.backupUdfRecord.validation_type);
					}
					if (this.currentAction === CyncConstants.ADD_OPERATION ||
						(this.backupUdfRecord !== undefined &&
							(this.backupUdfRecord.validation_type !== this.addEditUdfDefinition.get('validation_type').value))) {
						this.hideOrShowValidationTypeFields(false, false, false);
					}
					this._msgServices.showLoader(false);
				});
		}
	}

	/**
	 * Method to hide all the form fields
	 */
	hideOrShowValidationTypeFields(isRangeSelected: boolean, isLOVSelected: boolean, isLengthSelected: boolean) {
		// console.log(":::hiding all validation types");
		this.isRangeSelected = isRangeSelected;
		this.isLOVSelected = isLOVSelected;
		this.isLengthSelected = isLengthSelected;
	}

	/**
	 * This event gets fired when validation type drop down value gets changed
	 * and based on the validation type, validations are added for the form fields
	 * @param validationType
	 */
	onChangeOfValidationType(validationType: string) {
		const fieldType: string = this.addEditUdfDefinition.get('field_type').value;
		if ((fieldType === CyncConstants.NUMERIC || fieldType === CyncConstants.ALPHA_NUMERIC) &&
			(validationType === CyncConstants.LENGTH)) {
			// remove validations for Other conditions (checkboxes section)
			this.resetOtherConditions();
			// LENGTH Form fields are shown and other form fields are hidden
			this.hideOrShowValidationTypeFields(false, false, true);
			if (this.backupUdfRecord !== undefined && (this.backupUdfRecord.validation_type !== validationType)) {
				// Default values are set for length form fields, if validation type is not equal to LENGTH while updating
				this.setDefaultValuesForLengthFields();
			}
			// add validation for length form fields
			this.setValidationForLengthFields();
			// remove validation for Range Fields
			if (fieldType === CyncConstants.NUMERIC) {
				this.resetValidationForRangeFields();
			}
			// remove validation for LOV Fields
			this.resetValidationForLovFields();
			// console.log(":::Length");
		}
		if ((fieldType === CyncConstants.NUMERIC || fieldType === CyncConstants.ALPHA_NUMERIC) &&
			(validationType === CyncConstants.LOV && !this.isLOVSelected)) {
			// remove validations for Other conditions (checkboxes section)
			this.resetOtherConditions();
			// LOV Form fields are shown and other form fields are hidden
			this.hideOrShowValidationTypeFields(false, true, false);
			// add validation for LOV form fields
			this.setValidationForLovFields();
			// remove validation for Range Fields
			if (fieldType === CyncConstants.NUMERIC) {
				this.resetValidationForRangeFields();
			}
			// remove validation for Length Fields
			this.resetValidationForLengthFields();
			// console.log(":::LOV");
		}
		if ((fieldType === CyncConstants.NUMERIC) && (validationType === CyncConstants.RANGE)) {
			// remove validations for Other conditions (checkboxes section)
			this.resetOtherConditions();
			// RANGE Form fields are shown and other form fields are hidden
			this.hideOrShowValidationTypeFields(true, false, false);
			// add validation for Range form fields
			this.setValidationForRangeFields();
			// remove validation for Length Fields
			this.resetValidationForLengthFields();
			// remove validation for LOV Fields
			this.resetValidationForLovFields();
			// console.log(":::Range");
		}
		if ((fieldType === CyncConstants.NUMERIC || fieldType === CyncConstants.ALPHA_NUMERIC) &&
			(validationType === CyncConstants.NONE)) {
			// hide all the validation type fields
			this.hideOrShowValidationTypeFields(false, false, false);
			// remove validation for all validation type fields
			this.resetValidationForNone();
			// console.log(":::None");
		}

	}

	/**
	 * Method to add Validations for form controls
	 * @param formFieldsList
	 */
	setValidationForFormFields(formFieldsList: UdfValidators[]) {
		for (let i = 0; i < formFieldsList.length; i++) {
			formFieldsList[i].control.setValidators(Validators.compose(formFieldsList[i].validator));
			formFieldsList[i].control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
			// console.log(":::vt 1---", this.addEditUdfDefinition.get('validation_type').value)
			if ((!this.isLOVSelected && this.currentAction === CyncConstants.ADD_OPERATION) ||
				(this.backupUdfRecord !== undefined &&
					this.backupUdfRecord.validation_type !== this.addEditUdfDefinition.get('validation_type').value &&
					!this.isLOVSelected)) {
				// console.log("::reset form field");
				formFieldsList[i].control.reset();
			}
		}
	}

	/**
	 * Method to remove the Validations
	 * @param controlsArr
	 */
	clearValidationForFormFields(controlsArr: FormControl[]) {
		for (let i = 0; i < controlsArr.length; i++) {
			// console.log("::clearing validator for --",controlsArr[i]);
			controlsArr[i].clearValidators();
			controlsArr[i].reset();
		}
	}

	/**
	 * Method to get the Range Fields FormControl
	 * and add Validation for it
	 */
	setValidationForRangeFields() {
		const formFieldsList: UdfValidators[] = [];
		const range_min: UdfValidators = new UdfValidators();
		const range_max: UdfValidators = new UdfValidators();
		range_min.control = <FormControl>this.addEditUdfDefinition.get('value_range.range_min');
		range_min.validator = [Validators.required, Validators.min(1)];
		range_max.control = <FormControl>this.addEditUdfDefinition.get('value_range.range_max');
		range_max.validator = [Validators.required, Validators.min(1)];
		formFieldsList.push(range_min);
		formFieldsList.push(range_max);
		this.setValidationForFormFields(formFieldsList);
	}

	/**
	 * Method to remove the validations for Range Form Fields
	 */
	resetValidationForRangeFields() {
		// console.log(":: clear Validation for range fields");
		const controlsArr: FormControl[] = [];
		controlsArr.push(<FormControl>this.addEditUdfDefinition.get('value_range.range_min'));
		controlsArr.push(<FormControl>this.addEditUdfDefinition.get('value_range.range_max'));
		this.clearValidationForFormFields(controlsArr);
	}

	/**
	 * Method to get the LENGTH Fields FormControl
	 * and add Validation for it
	 */
	setValidationForLengthFields() {
		const is_fixed_length_control = <FormControl>this.addEditUdfDefinition.get('value_length.is_fixed_length');
		let formFieldsList: UdfValidators[];
		const length_value: UdfValidators = new UdfValidators();
		const min_length: UdfValidators = new UdfValidators();
		const max_length: UdfValidators = new UdfValidators();
		if (is_fixed_length_control.value) {
			// console.log("::Fixed length is checked");
			length_value.control = <FormControl>this.addEditUdfDefinition.get('value_length.length_value');
			length_value.validator = [Validators.required, Validators.min(1), Validators.max(255)];
			formFieldsList = [];
			formFieldsList.push(length_value);
			this.setValidationForFormFields(formFieldsList);
			this.addEditUdfDefinition.get('value_length.min_length').clearValidators();
			this.addEditUdfDefinition.get('value_length.max_length').clearValidators();
		} else {
			// console.log("::Fixed length is unchecked");
			formFieldsList = [];
			this.addEditUdfDefinition.get('value_length.length_value').clearValidators();
			min_length.control = <FormControl>this.addEditUdfDefinition.get('value_length.min_length');
			min_length.validator = [Validators.required, Validators.min(1), Validators.max(255)];
			formFieldsList.push(min_length);
			max_length.control = <FormControl>this.addEditUdfDefinition.get('value_length.max_length');
			max_length.validator = [Validators.required, Validators.min(1), Validators.max(255)];
			formFieldsList.push(max_length);
			this.setValidationForFormFields(formFieldsList);
		}
	}

	/**
	 * Method to remove the validations for LENGTH Form Fields
	 */
	resetValidationForLengthFields() {
		// console.log(":: clear Validation for length fields");
		const controlsArr: FormControl[] = [];
		controlsArr.push(<FormControl>this.addEditUdfDefinition.get('value_length.length_value'));
		controlsArr.push(<FormControl>this.addEditUdfDefinition.get('value_length.min_length'));
		controlsArr.push(<FormControl>this.addEditUdfDefinition.get('value_length.max_length'));
		this.clearValidationForFormFields(controlsArr);
		if (this.currentAction === CyncConstants.ADD_OPERATION) {
			this.setDefaultValuesForLengthFields();
		}
	}

	/**
	 * Method to set default values for Length form fields
	 */
	setDefaultValuesForLengthFields() {
		// console.log("::setting default values for Length fields");
		this.addEditUdfDefinition.get('value_length.is_fixed_length').setValue(false);
		this.addEditUdfDefinition.get('value_length.length_value').reset();
		this.addEditUdfDefinition.get('value_length.length_value').disable();
		this.addEditUdfDefinition.get('value_length.min_length').enable();
		this.addEditUdfDefinition.get('value_length.max_length').enable();
	}


	/**
	 * Method to get the LOV Fields FormControl
	 * and add Validation for it
	 */
	setValidationForLovFields() {
		const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
		const fieldType: string = this.addEditUdfDefinition.get('field_type').value;
		let formFieldsList: UdfValidators[];
		const lov_value: UdfValidators = new UdfValidators();
		const description: UdfValidators = new UdfValidators();
		const is_default_value: UdfValidators = new UdfValidators();
		for (let i = control.length - 1; i >= 0; i--) {
			if (fieldType === CyncConstants.ALPHA_NUMERIC) {
				// If field type is Alpha Numeric required validation and MinLength, MaxLength validation is added
				formFieldsList = [];
				lov_value.control = <FormControl>control.at(i).get('lov_value');
				lov_value.validator = [Validators.required, Validators.minLength(1), Validators.maxLength(255)];
				formFieldsList.push(lov_value);
				description.control = <FormControl>control.at(i).get('description');
				description.validator = [Validators.required, Validators.minLength(1), Validators.maxLength(255)];
				formFieldsList.push(description);
				this.setValidationForFormFields(formFieldsList);
			} else {
				// If field type is Numeric, required validation and non negative number validation is added
				formFieldsList = [];
				lov_value.control = <FormControl>control.at(i).get('lov_value');
				lov_value.validator = [Validators.required, Validators.min(1)];
				formFieldsList.push(lov_value);
				description.control = <FormControl>control.at(i).get('description');
				description.validator = [Validators.required, Validators.minLength(1), Validators.maxLength(255)];
				formFieldsList.push(description);
				this.setValidationForFormFields(formFieldsList);
			}
		}
		if (this.currentAction === CyncConstants.ADD_OPERATION ||
			(this.backupUdfRecord !== undefined && (this.backupUdfRecord.validation_type !== CyncConstants.LOV))) {
			this.setLovDefaultValueAsChecked();
		}
	}

	/**
	 * Method to set the first LOV field's, default value checkbox as true
	 */
	setLovDefaultValueAsChecked() {
		// The first LOV default value checkbox has to be checked
		const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
		control.at(0).get('is_default_value').setValue(true);
	}

	/**
	 * Method to remove validations for LOV Fields
	*/
	resetValidationForLovFields() {
		// console.log("::LOV form fields are reset");
		const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
		control.at(0).get('lov_value').clearValidators();
		control.at(0).get('description').clearValidators();
		control.at(0).get('is_default_value').clearValidators();
		control.at(0).reset();
		control.at(0).get('is_default_value').setValue(true);
		// if (this.currentAction === CyncConstants.ADD_OPERATION ||
		// 	(this.backupUdfRecord !== undefined && (this.backupUdfRecord.validation_type !== CyncConstants.LOV))) {
		// 		console.log("::test reset");
		// 	this.addEditUdfDefinition.get('list_of_values').reset();
		// 	if (control.length > 1) {
		// 		for (let i = control.length - 1; i > 0; i--) {
		// 			control.removeAt(i);
		// 		}
		// 	}
		// }
		if (control.length > 1) {
			for (let i = control.length - 1; i > 0; i--) {
				control.removeAt(i);
			}
		}
	}

	/**
	 * Remove all validations for Validation type -->NONE
	 */
	resetValidationForNone() {
		const validationType: string = this.addEditUdfDefinition.get('validation_type').value;
		if (validationType === CyncConstants.NONE) {
			// remove validation for length fields
			this.resetValidationForLengthFields();
			// remove validation for range fields
			this.resetValidationForRangeFields();
			// remove validation for lov fields
			this.resetValidationForLovFields();
			// remove validations for Other conditions (checkboxes section)
			this.resetOtherConditions();
		}
	}

	/**
	 * This event gets fired when Fixed Length Checkbox value gets changed
	 * @param checked
	 */
	onChangeOfFixedLength(checked: boolean) {
		// console.log(":::is_fixed_length---", checked);
		const length_value_control = <FormControl>this.addEditUdfDefinition.get('value_length.length_value');
		const min_length_control = <FormControl>this.addEditUdfDefinition.get('value_length.min_length');
		const max_length_control = <FormControl>this.addEditUdfDefinition.get('value_length.max_length');
		// this.setRequiredValidationForLengthFields();
		this.setValidationForLengthFields();
		if (checked) {
			// If Fixed Length Checkbox is checked enable the Length value Field and disable the MIN,MAX Fields
			length_value_control.enable();
			min_length_control.reset();
			min_length_control.disable();
			max_length_control.reset();
			max_length_control.disable();
		} else {
			// If Fixed Length Checkbox is Unchecked enable the MIN,MAX Fields and disable the Length value Field
			length_value_control.disable();
			length_value_control.reset();
			min_length_control.enable();
			max_length_control.enable();
		}
	}

	/**
	 * Method to add new LOV Fields on click of add button (Plus icon)
	 * @param index
	 */
	addLov(index) {
		// console.log("::add LOV");
		const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
		control.push(this.initializeLOVFields());
		control.at(index + 1).get('is_default_value').setValue(false);
		this.setValidationForLovFields();
	}

	/**
	 * Method to remove LOV Fields on click of remove button (Minus icon)
	 * @param index
	 */
	removeLov(index) {
		// console.log("::removeLov");
		const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
		control.removeAt(index);
		this.addEditUdfDefinition.markAsDirty();
	}

	/**
	 * This event gets fired when LOV Default Value Checkbox value gets changed
	 * @param index
	 */
	onChangeOfLovDefaultValue(index: number) {
		// console.log(":::index---", index);
		const control = <FormArray>this.addEditUdfDefinition.get('list_of_values');
		for (let i = control.length - 1; i >= 0; i--) {
			const isChecked: boolean = control.at(i).get('is_default_value').value;
			if (isChecked && i !== index) {
				control.at(i).get('is_default_value').setValue(false);
			}
		}
	}

	/**
	 * This event gets fired when Updatable Checkbox value gets changed
	 * @param checked
	 */
	onChangeOfUpdatableField(checked: boolean) {
		this.resetUniqueFieldValueCheckbox();
		this.resetValidationForUdfValue();
		// checked ? is_unique_value_control.disable() : is_unique_value_control.enable();
	}

	/**
	 * This event gets fired when UniqueFieldValue Checkbox value gets changed
	 * @param checked
	 */
	onChangeOfUniqueFieldValue(checked: boolean) {
		const is_updatable_control = <FormControl>this.addEditUdfDefinition.get('is_updatable');
		const udf_value_control = <FormControl>this.addEditUdfDefinition.get('udf_value');
		if (checked) {
			is_updatable_control.setValue(false);
			// udf_value_control.setValidators(Validators.compose([Validators.required]));
			this.setValidationForUdfValue();
		} else {
			// udf_value_control.setValidators(Validators.compose([]));
			this.resetValidationForUdfValue();
		}
		// udf_value_control.reset();
	}

	// ----------------- CYNCS-3365 Issue changes starts -------------------------

	/**
	 * Method to clear validations and reset the other conditions fields(checkboxes section)
	 */
	resetOtherConditions() {
		const udf_value_control = <FormControl>this.addEditUdfDefinition.get('udf_value');
		this.resetUniqueFieldValueCheckbox();
		this.resetValidationForUdfValue();
		udf_value_control.reset();
	}

	/**
	 * Method to Uncheck the Unique Field Value Checkbox
	 */
	resetUniqueFieldValueCheckbox() {
		const is_unique_value_control = <FormControl>this.addEditUdfDefinition.get('is_unique_value');
		if (is_unique_value_control.value) {
			is_unique_value_control.setValue(false);
		}
	}

	/**
	 * Method to set Validation for UDF Value text box(its visible only if Unique Field Value Checkbox is checked),
	 * based on the validation type fields
	 */
	setValidationForUdfValue() {
		const field_type_control = <FormControl>this.addEditUdfDefinition.get('field_type');
		const validation_type_control = <FormControl>this.addEditUdfDefinition.get('validation_type');
		const udf_value_control = <FormControl>this.addEditUdfDefinition.get('udf_value');
		const range_min_control = <FormControl>this.addEditUdfDefinition.get('value_range.range_min');
		const range_max_control = <FormControl>this.addEditUdfDefinition.get('value_range.range_max');
		const is_fixed_length_control = <FormControl>this.addEditUdfDefinition.get('value_length.is_fixed_length');
		const length_value_control = <FormControl>this.addEditUdfDefinition.get('value_length.length_value');
		const min_length_control = <FormControl>this.addEditUdfDefinition.get('value_length.min_length');
		const max_length_control = <FormControl>this.addEditUdfDefinition.get('value_length.max_length');
		if (validation_type_control.value === CyncConstants.RANGE) {
			// console.log("RANGE, Numeric");
			// If validation type is Range, then udf value should be a valid number and
			// must be between the defined MinValue & MaxValue
			this.setUdfValueValidators(udf_value_control, CyncConstants.RANGE, [Validators.required, this._formValidationService.validateNumber,
			Validators.min(range_min_control.value), Validators.max(range_max_control.value)]);

		}
		if (validation_type_control.value === CyncConstants.LENGTH) {
			if (is_fixed_length_control.value) {

				if (field_type_control.value === CyncConstants.NUMERIC) {
					// console.log("Fixed LENGTH, Numeric");
					// If validation type is Length (FIXED LENGTH), then udf value should be a valid number and
					// must accept fixed number of digits
					this.setUdfValueValidators(udf_value_control, CyncConstants.LENGTH, [Validators.required, this._formValidationService.validateNumber,
					Validators.minLength(length_value_control.value), Validators.maxLength(length_value_control.value)]);

				} else {
					// console.log("Fixed LENGTH, AlphaNumeric");
					// If validation type is Length (FIXED LENGTH), then udf value should be a alphanumeric and
					// must accept fixed number of digits
					this.setUdfValueValidators(udf_value_control, CyncConstants.LENGTH, [Validators.required,
					Validators.minLength(length_value_control.value), Validators.maxLength(length_value_control.value)]);
				}

			} else {

				if (field_type_control.value === CyncConstants.NUMERIC) {
					// console.log("MinMax Length, Numeric");
					// If validation type is Length (MinLength & MaxLength), then udf value should be a valid number and
					// must accept the defined min & max number of digits
					this.setUdfValueValidators(udf_value_control, CyncConstants.LENGTH, [Validators.required, this._formValidationService.validateNumber,
					Validators.minLength(min_length_control.value), Validators.maxLength(max_length_control.value)]);

				} else {
					// console.log("MinMax Length, AlphaNumeric");
					// If validation type is Length (MinLength & MaxLength), then udf value should be a alphanumeric and
					// must accept the defined min & max number of digits
					this.setUdfValueValidators(udf_value_control, CyncConstants.LENGTH, [Validators.required,
					Validators.minLength(min_length_control.value), Validators.maxLength(max_length_control.value)]);
				}
			}
		}
		if (validation_type_control.value === CyncConstants.NONE) {
			// console.log("::NONE");
			// If validation type is NONE, then udf value should have only Required validation
			this.setUdfValueValidators(udf_value_control, CyncConstants.NONE, [Validators.required]);
		}
	}

	/**
	 * Method to update the assigned form Validators for UDF Value
	 * @param udf_value_control
	 * @param validationType
	 * @param validators
	 */
	setUdfValueValidators(udf_value_control: FormControl, validationType: string, validators: ValidatorFn[]) {
		udf_value_control.setValidators(Validators.compose(validators));
		udf_value_control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		if (this.currentAction === CyncConstants.ADD_OPERATION ||
			(this.backupUdfRecord !== undefined &&
				(this.backupUdfRecord.validation_type !== validationType))) {
			udf_value_control.reset();
		}
	}

	/**
	 * Method to clear the Validators for UDF Value
	 */
	resetValidationForUdfValue() {
		const udf_value_control = <FormControl>this.addEditUdfDefinition.get('udf_value');
		udf_value_control.clearValidators();
		udf_value_control.reset();
	}

	// ------------------- CYNCS-3365 Issue changes ends-------------------

	/**
	 * Method to add or update the record
	 * @param model
	 */
	saveRecord(model: UDFDefinitionRecord, isNew: boolean) {
		// console.log("valid form ", this.addEditUdfDefinition.valid)
		if (this.addEditUdfDefinition.valid) {
			delete model['fieldTypeList'];
			delete model['validationTypeList'];
			// console.log(":::model---", model);
			if (this.udfDefinitionId !== undefined && this.udfDefinitionId > 0) {
				// Update udf record
				// console.log(":::updating record");
				this.updateRecord(this.modifyModel(model));
			} else {
				// Add udf record
				// console.log(":::adding record");
				this.addRecord(this.modifyModel(model), isNew);
			}
		}

	}

	/**
	 * Method to modify the request Model based on the validation type
	 * @param model
	 */
	modifyModel(model: UDFDefinitionRecord) {
		if (model.validation_type === CyncConstants.NONE) {
			model.value_length = null;
			model.value_range = null;
			model.list_of_values = null;
		}
		if (model.validation_type === CyncConstants.RANGE) {
			model.value_length = null;
			model.list_of_values = null;
		}
		if (model.validation_type === CyncConstants.LOV) {
			model.value_length = null;
			model.value_range = null;
			if (this.currentAction === CyncConstants.ADD_OPERATION) {
				const list_of_values = model.list_of_values;
				for (let i = 0; i < list_of_values.length; i++) {
					delete model['list_of_values'][i]['id'];
				}
			}
		}
		if (model.validation_type === CyncConstants.LENGTH) {
			model.value_range = null;
			model.list_of_values = null;
		}
		return model;
	}

	/**
	 * Call the API to add a record
	 * @param model
	 */
	addRecord(model: UDFDefinitionRecord, isNew: boolean) {
		const endpoint: string = this._apiMapper.endpoints[CyncConstants.ADD_UDF_DEFINITION];
		const requestModel: UDFRequestOrReponse = new UDFRequestOrReponse();
		requestModel.udf = model;
		this._udfDefinitionService.createRecord(endpoint, requestModel).subscribe(response => {
			if (response.status === CyncConstants.STATUS_201 || response.status === CyncConstants.STATUS_200) {
				// console.log("::successfully added udf definition record");
				// show success message
				this._helper.showApiMessages(CyncConstants.CREATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);

				if (!isNew) {
					// redirect to summary page if isSaveAndNew is false
					this.navigateToUdfDefinitionSummary();
				} else {
					// reset form fields to add new record
					this.addEditUdfDefinition.reset();
					this.initializeForm();
					// hide all validation fields
					this.hideOrShowValidationTypeFields(false, false, false);
					// this.isSaveAndNew = false;
				}

			}
		});

	}

	/**
	 * Call the API to update the record
	 * @param model
	 */
	updateRecord(model: UDFDefinitionRecord) {
		let endpoint: string = this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_UDF_DEFINITION];
		endpoint = endpoint + this.udfDefinitionId;
		const requestModel: UDFRequestOrReponse = new UDFRequestOrReponse();
		requestModel.udf = model;
		// console.log(":::update record---model---", model);
		this._udfDefinitionService.updateRecord(endpoint, requestModel).subscribe(response => {
			if (response.status === CyncConstants.STATUS_204 || response.status === CyncConstants.STATUS_200) {
				// console.log(">>> successfully UPDATED udf definition record");
				// show success message
				this._helper.showApiMessages(CyncConstants.UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
				// redirect to summary page
				this.navigateToUdfDefinitionSummary();
			}
		});
	}

	/**
	 * Method to save and add a new record
	 * @param model
	 */
	// saveAndAddNew(model: UDFDefinitionRecord) {
	// 	this.isSaveAndNew = true;
	// 	this.saveRecord(model);
	// }

	/**
	 * Redirect to UDF Definition Summary Page
	 */
	navigateToUdfDefinitionSummary() {
		this._router.navigateByUrl(MenuPaths.UDF_DEFINITION_PATH);
	}

	/**
	 * If user has not done any changes to form , this method is to check same and disable action btn save/update
	 */
	isFormValid(): boolean {
		if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			return !this.addEditUdfDefinition.valid;
		} else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			// we have to disable form btn
			return !this.addEditUdfDefinition.valid || this.addEditUdfDefinition.pristine;
		} else {
			// we dont have to disable btn
			return false;
		}
	}

	/**
	 * @param field the formControl field name
	 * @param isFormArray if validations are to be done for formarray elements, this will be true
	 * @param index this will be index of each form array element
	 */
	getFormControl(field: string, isFormArray: boolean, index: number) {
		if (isFormArray) {
			return this.addEditUdfDefinition.controls['list_of_values']['controls'][index].get(field);
		}
		return this.addEditUdfDefinition.get(field);
	}


	/**
	 * @param field the formControl field name
	 * @param isFormArray if validations are to be done for formarray elements, this will be true
	 * @param index this will be index of each form array element
	 */
	displayFieldCss(field: string, isFormArray: boolean, index: number) {
		if (isFormArray) {
			return this._helper.getFieldCss(field, this.addEditUdfDefinition.controls['list_of_values']['controls'][index]);
		}
		return this._helper.getFieldCss(field, this.addEditUdfDefinition);
	}

}
