import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { InventoryRollforwardLogDetailsModel } from '../../../receivables-rollforward/inventory-rollforward-model/inventory-rollforward';
import * as moment from 'moment';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { BbcReviewService } from '../../../services/bbc-review.service';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-manual-rollforward-entry',
  templateUrl: './manual-rollforward-entry.component.html',
  styleUrls: ['./manual-rollforward-entry.component.scss']
})
export class ManualRollforwardEntryComponent implements OnInit {
  rollForwardLogsForm: FormGroup;
  isValid: boolean = true;
  divisonData:any;
  collateralData:any;
  productGroupData:any;
  clientId = CyncConstants.getSelectedClient();
  bbcDate: any;

  constructor(private fb: FormBuilder,
    private apiMapper: APIMapper,
    private bbcReviewService: BbcReviewService,
    private helper:Helper,
    public addDialogRef: MatDialogRef<ManualRollforwardEntryComponent>) { }

  ngOnInit() {
    this.bbcReviewService.getRollForwardInventory().subscribe(res => {
      this.bbcDate = res;
    });
    this.createRollForwardLogsForm();
    this.getDivisonData();
  }
  createRollForwardLogsForm() {
    this.rollForwardLogsForm = this.fb.group({
      activity_date: [moment(this.bbcDate).format("MM/DD/YYYY"), Validators.required],
      division_code_id: [''],
      collateral_advance_rate_id: [''],
      new_sale: [0],
      new_adjustment: [0],
      bbc_adjustment: [0],
      purchases:[0],
      credits:[0],
      removals:[0],
      product_group_id:['',Validators.required],
      borrower_id: ['']
    });

  }
  cancelButtonClick() {
    this.addDialogRef.close();
  }
  saveRollForwardData(model: any){
    let requestBody = new InventoryRollforwardLogDetailsModel();
    requestBody.inventory_rollforward_log = model;
    requestBody.inventory_rollforward_log.activity_date = moment(model.activity_date).format("MM/DD/YYYY");
    // requestBody.inventory_rollforward_log.product_group_id = 1;
    if (requestBody.inventory_rollforward_log.division_code_id.toString() === "-1") {
      requestBody.inventory_rollforward_log.collateral_advance_rate_id = -1;
    }
    requestBody.inventory_rollforward_log.borrower_id = this.clientId;
    const url = this.apiMapper.endpoints[CyncConstants.CREATE_INVENTORY_ROLLfORWARD_LOG].replace('{clientId}', this.clientId);
    if (requestBody !== undefined) {
      this.bbcReviewService.creatteInventoryRollForwardLogService(url, requestBody).subscribe(response => {
        let res = response;
        if (res.status === 201) {
          const message = 'Saved Successfully';
          this.helper.showApiMessages(message, 'success');
          this.bbcReviewService.setActionInventory('save');
          // this.updateRecievableRollforwardData();
          this.addDialogRef.close();
        } else {
          const message = res.error;
          this.helper.showApiMessages(message, 'error');
          this.addDialogRef.close();
        }
      });
    }
  }
  getDivisonData() {
    let that = this;
		const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_DIVISION_LIST].replace('{clientId}', this.clientId);

		this.bbcReviewService.getDivisionData(url).subscribe(response => {
			// this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.divisonData = list.divisions;
      if(this.divisonData.length == 1){
        let division_id = this.divisonData[0].id 
        let col_url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA_BASED_ON_DIVISION_ID].replace('{clientId}', this.clientId).replace("{division_id}", division_id);
        this.bbcReviewService.getCollateralData(col_url).subscribe(response => {
          const colResp = <any>JSON.parse(response._body);
          let colList = colResp.collaterals;
          if(colList.length == 1){
            let col_id = colList[0].id;
            var pgUrl = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_PRODUCT_GROUP_NAME].replace('{clientId}', this.clientId);
            pgUrl += "?collateral_advance_rate_id="+col_id;
            this.bbcReviewService.getProductGroupData(pgUrl).subscribe(response => {
            const pgResp = <any>JSON.parse(response._body);
            if(pgResp.product_groups.length == 1){
              that.getCollateralData(division_id);
              that.getProductGroupData(col_id);
              let pg_id = pgResp.product_groups[0].id;
              that.rollForwardLogsForm.get('division_code_id').setValue(division_id);
              that.rollForwardLogsForm.get('collateral_advance_rate_id').setValue(col_id);
              that.rollForwardLogsForm.get('product_group_id').setValue(pg_id);
            }
            })
          }  
        })
      }
		}, error => {
			// this.isDataLoaded = false;
		}
		)
  }

  changecollateral(event) {
     this.rollForwardLogsForm.get('product_group_id').setValue('') 
     if(parseInt(event.target.value) > 0 ){
      this.getProductGroupData(event.target.value);
     }else{
      this.productGroupData = [];
     }
  }

  changeDivision(divisionId: any) {
    this.productGroupData = [];
    this.rollForwardLogsForm.get('product_group_id').setValue('')
    this.rollForwardLogsForm.get('collateral_advance_rate_id').setValue('') 
    if(parseInt(divisionId) > 0){
      this.getCollateralData(divisionId);
    }else{
      this.collateralData = [];
    }
  }


  getCollateralData(divisionId: any) {
		const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA_BASED_ON_DIVISION_ID].replace('{clientId}', this.clientId).replace("{division_id}", divisionId).replace('{clientId}', this.clientId);

		this.bbcReviewService.getCollateralData(url).subscribe(response => {
			// this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.collateralData = list.collaterals;

		}, error => {
			// this.isDataLoaded = false;

		}
		)
  }
  getProductGroupData(col_id=null) {
		var url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_PRODUCT_GROUP_NAME].replace('{clientId}', this.clientId);
    if(col_id){
      url += "?collateral_advance_rate_id="+col_id ;
    }
		this.bbcReviewService.getProductGroupData(url).subscribe(response => {
			// this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.productGroupData = list.product_groups;

		}, error => {
			// this.isDataLoaded = false;

		}
		)
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

}
