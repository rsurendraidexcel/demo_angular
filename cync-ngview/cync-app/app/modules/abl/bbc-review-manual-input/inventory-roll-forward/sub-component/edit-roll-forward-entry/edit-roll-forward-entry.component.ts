import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { BbcReviewService } from '../../../services/bbc-review.service';
import { Helper } from '@cyncCommon/utils/helper';
import { EditInventoryRollforwardLogDetailsModel } from '../../../receivables-rollforward/inventory-rollforward-model/inventory-rollforward';

@Component({
  selector: 'app-edit-roll-forward-entry',
  templateUrl: './edit-roll-forward-entry.component.html',
  styleUrls: ['./edit-roll-forward-entry.component.scss']
})
export class EditRollForwardEntryComponent implements OnInit {
  rollForwardLogsForm: FormGroup;
  divisonData:any;
  collateralData:any;
  productGroupData:any;
  isValid: boolean = false;
  clientId = CyncConstants.getSelectedClient();

  constructor(	private fb: FormBuilder,
    private apiMapper: APIMapper,
    private bbcReviewService: BbcReviewService,
    private helper:Helper,
    public editDialogRef: MatDialogRef<EditRollForwardEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  
  ngOnInit() {
	console.log("clientId add",this.clientId)
    this.createForm();
    this.intializerollForwardLogsData();
    this.getDivisonData();
    // this.getProductGroupData();
      }

      createForm() {
        this.rollForwardLogsForm = this.fb.group({
          'records': this.fb.array([])
        });
      }

      rollForwardLogsData() {
        return this.fb.group({
          'id': new FormControl(),
          'activity_date': new FormControl(),
          'division_code_id': new FormControl(),
          'collateral_advance_rate_id': new FormControl(),
          'product_group_id': new FormControl(),
          'removals': new FormControl(),
          'credits': new FormControl(),
          'purchases': new FormControl(),
          'new_adjustment': new FormControl(),
          'bbc_adjustment': new FormControl(),
          'collateralList': new FormControl({ value: '', disabled: true }),
          'productGroupList': new FormControl({ value: '', disabled: true })
        });
      }
     
      	/**
  * Get array result set
  */
	getParameterDataFormArray(arrayHeader: string) {
		return (<FormArray>this.rollForwardLogsForm.get(arrayHeader)).controls;
	}
	/**
	* Get Form Control field value according to index
	* @param field
	* @param indexValue
	*/
	getFormControlValue(field: string, indexValue: string) {
		const rollForwardFormArray: FormArray = <FormArray>(this.rollForwardLogsForm.controls.records);
		return rollForwardFormArray.controls[indexValue].get(field).value;

  }
  	/**
	  * Patch roll forward log data
	  */
	intializerollForwardLogsData() {
    console.log("dddata",this.data.selectedRollForwardlog)
		this.patchRollForwartdLogData(<FormArray>(this.rollForwardLogsForm.controls.records), this.data.selectedRollForwardlog);
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
      if(parameterDataList[i].division_code_id === -1){
				parameterDataList[i].division_code_id = '';
			}
			if(parameterDataList[i].collateral_advance_rate_id === -1){
				parameterDataList[i].collateral_advance_rate_id = '';
			}
			if(parameterDataList[i].product_group_id === -1){
				parameterDataList[i].product_group_id = '';
			}
			const parameterFormGroup = this.rollForwardLogsData();
			parameterFormGroup.patchValue(parameterData);
			console.log("parameterData",parameterData)
			// this.rollForwardLogsForm.get('division_code_id').setValue(parameterData.division_code_id);
			// this.rollForwardLogsForm.get('product_group_id').setValue(parameterData.product_group_id);
		 this.getCollateralData(parameterData.division_code_id, 'collateralList', parameterFormGroup);
		 this.getProductListData(parameterData.collateral_advance_rate_id, 'productGroupList', parameterFormGroup);
			parameterFormArray.push(parameterFormGroup);
		}
	}
  getDivisonData() {
		const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_DIVISION_LIST].replace('{clientId}', this.clientId);

