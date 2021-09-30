import { Component, OnInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { AllCreditQueue, ListCreditQueue, DebtorDropdown, ClientDropdown } from "../model/credit-queue.model";
import { CreditQueueService } from "../service/credit-queue.service";
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-add-edit-queue',
  templateUrl: './add-edit-queue.component.html',
  styleUrls: ['./add-edit-queue.component.scss']
})
export class AddEditQueueComponent implements OnInit {
  comments: any = [];
  assetPath: string = CyncConstants.getAssetsPath();
  getStatusDropdown: any = [];
  getClientDropdown: any = [];
  getDebtorDropdown: any = [];
  getCommentHistory: any = [];
  isNew: boolean;
  creditQueueForm: FormGroup;
  editDisableFields: boolean;
  @Output() close = new EventEmitter();
  disableAllField: boolean;
  withdrawDisable: boolean;

  constructor(private _apiMapper: APIMapper,
    private _helper: Helper,
    private _commonAPIs: CommonAPIs,
    private _message: MessageServices,
    private _creditQueueService: CreditQueueService,
    private _router: Router, private elementRef: ElementRef,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this.getDropDownValues();
    this.buildForm();
    this.toCheckFormIsAddOrEdit();
  }

  /**
   *  Creating Form Group
   */
  buildForm() {
    this.creditQueueForm = this._fb.group({
      id: new FormControl(),
      customer_id: new FormControl(null, Validators.compose([Validators.required])),
      borrower_id: new FormControl(null, Validators.compose([Validators.required])),
      current_limit: new FormControl(null, Validators.compose([Validators.required])),
      requested_limit: new FormControl(null, Validators.compose([Validators.required, Validators.pattern("^[0-9]{1,20}([.,][0-9]{1,2})?$")])),
      status_lookup_id: new FormControl(),
      user_id: new FormControl(),
      comment: new FormControl(),
      approved_limit: new FormControl(null, Validators.compose([Validators.pattern("^[0-9]{1,20}([.,][0-9]{1,2})?$")])),
      request_no: new FormControl(null)
    });
  }

  /**
   *  Function to check add queue or edit queue
   */
  toCheckFormIsAddOrEdit() {
    if (CyncConstants.getRowDataCreditQueue() != '' && CyncConstants.getRowDataCreditQueue() != undefined) {
      this.isNew = false;
      this.patchCreditQueue(CyncConstants.getRowDataCreditQueue());
    } else {
      this.isNew = true;
    }
  }

  /**
   * Get Drop down values using APIs
   */
  getDropDownValues() {
    this.getStatusAndClientValues();
  }

  /**
   * Get Status Values and client Values
   */
  getStatusAndClientValues() {
    this._message.showLoader(true);
    const url1 = this._apiMapper.endpoints[CyncConstants.STATUS_DROPDOWN_VALUES];
    this._creditQueueService.getCreditQueueValues(url1).subscribe(res => {
      this.getStatusDropdown = res;
      this._message.showLoader(false);
    });

    this._message.showLoader(true);
    const url2 = this._apiMapper.endpoints[CyncConstants.CLIENT_DROPDOWN_VALUES];
    this._creditQueueService.getCreditQueueValues(url2).subscribe(res => {
      this.getClientDropdown = res;
      this._message.showLoader(false);
    });
  }


  /**
   * Based on client selection load Debtor dropdown values
   */
  fnChangeClient() {
    this._message.showLoader(true);
    const url = this._apiMapper.endpoints[CyncConstants.DEBTOR_DROPDOWN_VALUES].replace('{id}', this.creditQueueForm.get('borrower_id').value);
    this._creditQueueService.getCreditQueueValues(url).subscribe(res => {
      this.getDebtorDropdown = res;
      this._message.showLoader(false);
    });
  }

  /**
  * Based on status selection remove approve limit validation
  */
  fnChangeStatus() {
    if (this.creditQueueForm.get('status_lookup_id').value == 4) {
      this.creditQueueForm.get('approved_limit').setValidators([Validators.compose([Validators.pattern("^[0-9]{1,20}([.,][0-9]{1,2})?$")])]);
      this.creditQueueForm.controls['approved_limit'].updateValueAndValidity();
    }
  }

  /**
   * if aleardy queue is created for same debtor w.r.t that client then requesting to withdraw the queue
   */
  checkForWithdrawal() {
    let model = {
      "customer_id": this.creditQueueForm.get('customer_id').value,
      "borrower_id": this.creditQueueForm.get('borrower_id').value
    }
    const url = this._apiMapper.endpoints[CyncConstants.WITHDRAWAL_QUEUE];
    this._creditQueueService.withdrawCreditQueue(url, model).subscribe(res => {
      if (res.status == true) {
        this.withdrawDisable = true;
        this.creditQueueForm.get('requested_limit').setValidators([]);
        this.creditQueueForm.controls['requested_limit'].updateValueAndValidity();
        let message: string = 'Please withdraw the existing credit request for this debtor before submitting a new request';
        this._helper.showApiMessages(message, 'danger');
      } else {
        this.withdrawDisable = false;
      }
    });
  }


