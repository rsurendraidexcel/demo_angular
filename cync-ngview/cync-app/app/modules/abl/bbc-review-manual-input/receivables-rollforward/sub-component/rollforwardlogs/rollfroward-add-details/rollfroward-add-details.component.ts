import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RollforwardLogDetailsModel } from '@app/modules/abl/bbc-review-manual-input/rollforward-logs-model/rollforward-log';
import { BbcReviewService } from '@app/modules/abl/bbc-review-manual-input/services/bbc-review.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment-timezone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rollfroward-add-details',
  templateUrl: './rollfroward-add-details.component.html',
  styleUrls: ['./rollfroward-add-details.component.scss']
})
export class RollfrowardAddDetailsComponent implements OnInit {
  rollForwardLogsForm: FormGroup;
  divisionData: any;
  collateralData: any;
  rollForwordLogsRowData: any;
  selectedDivisionId: any;
  selectedCollateralId: any;
  isNextButtonEnable: boolean;
  rollforward_to_adjust_collateral: any;
  clientId = CyncConstants.getSelectedClient();
  bbcDate: any;
  isValid: boolean = true;
  
  constructor(
    private fb: FormBuilder,
    private bbcReviewService: BbcReviewService,
    private apiMapper: APIMapper,
    private helper: Helper,
    private route: Router,
    public addDialogRef: MatDialogRef<RollfrowardAddDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isNextButtonEnable = true;
  }

  ngOnInit() {
    this.rollforward_to_adjust_collateral = this.data.rollforward_to_adjust_collateral;

    this.bbcReviewService.getRollForward().subscribe(res => {
      this.bbcDate = res.bbc_date;
    });
    this.createRollForwardLogsForm();
    this.getDivisionData();
  }

  ngOnDestroy() {
    this.route.navigate(['./bbc-review-manual-input/receivables-roll-forward']);
  }

  createRollForwardLogsForm() {
    let selection = this.rollforward_to_adjust_collateral ? 'Select': '-1';
    this.rollForwardLogsForm = this.fb.group({
      'activity_date': [moment(this.bbcDate).format("MM/DD/YYYY"), Validators.required],
      'division_code_id': [`${selection}`],
      'collateral_advance_rate_id': [`${selection}`],
      'new_sale': [0],
      'new_credit': [0],
      'cash_collected': [0],
      'new_adjustment': [0],
      'bbc_adjustment': [0],
      'borrower_id': ['']
    });

  }

	/**
	* Save or update individual information data
	* @param model
	*/
  saveRollForwardData(model: any) {

    let requestBody = new RollforwardLogDetailsModel();
    requestBody.rollforward_log = model;
    requestBody.rollforward_log.activity_date = moment(model.activity_date).format("MM/DD/YYYY");
    if (requestBody.rollforward_log.division_code_id.toString() === "-1") {
      requestBody.rollforward_log.collateral_advance_rate_id = -1;
    }
    requestBody.rollforward_log.borrower_id = this.clientId;
    const url = this.apiMapper.endpoints[CyncConstants.CREATE_ROLLFORWARD_LOGS].replace('{clientId}', this.clientId);
    if (requestBody !== undefined) {
      this.bbcReviewService.createRollForwardLogData(url, requestBody).subscribe(response => {
        let res = response;
        if (res.status === 201) {
          const message = 'Saved Successfully';
          this.helper.showApiMessages(message, 'success');
          this.bbcReviewService.setAction('save');
          this.updateRecievableRollforwardData();
          this.addDialogRef.close();
        } else {
          const message = res.error;
          this.helper.showApiMessages(message, 'error');
          this.addDialogRef.close();
        }
      });
    }
  }
  getDivisionData() {
    const url = this.apiMapper.endpoints[CyncConstants.GET_DIVISION_DATA].replace('{clientId}', this.clientId);
    this.bbcReviewService.getDivisionDataService(url).subscribe(response => {
      this.divisionData = (<any>JSON.parse(response._body)).division;
      this.selectedDiv();
    });
  }

 selectedDiv() {
  // Fixed CYNCS-6596
   if (this.rollforward_to_adjust_collateral==true){
    if(this.divisionData.length==1){
      this.rollForwardLogsForm.get('division_code_id').setValue(this.divisionData[0].id);
      this.getCollateralData(this.rollForwardLogsForm.get('division_code_id').value);
    } else {
      this.rollForwardLogsForm.get('division_code_id').setValue('-1');
      this.rollForwardLogsForm.get('collateral_advance_rate_id').setValue('-1');
    }
   }
 }

  getCollateralData(event: any) {
    if(event){
      this.selectedDivisionId =  event;
    }
    const url = this.apiMapper.endpoints[CyncConstants.GET_COLLATERAL_DATA].replace('{clientId}', this.clientId).replace('{divisionId}', this.selectedDivisionId).replace('{clientId}', this.clientId);
    this.bbcReviewService.getcollateralDataService(url).subscribe(response => {
     this.collateralData = (<any>JSON.parse(response._body)).collateral_advance_rate_id;     
         // Fixed CYNCS-6596
          if(this.rollforward_to_adjust_collateral==true){
                if (this.collateralData.length==1){
                 this.rollForwardLogsForm.get('collateral_advance_rate_id').setValue(this.collateralData[0].id);
                } else{
                this.rollForwardLogsForm.get('collateral_advance_rate_id').setValue('-1');
                }
            } else{
              this.rollForwardLogsForm.get('collateral_advance_rate_id').setValue('-1');
            }
    });
  }
  getCollateralId(event: any) {
    this.selectedCollateralId = event.target.value;
  }
  cancelButtonClick() {
    this.addDialogRef.close();
  }

  rollforwardLogCloseClick() {
    this.addDialogRef.close();
  }

	/**
   * To get Rollforward log data
   * 
   */
  getRollForwardLogDetails(): any {
    const url = this.apiMapper.endpoints[CyncConstants.GET_ROLLFORWARD_LOGS].replace('{clientId}', this.clientId);
    this.bbcReviewService.getRollForwardLogService(url).subscribe(response => {
      this.rollForwordLogsRowData = <any>JSON.parse(response._body);
    });
    return this.rollForwordLogsRowData;
  }
  /*
  * update recievable roll forward data
  */
  updateRecievableRollforwardData() {
    const url = this.apiMapper.endpoints[CyncConstants.DIVISION_LIST_WITH_ID_NULL].replace('{clientId}', this.clientId);
    this.bbcReviewService.getinitializeData(url).subscribe(response => {
      let gridlist = <any>JSON.parse(response._body);
      this.bbcReviewService.setRollForward(gridlist);
    });
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

  isvalidform(): boolean {
    if (this.rollForwardLogsForm.valid && this.isValid) {
      return false;
    }
    else {
      return true;
    }
  }
}
