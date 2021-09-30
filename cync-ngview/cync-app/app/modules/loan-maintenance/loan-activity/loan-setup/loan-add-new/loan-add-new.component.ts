import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { LoanSetupService } from '../service/loan-setup.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
	selector: 'app-loan-add-new',
	templateUrl: './loan-add-new.component.html',
	styleUrls: ['./loan-add-new.component.scss']
})
export class LoanAddNewComponent implements OnInit {

	public loanTypesDropDown: any;
	public createNewNonAblId: any;
	public interestRateCodeDropDown: any;
	createNewLoanSetUpForm: FormGroup;
	borrower_id: any;
	listFile = [];
	customMappingFields: FormArray;
	custom_fields_attributes = [];

	constructor(
		public dialogRef: MatDialogRef<LoanAddNewComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _apiMapper: APIMapper,
		private loanSetupService: LoanSetupService,
		public _helper: Helper,
		private fb: FormBuilder,
		private message: MessageServices
	) { }

	ngOnInit() {
		$("#loanType").hide();
		this.initFormValidator();
		this.getLoanTypeDropdownData();

		this._helper.getClientID().subscribe((data) => {
			this.borrower_id = data;
			if (data != null && data != undefined) {
				this.getInterestRateCodeData(Number(data));
			}
		});

	}

	initFormValidator() {
		this.createNewLoanSetUpForm = this.fb.group({
			loan_no: [''],
			loan_name: [''],
			loan_type: [''],
			credit_line_amt: '0.00',
			interest_rate_code_id: [''],
			min_interest_rt: '0.00',
			max_interest_rt: '0.00',
			loan_signed_on_dt: [''],
			loan_origination_dt: [''],
			loan_maturity_dt: [''],
			active: true,
			documents: [''],
			add_to_bbc: true,
			custom_fields: this.fb.array([])
		});
		this.customFieldMapping();
	}

	closeModal() {
		this.dialogRef.close();
	}
 // All DelatedArray FormArray
 delateAllFormArray(formArray: FormArray ){
	while (formArray.length !== 0) {
			 formArray.removeAt(0);
		 }
 }

// CustomeAttribute Mapping 
	customFieldMapping() {
		this.custom_fields_attributes= this.data.customFields;

		this.customMappingFields = <FormArray>this.createNewLoanSetUpForm.controls.custom_fields;
    this.delateAllFormArray(this.customMappingFields);

		if (this.custom_fields_attributes.length > 0) {
			this.custom_fields_attributes.forEach(elm => {
				if (elm.validation_type != 'LOV') {
					this.customMappingFields.push(
						this.fb.group({
							udf_name: [elm.udf_name],
							udf_value: [''],
							validation_type: [elm.validation_type],
							readonly_val: [elm.readonly_val],
							id: [null],
							udf_id: [elm.udf_id],
							attachable_type: [elm.attachable_type],
							attachable_id: [null],
							loan_type: ['NABL']
						})
					);
				}
				if (elm.validation_type === 'LOV') {
					this.customMappingFields.push(
						this.fb.group({
							udf_name: [elm.udf_name],
							udf_value: [elm.default_value],
							validation_type: [elm.validation_type],
							readonly_val: [elm.readonly_val],
							id: [null],
							udf_id: [elm.udf_id],
							attachable_type: [elm.attachable_type],
							attachable_id: [null],
							loan_type: ['NABL']
						})
					);

				}
			});
		}

		this.enableDisableUdfValue();

	}

	/**
	 * method to get all the values of loan type dropdown
	 */
	getLoanTypeDropdownData() {
		const url = this._apiMapper.endpoints[CyncConstants.GET_LOAN_TYPE_DROPDOWN_LIST];
		this.loanSetupService.getLoanType(url).subscribe(response => {
			let tempLoanType = <any>JSON.parse(response._body);
			this.loanTypesDropDown = tempLoanType.non_abl_loan_types;
			this.createNewLoanSetUpForm.get('loan_type').setValue(1);
		});
	}