  /**
   * based on debtor change set current credit limit
   */
  fnChangeDebtor() {
    let limitID = this.getDebtorDropdown.filter(borrower => borrower.id === this.creditQueueForm.get('customer_id').value);
    this.creditQueueForm.get('current_limit').setValue(parseFloat(limitID[0].credit_limit).toFixed(2));
    //this.creditQueueForm.get('current_limit').setValue( parseFloat(parseFloat(limitID[0].credit_limit) * 100) / 100);
    this.checkForWithdrawal();
  }



  /**
   * patch all the form fields during edit mode
   * @param data 
   */
  patchCreditQueue(data) {
    this.creditQueueForm.get('customer_id').disable();
    this.creditQueueForm.get('borrower_id').disable();
    this.creditQueueForm.get('request_no').disable();
    this.creditQueueForm.get('requested_limit').setValidators([]);
   this.creditQueueForm.controls['requested_limit'].updateValueAndValidity();

    if (data.status == "Open" || data.status == "In Use") {
      this.disableAllField = false;
      this._message.showLoader(true);
      if (data.status == "open") {
        this.creditQueueForm.get('status_lookup_id').patchValue(2);
      }
      const url = this._apiMapper.endpoints[CyncConstants.DEBTOR_DROPDOWN_VALUES].replace('{id}', data.borrower_id);
      this._creditQueueService.getCreditQueueValues(url).subscribe(res => {
        this.getDebtorDropdown = res;
      });
      this.editDisableFields = true;
      this.creditQueueForm.get('approved_limit').setValidators([Validators.required, Validators.compose([Validators.pattern("^[0-9]{1,20}([.,][0-9]{1,2})?$")])]);
      this.creditQueueForm.controls['approved_limit'].updateValueAndValidity();
      this.creditQueueForm.get('request_no').patchValue(data.request_no);
      this.creditQueueForm.get('requested_limit').enable();
      this.creditQueueForm.get('approved_limit').patchValue(data.approved_limit);
      const url1 = this._apiMapper.endpoints[CyncConstants.CREDIT_QUEUE_LIST] + '/' + data.request_no;
      this._creditQueueService.getCreditQueueValues(url1).subscribe(res => {
        this.creditQueueForm.patchValue(res);
        this.creditQueueForm.get('requested_limit').patchValue(parseFloat(res.requested_limit).toFixed(2));
        this.creditQueueForm.get('current_limit').patchValue(parseFloat(res.current_limit).toFixed(2));
        if (res.approved_limit) {
          this.creditQueueForm.get('approved_limit').patchValue(parseFloat(res.approved_limit).toFixed(2));
        }
        this.getStatusDropdown = this.getStatusDropdown.filter(order => order.name !== "Open");
        //   this.getStatusDropdown = this.getStatusDropdown.filter(order => order.name !== "In Use"); 
        this.creditQueueForm.get('status_lookup_id').setValue(2);
        this.creditQueueForm.get('comment').reset();
      });
      this._message.showLoader(false);
    } else {

      this._message.showLoader(true);
      const url = this._apiMapper.endpoints[CyncConstants.DEBTOR_DROPDOWN_VALUES].replace('{id}', data.borrower_id);
      this._creditQueueService.getCreditQueueValues(url).subscribe(res => {
        this.getDebtorDropdown = res;
        this._message.showLoader(false);
      });
      this.creditQueueForm.patchValue(data);
      if (data.status == "Approved") {
        this.creditQueueForm.get('status_lookup_id').setValue(3);
      }
      if (data.status == "Partial Approval") {
        this.creditQueueForm.get('status_lookup_id').setValue(6);
      }
      if (data.status == "One Time Approval") {
        this.creditQueueForm.get('status_lookup_id').setValue(5);
      }
      if (data.status == "Declined") {
        this.creditQueueForm.get('status_lookup_id').setValue(4);
      }
      if (data.status == "Withdraw") {
        this.creditQueueForm.get('status_lookup_id').setValue(7);
      }
      this.disableAllField = true;
      this.creditQueueForm.get('requested_limit').disable();
      this.creditQueueForm.disable();
    }
    const url2 = this._apiMapper.endpoints[CyncConstants.COMMENT_HISTORY].replace('{id}', data.request_no);
    this._creditQueueService.getCreditQueueValues(url2).subscribe(res => {
      this.getCommentHistory = res;
    });
  //  this.creditQueueForm.get('requested_limit').disable();
  }

