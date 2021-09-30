import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { BbcReviewService } from '@app/modules/abl/bbc-review-manual-input/services/bbc-review.service';
import * as moment from 'moment-timezone';
import { RollforwardLogDetailsModel, EditRFLogDetailsModel, EditRollforwardLogDetailsModel } from '@app/modules/abl/bbc-review-manual-input/rollforward-logs-model/rollforward-log';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';

@Component({
	selector: 'app-roll-forward-edit-popup-details',
	templateUrl: './roll-forward-edit-popup-details.component.html',
	styleUrls: ['./roll-forward-edit-popup-details.component.scss']
})
export class RollForwardEditPopupDetailsComponent implements OnInit {
	rollForwardLogsForm: FormGroup;
	divisionData: any;
	collateralData: any;
	selectedDivisionId: any;
	selectedCollateralId: any;
	selectedDivisionName: '';
	clientId: any;
	rollforward_to_adjust_collateral: any;
	isValid: boolean = false;
	onChangeAdjustCollateral: boolean = false;

	constructor(private renderer: Renderer2,
		private fb: FormBuilder,
		private apiMapper: APIMapper,
		private bbcReviewService: BbcReviewService,
		private helper: Helper,
		private route: Router,
		public dialogRef: MatDialogRef<RollForwardEditPopupDetailsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.clientId = CyncConstants.getSelectedClient();

	}

	ngOnInit() {
		this.createForm();
		this.intializerollForwardLogsData();
		this.getDivisionData();
		this.rollforward_to_adjust_collateral = this.data.rollforward_to_adjust_collateral;
		// if(this.data.selectedRollForwardlog[0].division_code_id != -1 && this.data.rollforward_to_adjust_collateral) {
		this.onChangeAdjustCollateral = true
		// }
	}

	ngOnDestroy() {
		this.dialogRef.close();
		this.route.navigate(['./bbc-review-manual-input/receivables-roll-forward']);
	}

	ngAfterViewInit() {
		this.setActividateAbsoluteStyle();
	}

	setActividateAbsoluteStyle() {
		if (document.querySelectorAll(".cync-png-calendrar-relative").length === 1) {
			const selectedElment = <HTMLElement>document.querySelectorAll(".cync-png-calendrar-relative")[0];
			selectedElment.style.position = 'absolute';
			selectedElment.style.zIndex = '10121';
		}
	}

	createForm() {
		this.rollForwardLogsForm = this.fb.group({
			'rollforward_log_lists': this.fb.array([])
		});
	}
	rollForwardLogsData() {
		return this.fb.group({
			'id': new FormControl(),
			'activity_date': new FormControl(),
			'division_code_id': new FormControl(),
			'collateral_advance_rate_id': new FormControl(),
			'new_sale': new FormControl(),
			'new_credit': new FormControl(),
			'cash_collected': new FormControl(),
			'new_adjustment': new FormControl(),
			'bbc_adjustment': new FormControl(),
			'user': new FormControl(),
			'collateralList': new FormControl({ value: '', disabled: true })
		});
	}
	/**
  * Get array result set
  */
	getParameterDataFormArray(arrayHeader: string) {
		return (<FormArray>this.rollForwardLogsForm.get(arrayHeader)).controls;
	}
	/**
	  * Patch roll forward log data
	  */
	intializerollForwardLogsData() {
		this.patchRollForwartdLogData(<FormArray>(this.rollForwardLogsForm.controls.rollforward_log_lists), this.data.selectedRollForwardlog);
	}

	/**
	* Patch rollforward log data
	*/
	patchRollForwartdLogData(parameterFormArray: FormArray, parameterDataList: any[]) {
		parameterDataList = parameterDataList.filter(elm => {
			return elm.user === "manual";
		});
		for (let i = 0; i < parameterDataList.length; i++) {
			const parameterData = parameterDataList[i];
			parameterDataList[i].activity_date = moment(parameterDataList[i].activity_date).format("MM/DD/YYYY");
			const parameterFormGroup = this.rollForwardLogsData();
			parameterFormGroup.patchValue(parameterData);
			this.getCollateralData(parameterData.division_code_id, 'collateralList', parameterFormGroup);
			parameterFormArray.push(parameterFormGroup);
		}
	}
	/**
	* get division data
	*/
	getDivisionData() {
		const url = this.apiMapper.endpoints[CyncConstants.GET_DIVISION_DATA].replace('{clientId}', this.clientId);
		this.bbcReviewService.getDivisionDataService(url).subscribe(response => {
			this.divisionData = (<any>JSON.parse(response._body)).division;
		});
	}