		this.bbcReviewService.getDivisionData(url).subscribe(response => {
			// this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.divisonData = list.divisions;

		}, error => {
			// this.isDataLoaded = false;

		}
		)
  }

  getProductGroupData() {
		const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_PRODUCT_GROUP_NAME].replace('{clientId}', this.clientId);

		this.bbcReviewService.getProductGroupData(url).subscribe(response => {
			// this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.productGroupData = list.product_groups;

		}, error => {
			// this.isDataLoaded = false;

		}
		)
  }
  	/**
	* Get collateral data
	*/
	getCollateralData(selectedDivisonId: string, collateralList: string, formGrp: FormGroup | number) {
		 this.isValid = true;
		// if(this.rollforward_to_adjust_collateral == true){
		// 	this.onChangeAdjustCollateral= true;
		// } else {
		// 	this.onChangeAdjustCollateral= false;
		// }
		if (formGrp instanceof FormGroup) {
			if(parseInt(selectedDivisonId) > 0){
				let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA_BASED_ON_DIVISION_ID].replace('{clientId}', this.clientId).replace('{division_id}',selectedDivisonId);
				this.bbcReviewService.getcollateralDataService(url).subscribe(response => {
					formGrp.get(collateralList).setValue((<any>JSON.parse(response._body)).collaterals);
				});
      }else{  
      	formGrp.get(collateralList).setValue([]);
		  }
		} else {
			  let that = this;
				const formArray: FormArray = <FormArray>(that.rollForwardLogsForm.controls.records);
				formArray.controls[formGrp].get('collateral_advance_rate_id').setValue("");
				formArray.controls[formGrp].get('product_group_id').setValue("");
      	formArray.controls[formGrp].get('productGroupList').setValue([]);
				if(parseInt(selectedDivisonId) > 0){ 
	      		let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA_BASED_ON_DIVISION_ID].replace('{clientId}', this.clientId).replace('{division_id}',selectedDivisonId);
	      		this.bbcReviewService.getCollateralData(url).subscribe(response => {
							return formArray.controls[formGrp].get(collateralList).setValue((<any>JSON.parse(response._body)).collaterals);
					});
	      }else{
	      	return formArray.controls[formGrp].get(collateralList).setValue([]);
	      }
		}
	}


	getProductListData(collateral_id, productGroupList: string, formGrp: FormGroup | number) {
		 this.isValid = true;
		// if(this.rollforward_to_adjust_collateral == true){
		// 	this.onChangeAdjustCollateral= true;
		// } else {
		// 	this.onChangeAdjustCollateral= false;
		// }
		// let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_PRODUCT_GROUP_NAME].replace('{clientId}', this.clientId).replace("{collateral_id}", collateral_id);
		let url = "borrowers/{clientId}/inventory_rollforwards/product_groups?collateral_advance_rate_id={collateral_id}".replace('{clientId}', this.clientId).replace("{collateral_id}", collateral_id);
		if (formGrp instanceof FormGroup) {
			if(parseInt(collateral_id) > 0){
				this.bbcReviewService.getProductGroupData(url).subscribe(response => {
				formGrp.get("productGroupList").setValue((<any>JSON.parse(response._body)).product_groups);
				});
			}else{	
				formGrp.get("productGroupList").setValue([]);
		  }
		} else {
      		let that = this;
      		const formArray: FormArray = <FormArray>(that.rollForwardLogsForm.controls.records);
      		formArray.controls[formGrp].get('product_group_id').setValue("");
      		if(parseInt(collateral_id) > 0){
      			this.bbcReviewService.getProductGroupData(url).subscribe(response => {
						return formArray.controls[formGrp].get("productGroupList").setValue((<any>JSON.parse(response._body)).product_groups);
						});
    	    }else{
    				return formArray.controls[formGrp].get("productGroupList").setValue([]);		
    			}
		}
	}
		/**
  *  update rollforward data
  * @param model
  */
 updateRollForwardData(model: EditInventoryRollforwardLogDetailsModel) {
	model.records.forEach(element => {
		element.activity_date = moment(element.activity_date.toString()).format("MM/DD/YYYY");
		if (element.division_code_id.toString() === "-1") {
			element.collateral_advance_rate_id = -1;
		}
	});
	let RollForwardrequestBody = { "inventory_rollforward_log": model }
	// removing unwanted key from body params
	for (let k of RollForwardrequestBody.inventory_rollforward_log.records) {
		delete k.collateralList;
	}
	const url = this.apiMapper.endpoints[CyncConstants.UPDATE_INVENTORY_ROLLFORWARD_LOG_DATA].replace('{clientId}', this.clientId);
	this.bbcReviewService.updateRollForwardLogData(url, RollForwardrequestBody).subscribe(response => {
		
		// this.updateRecievableRollforwardData();
		const message = 'Updated Successfully'
		this.helper.showApiMessages(message, 'success');
		this.bbcReviewService.setActionInventory('edit');
		this.editDialogRef.close();
	});

}
  cancelButtonClick() {
	this.editDialogRef.close();
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
changecollateral() {
	this.isValid = true;
}
   /*
   * Method to validate a number
   * 
   */
  toValidateNumber(event: any) {
    // const refNewSales = document.querySelector(id) as HTMLInputElement;
    if (event.target.value === "") {
      // refNewSales.style.border = '1px solid red';
      this.isValid = false;
    } else {
      // refNewSales.style.border = '1px solid #c7c7c7';
      this.isValid = true;
    }
  }
}