  /**
   *  validation when focused out from approved limit to set status field
   */
  focusOutFunction() {
    let approved_limit = this.creditQueueForm.get('approved_limit').value;
    let current_limit = this.creditQueueForm.get('current_limit').value;
    let requested_limit = this.creditQueueForm.get('requested_limit').value;

    if ((parseFloat(approved_limit) > parseFloat(current_limit)) && (parseFloat(approved_limit) <= parseFloat(requested_limit))) {
      if (parseFloat(approved_limit) == parseFloat(requested_limit)) {
        this.creditQueueForm.get('status_lookup_id').setValue(3);
      } else {
        this.creditQueueForm.get('status_lookup_id').setValue(6);
      }
      this.withdrawDisable= false;
    } else {
      if (parseFloat(approved_limit) <= parseFloat(current_limit)) {
        let message: string = 'Approved limit should be greater then current credit limit';
        this._helper.showApiMessages(message, 'danger');
        this.withdrawDisable= true;
      }
      if (parseFloat(approved_limit) > parseFloat(requested_limit)) {
        let message: string = 'Approval Limit value is more than Requested Credit Limit';
        this._helper.showApiMessages(message, 'danger');
        this.withdrawDisable= true;
      }
      return !this.creditQueueForm.valid;
    }
  }

  onKeyApprovedValidation(event:any) { // without type info
    let approved_limit = this.creditQueueForm.get('approved_limit').value;
    let current_limit = this.creditQueueForm.get('current_limit').value;
    let requested_limit = this.creditQueueForm.get('requested_limit').value;
    if((parseFloat(event.target.value) > parseFloat(current_limit)) && (parseFloat(event.target.value) <= parseFloat(requested_limit))){
    this.withdrawDisable= true;
    }else{
      this.withdrawDisable= false;
    }
  }

  /**
   * submit new queue
   */
  saveCQCode(model, isValid) {
    if (this.isNew && isValid) {
      let message: string = 'New Queue saved successfully,';
      this._message.showLoader(true);
      const url = this._apiMapper.endpoints[CyncConstants.CREDIT_QUEUE_LIST];
      this._creditQueueService.createCreditQueue(url, model).subscribe(res => {
        this._helper.showApiMessages(message, 'success');
        this._message.showLoader(false);
        CyncConstants.setRowDataCreditQueue('');
        this.close.emit(null);
      });
    } else {
      if ((this.creditQueueForm.get('status_lookup_id').value == 3) || (this.creditQueueForm.get('status_lookup_id').value == 5) || (this.creditQueueForm.get('status_lookup_id').value == 6)) {
        if ((parseFloat(model.approved_limit) > parseFloat(model.current_limit)) && (parseFloat(model.approved_limit) <= parseFloat(model.requested_limit))) {
        let message: string = 'Updated Queue successfully,';
          this._message.showLoader(true);
          model.approved_limit = parseFloat(model.approved_limit);
          const url = this._apiMapper.endpoints[CyncConstants.ADD_EDIT_CREDIT_QUEUE].replace('{id}', model.request_no);
          this.creditQueueForm.get('id').setValue(model.request_no);
          this._creditQueueService.updateCreditQueue(url, model).subscribe(res => {
            this._helper.showApiMessages(message, 'success');
            this._message.showLoader(false);
            CyncConstants.setRowDataCreditQueue('');
            this.close.emit(null);
          });
        } else {
          if (parseFloat(model.approved_limit) <= parseFloat(model.current_limit)) {
            let message: string = 'Approved limit should be greater then current credit limit';
            this._helper.showApiMessages(message, 'danger');
          }
          if (parseFloat(model.approved_limit) >= parseFloat(model.requested_limit)) {
            let message: string = 'Approval Limit value is more than Requested Credit Limit';
            this._helper.showApiMessages(message, 'danger');
          }
          return !this.creditQueueForm.valid;
        }
      } else {
        let message: string = 'Updated Queue successfully,';
        this._message.showLoader(true);
        model.approved_limit = parseFloat(model.approved_limit);
        const url = this._apiMapper.endpoints[CyncConstants.ADD_EDIT_CREDIT_QUEUE].replace('{id}', model.request_no);
        this.creditQueueForm.get('id').setValue(model.request_no);
        this._creditQueueService.updateCreditQueue(url, model).subscribe(res => {
          this._helper.showApiMessages(message, 'success');
          this._message.showLoader(false);
          CyncConstants.setRowDataCreditQueue('');
          this.close.emit(null);
        });
      }
    }
  }

  /**
   * confirmation for cancelling the form
   */
  onClose() {
    if (this.creditQueueForm.dirty) {
      const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to cancel?', 'msgType': 'warning' };
      this._helper.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          CyncConstants.setRowDataCreditQueue('');
          this.close.emit(null);
        } else {
          return false
        }
      });
    } else {
      CyncConstants.setRowDataCreditQueue('');
      this.close.emit(null);
    }
  }

  /**
   * Get form control value to validate
   * @param field
   */
  getFormControl(field: string) {
    return this.creditQueueForm.get(field);
  }

	/**
	* Method to hightlight mandatory fileds if form validations fail
	* @param field 
	*/
  displayCssField(field: string) {
    return this._helper.getFieldCss(field, this.creditQueueForm);
  }

}