	/**
	 * method to get all the values of interest rate code dropdown
	 */
	getInterestRateCodeData(id: number) {
		const url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_RATE_DROPDOWN_LIST].replace('{clientId}', id);
		this.loanSetupService.getInterestRateCode(url).subscribe(response => {
			let tempInterestRateCodeType = <any>JSON.parse(response._body);
			this.interestRateCodeDropDown = tempInterestRateCodeType.interest_rate_codes;
			this.createNewLoanSetUpForm.get('interest_rate_code_id').setValue('null');
		});
	}

	onFileSelect(event) {
		if (event.target.files.length > 0) {
			for (let i = 0; i < event.target.files.length; i++) {
				this.listFile.push(event.target.files[i]);
			}
		} else {
			this.listFile.push(event.target.files[0]);
		}
	}

	removeFile(index: number) {
		this.listFile.splice(index, 1);
	}

	saveData(): FormData {
		const formData = new FormData();
		if (this.createNewLoanSetUpForm.get('add_to_bbc').value === true) {
			this.createNewLoanSetUpForm.controls['add_to_bbc'].setValue('1');
		}
		else {
			this.createNewLoanSetUpForm.controls['add_to_bbc'].setValue('0');
		}
		formData.append("loan_number[loan_no]", this.createNewLoanSetUpForm.get('loan_no').value);
		formData.append("loan_number[loan_name]", this.createNewLoanSetUpForm.get('loan_name').value);
		formData.append("loan_number[borrower_id]", this.borrower_id);
		formData.append("loan_number[menu_id]", '');
		formData.append("loan_number[loan_type]", this.createNewLoanSetUpForm.get('loan_type').value);
		formData.append("loan_number[non_abl_loan_type_id]", this.createNewLoanSetUpForm.get('loan_type').value);
		formData.append("loan_number[credit_line_amt]", this.createNewLoanSetUpForm.get('credit_line_amt').value);
		formData.append("loan_number[interest_rate_code_id]", this.createNewLoanSetUpForm.get('interest_rate_code_id').value);
		//formData.append("loan_number[interest_rate_code_id]", this.createNewLoanSetUpForm.get('loan_signed_on_dt').value === '' ?  '' : this.createNewLoanSetUpForm.get('interest_rate_code_id').value);

		formData.append("loan_number[min_interest_rt]", this.createNewLoanSetUpForm.get('min_interest_rt').value);
		formData.append("loan_number[max_interest_rt]", this.createNewLoanSetUpForm.get('max_interest_rt').value);
		formData.append("loan_number[active]", this.createNewLoanSetUpForm.get('active').value);
		formData.append("loan_number[add_to_bbc]", this.createNewLoanSetUpForm.get('add_to_bbc').value);
		// formData.append("loan_number[ignore_cash_app_payments]", this.createNewLoanSetUpForm.get('ignore_cash_app_payments').value);

		formData.append("loan_number[loan_signed_on_dt]", (this.createNewLoanSetUpForm.get('loan_signed_on_dt').value === "" || this.createNewLoanSetUpForm.get('loan_signed_on_dt').value === null) ? '' : moment(this.createNewLoanSetUpForm.get('loan_signed_on_dt').value).format("MM/DD/YYYY"));
		formData.append("loan_number[loan_origination_dt]", (this.createNewLoanSetUpForm.get('loan_origination_dt').value === "" || this.createNewLoanSetUpForm.get('loan_origination_dt').value === null) ? '' : moment(this.createNewLoanSetUpForm.get('loan_origination_dt').value).format("MM/DD/YYYY"));
		formData.append("loan_number[loan_maturity_dt]", (this.createNewLoanSetUpForm.get('loan_maturity_dt').value === '' || this.createNewLoanSetUpForm.get('loan_maturity_dt').value === null) ? '' : moment(this.createNewLoanSetUpForm.get('loan_maturity_dt').value).format("MM/DD/YYYY"));
		let attribute = this.createNewLoanSetUpForm.get('custom_fields').value;
		attribute = attribute.map(elm => {
			if (elm.id === null) {
				return {
					id: null, udf_id: Number(elm.udf_id), attachable_id: null,
					udf_name: elm.udf_name, attachable_type: elm.attachable_type, readonly_val: elm.readonly_val,
					loan_type: elm.loan_type, validation_type: elm.validation_type, udf_value: elm.udf_value
				};
			} else {
				return {
					id: Number(elm.id), udf_id: Number(elm.udf_id), attachable_id: Number(elm.attachable_id),
					udf_name: elm.udf_name, attachable_type: elm.attachable_type, readonly_val: elm.readonly_val,
					loan_type: elm.loan_type, validation_type: elm.validation_type, udf_value: elm.udf_value
				};
			}

		})
		formData.append("loan_number[custom_fields_attributes]", JSON.stringify(attribute));
		for (let k = 0; k < this.listFile.length; k++) {
			formData.append(`loan_number[document_files_attributes][file_${k}]`, this.listFile[k], this.listFile[k].name);
		}
		return formData;
	}

	// set id 
	setCreateNewMclLoanId() {
		this.loanSetupService.setCreateNewMclLoanId(this.createNewNonAblId);
	}

	onClickSave() {
		const formData = this.saveData();
		this.message.showLoader(true);
		let url = this._apiMapper.endpoints[CyncConstants.SAVE_NON_ABL_LOAN];
		this.loanSetupService.createNonAblData(url, formData).subscribe(resposList => {
			var data = <any>JSON.parse(resposList._body);

			if (resposList.status === 201) {
				this.createNewNonAblId = data;
				this.setCreateNewMclLoanId();
				this.dialogRef.close();
				const message = 'Loan Created successfully';
				this._helper.showApiMessages(message, 'success');
			}
			this.message.showLoader(false);
		});
	}

	createSaveAndNew() {
		const formData = this.saveData();
		//this.saveData();
		this.message.showLoader(true);
		let url = this._apiMapper.endpoints[CyncConstants.SAVE_NON_ABL_LOAN];
		this.loanSetupService.createNonAblData(url, formData).subscribe(resposList => {
			var data = <any>JSON.parse(resposList._body);

			if (resposList.status === 201) {
				this.createNewNonAblId = data;
				this.setCreateNewMclLoanId();
				const message = 'Loan Created successfully';
				this._helper.showApiMessages(message, 'success');
			}
			this.clearForm();
			this.message.showLoader(false);
		}, (error) => {
			console.log('Nothing:');
		});

		this.listFile = [];
	}

	/**
	 * method to clear the form
	 */
	clearForm() {

		this.createNewLoanSetUpForm.controls['loan_no'].reset();
		this.createNewLoanSetUpForm.controls['loan_name'].reset();
		this.createNewLoanSetUpForm.get('credit_line_amt').setValue('0.00');
		this.createNewLoanSetUpForm.get('loan_type').setValue(1);
		this.createNewLoanSetUpForm.get('interest_rate_code_id').setValue('null');
		this.createNewLoanSetUpForm.get('min_interest_rt').setValue('0.00');
		this.createNewLoanSetUpForm.get('max_interest_rt').setValue('0.00');
		this.createNewLoanSetUpForm.get('active').setValue('true');
		this.createNewLoanSetUpForm.controls['loan_signed_on_dt'].reset();
		this.createNewLoanSetUpForm.controls['loan_origination_dt'].reset();
		this.createNewLoanSetUpForm.controls['loan_maturity_dt'].reset();
		this.createNewLoanSetUpForm.controls['add_to_bbc'].setValue(true);

	}

 //Enabled UDf Field
 enableDisableUdfValue() {
		(<FormArray>this.createNewLoanSetUpForm.get('custom_fields')).controls.forEach((elm, index) => {
			if (elm.get('validation_type').value !== "LOV") {
				if (elm.get('readonly_val').value === "true") {
					elm.get('udf_value').disable();

				} else {
					elm.get('udf_value').enable();

				}
			} else {
				if (elm.get('readonly_val').value === "true") {
					elm.get('udf_value').disable();

				} else {
					elm.get('udf_value').enable();

				}
			}
		})
	}
}
