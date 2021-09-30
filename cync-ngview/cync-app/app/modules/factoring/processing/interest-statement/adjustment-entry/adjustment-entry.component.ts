import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import * as moment from 'moment-timezone';
import { ProcessingService } from '../../services/processing-service';

@Component({
  selector: 'app-adjustment-entry',
  templateUrl: './adjustment-entry.component.html',
  styleUrls: ['./adjustment-entry.component.scss']
})
export class AdjustmentEntryComponent implements OnInit {

  transactionTypes: any;
  transaction_type: any;
  adjustmentEentryForm: FormGroup;
  mindate: Date;
  maxdate: Date;
  public static isReload: boolean = false;

  constructor(public dialogRef: MatDialogRef<AdjustmentEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helper: Helper,
    private message: MessageServices,
    private processingservice: ProcessingService) {
    this.initializeAdjustmentForm();
  }

  ngOnInit() {
    this.message.showLoader(true);
    this.getTransactionTypes();
    this.emptyAdjusmentForm();
    this.setLenderTimeZoneCalender();
  }

  initializeAdjustmentForm() {
    this.adjustmentEentryForm = new FormGroup({
      transaction_type: new FormControl('', Validators.required),
      transaction_date: new FormControl('', Validators.required),
      transaction_amount: new FormControl('', Validators.required),
      transaction_notes: new FormControl('', Validators.required)
    });
  }

  setLenderTimeZoneCalender(){
    let timeZone = CyncConstants.getLenderTimezone();
    console.log("==Lender TimeZone==",timeZone);
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    // let mindate = moment(new Date(currentYear, currentMonth - 1, 16)).tz(CyncConstants.getLenderTimezone()).format("MM/DD/YYYY")
    let mindate = moment(new Date(),CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone()).startOf('month').subtract(16,'d').format("MM/DD/YYYY");
    let maxdate = moment(new Date(),CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone()).endOf('month').format("MM/DD/YYYY");
    this.maxdate = new Date(maxdate);
    this.mindate=  new Date(mindate);
  }
  
  onMonthSelectTransactionDate(event){
    let currentMonth = new Date().getMonth();
    if(currentMonth-1 === event.month-1){
      let xyz = moment().set({'year': event.year, 'month': event.month-1, 'date': 16 }).format("MM/DD/YYYY");
      let maxdate = moment(xyz).endOf('month').format('MM/DD/YYYY');
      this.mindate = new Date(xyz);
      this.maxdate = new Date(maxdate);
    }else{
      this.setLenderTimeZoneCalender();
    }
 }

  emptyAdjusmentForm() {
    this.adjustmentEentryForm.reset();
    this.adjustmentEentryForm.get('transaction_type').setValue("");
    this.adjustmentEentryForm.get('transaction_date').setValue("");
    this.adjustmentEentryForm.get('transaction_amount').setValue("");
    this.adjustmentEentryForm.get('transaction_notes').setValue("");
  }


  getTransactionTypes() {
    const url = 'factoring/interest/statement-adjustment/transaction-type';
    this.processingservice.getTransactionTypeService(url).subscribe(res => {
      this.transactionTypes = res;
      this.message.showLoader(false);
    });
  }

  createAdjustmentEntry() {
    this.message.showLoader(true);
    let transaction_date = moment(this.adjustmentEentryForm.get("transaction_date").value).format('MM/DD/YYYY');
    let url = 'factoring/interest/statement-adjustment/create';
    let model = {
      "transaction_type_id": this.adjustmentEentryForm.get("transaction_type").value,
      "client_id": this.data.clietID,
      "client_name": this.data.user_info.clientDetails.client_name,
      "user_id": this.data.user_info.userDetails.id,
      "user_name": this.data.user_info.userDetails.user_name,
      "transaction_date": transaction_date,
      "adjustment_amount": this.adjustmentEentryForm.get("transaction_amount").value,
      "notes": this.adjustmentEentryForm.get("transaction_notes").value
    };
    this.processingservice.createAdjustmentService(url, model).subscribe(res => {
      this.helper.showApiMessages("Adjustment created successfully and initiated interest recalculation",'success');
      this.emptyAdjusmentForm();
      AdjustmentEntryComponent.isReload=true;
      this.dialogRef.close();
    }, Error => {
      this.helper.showApiMessages(`${Error.error.message}`, "danger");
      this.message.showLoader(false);
    });
    

  }

  //Submit Adjusment Entry
  submitAdjustmentEntry() {
    if (this.adjustmentEentryForm.valid) {
      this.createAdjustmentEntry();
    } else {
      this.helper.showApiMessages("Please, Fill the Required field", "danger");
    }
    this.processingservice.setRefresh('process')
  }
  //Closed Model Dialog box
  cancelClick() {
    AdjustmentEntryComponent.isReload=false;
    this.dialogRef.close();
  }

  //Clean the From 
  doCancel() {
    this.emptyAdjusmentForm();
  }

}