	getCollateralId(event: any) {
		this.selectedCollateralId = event.target.value;
	}
	/**
  *  update rollforward data
  * @param model
  */
	updateRollForwardData(model: EditRollforwardLogDetailsModel) {
		model.rollforward_log_lists.forEach(element => {
			element.activity_date = moment(element.activity_date.toString()).format("MM/DD/YYYY");
			if (element.division_code_id.toString() === "-1") {
				element.collateral_advance_rate_id = -1;
			}
		});
		let RollForwardrequestBody = { "rollforward_log": model }
		// removing unwanted key from body params
		for (let k of RollForwardrequestBody.rollforward_log.rollforward_log_lists) {
			delete k.collateralList;
		}
		const url = this.apiMapper.endpoints[CyncConstants.UPDATE_ROLLFORWARD_DATA].replace('{clientId}', this.clientId);
		this.bbcReviewService.updateRollForwardLogData(url, RollForwardrequestBody).subscribe(response => {
			this.bbcReviewService.setAction('edit');
			this.updateRecievableRollforwardData();
			const message = 'Updated Successfully'
			this.helper.showApiMessages(message, 'success');
			this.dialogRef.close();
		});
	}
	/**
	  * close edit popup
	  */
	cancelButtonClick() {
		this.dialogRef.close();
	}

	/**
	* Get Form Control field value according to index
	* @param field
	* @param indexValue
	*/
	getFormControlValue(field: string, indexValue: string) {
		const rollForwardFormArray: FormArray = <FormArray>(this.rollForwardLogsForm.controls.rollforward_log_lists);
		return rollForwardFormArray.controls[indexValue].get(field).value;

	}

	/**
	* Get collateral data
	*/
	getCollateralData(selectedDivisonId: string, collateralList: string, formGrp: FormGroup | number) {
		this.isValid = true;
		if(this.rollforward_to_adjust_collateral == true){
			this.onChangeAdjustCollateral= true;
		} else {
			this.onChangeAdjustCollateral= false;
		}
		if (formGrp instanceof FormGroup) {
			let url = this.apiMapper.endpoints[CyncConstants.GET_COLLATERAL_DATA].replace('{clientId}', this.clientId).replace('{divisionId}', selectedDivisonId).replace('{clientId}', this.clientId);
			this.bbcReviewService.getcollateralDataService(url).subscribe(response => {
				formGrp.get(collateralList).setValue((<any>JSON.parse(response._body)).collateral_advance_rate_id);
			});
		} else {
			let url = this.apiMapper.endpoints[CyncConstants.GET_COLLATERAL_DATA].replace('{clientId}', this.clientId).replace('{divisionId}', selectedDivisonId).replace('{clientId}', this.clientId);
			this.bbcReviewService.getcollateralDataService(url).subscribe(response => {
				const formArray: FormArray = <FormArray>(this.rollForwardLogsForm.controls.rollforward_log_lists);
				// let tempResponse = (JSON.parse(response._body)).collateral_advance_rate_id;
				// if(tempResponse.length > 0){
				// 	formArray.controls[formGrp].get('collateral_advance_rate_id').setValue(tempResponse[0].id);
				// }
				formArray.controls[formGrp].get('collateral_advance_rate_id').setValue(-1);
				return formArray.controls[formGrp].get(collateralList).setValue((<any>JSON.parse(response._body)).collateral_advance_rate_id);
			});

		}
	}
	changecollateral() {
		this.isValid = true;
	}
	/**
		* update recievable roll forward data
		*/
	updateRecievableRollforwardData() {
		const url = this.apiMapper.endpoints[CyncConstants.DIVISION_LIST_WITH_ID_NULL].replace('{clientId}', this.clientId);
		this.bbcReviewService.getinitializeData(url).subscribe(response => {
			let gridlist = <any>JSON.parse(response._body);
			this.bbcReviewService.setRollForward(gridlist);
		})
	}

	/**
 * to restrict characters in numeric filed
 */
	onKeyPressEvent(event) {
		var e = window.event || event;
		var charCode = e.which || e.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57 || charCode > 107 || charCode > 219 || charCode > 221) && charCode != 40 && charCode != 32 && charCode != 41 && (charCode < 43 || charCode < 45 || charCode > 46)) {
			if (window.event) {
				window.event.returnValue = false;
			} else {
				e.preventDefault();
			}

		}
		return true;

	}

	/*
		* Method to validate a number
		* 
		*/
	toValidateNumber(event: any, field: string) {
		if (event.target.value === "") {
			this.isValid = false;
		} else {
			this.isValid = true;
		}
	}

	isFormValid(): boolean {
		if (this.rollForwardLogsForm.pristine) {
			return true;
		}
		else {
			if (this.isValid === true) {
				return false;
			} else {
				return true;

			}
		}
	}
}
