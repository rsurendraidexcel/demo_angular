import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { APBucketService } from '../service/ap-bucket-ageing.service'
import { APBucket, UpdateAPRequestBody } from '../model/ap-bucket-ageing.model'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';

@Component({
  selector: 'app-ap-bucket',
  templateUrl: './manage.ap-bucket-ageing.component.html'
})
export class APBucketAgeingAddComponent {

  apBucketId: any;
  currentAction: string = 'Add';
  addEditAPBucketAgeing: FormGroup;
  isSaveNContinue: boolean = false;
  borrowerId: string;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;



  constructor(
    private _message: MessageServices,
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _helper: Helper,
    private _apiMapper: APIMapper,
    private _apservice: APBucketService) {
    this.borrowerId = CyncConstants.getSelectedClient();

  }

  ngOnInit() {
    this._helper.adjustUI();
    this.initFormValidator();
    this._renderForm();
  }

  /**
  * Initializing the form controls
  *
  */
  initFormValidator() {
    this.addEditAPBucketAgeing = this.fb.group({
      bucket_number: new FormControl({ value: '', disabled: true }, Validators.required),
      bucket_days: new FormControl('', Validators.compose([Validators.required])),
      bucket_name: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
  * getting the router parameter
  *
  */
  _renderForm() {
    this.route.params.subscribe(params => {
      this.apBucketId = params['id'];
      if (this.apBucketId !== undefined && this.apBucketId !== 'add') {
        this.currentAction = CyncConstants.EDIT_OPERATION;
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showAPDetailsInForm();
      } else {
        this.currentAction = CyncConstants.ADD_OPERATION;
        this.currentActionBtnText = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT;
      }
    });
  }

  /**
  * showing record details in form
  *
  */
  showAPDetailsInForm() {
    this._message.showLoader(true);
    this._apservice.getAPDetails(this._apiMapper.endpoints[CyncConstants.GET_AP_BUCKET_AGEING].replace("{clientId}", this.borrowerId) + "/" + this.apBucketId).subscribe(apMapperData => {
      this.addEditAPBucketAgeing.patchValue(apMapperData, { onlySelf: true })
      this._message.showLoader(false);
    });
  }

  /**
  * call when user click on save button
  * @param - model, isVslid
  */
  saveData(model: APBucket, isValid: boolean) {
    if (this.isCurrentActionAdd()) {
      this.saveAPDetails(model, isValid);
    } else {
      this.updateAPDetails(model);
    }
  }

  /**
  * saving the new record
  * @param - model, isVslid
  */
  saveAPDetails(model: APBucket, isValid: boolean) {
    if (isValid) {
      this._message.showLoader(true);
      let requestBody = new UpdateAPRequestBody();
      requestBody.payable_bucket_aging = model;
      this._apservice.saveNewAP(this._apiMapper.endpoints[CyncConstants.GET_AP_BUCKET_AGEING].replace("{clientId}", this.borrowerId), requestBody).subscribe(res => {
        this.getBackToAPList();
      })
    }
  }

  /**
  * for updating the existing record
  * @param - model
  */
  updateAPDetails(model: APBucket) {
    this._message.showLoader(true);
    let requestBody = new UpdateAPRequestBody();
    requestBody.payable_bucket_aging = model;
    this._apservice.updateAPDetails(this._apiMapper.endpoints[CyncConstants.GET_AP_BUCKET_AGEING].replace("{clientId}", this.borrowerId)
      + "/" + this.apBucketId, requestBody).subscribe(res => {
        this.getBackToAPList();
      });
  }

  /**
  * save and continue button
  * @param - model, isVslid
  */
  saveNContinue(model: APBucket, isValid: boolean) {
    if (isValid) {
      this.isSaveNContinue = true;
      this._message.showLoader(true);
      this.saveAPDetails(model, isValid);
    }
  }

  /**
  * get back to summary page
  * 
  */
  getBackToAPList() {
    if (this.isCurrentActionAdd()) {
      this._message.addSingle(CyncConstants.SAVE_MESSAGE, "success");
    } else {
      this._message.addSingle(CyncConstants.UPDATE_MESSAGE, "success");
    }
    if (!this.isSaveNContinue) { // if user has not clicked on save and continue
      this._router.navigateByUrl("/bbc-preference-setup/bucket-ageing/ap-bucket-ageing");
    } else {
      this.isSaveNContinue = false;
    }
    this.addEditAPBucketAgeing.reset();
    this._message.showLoader(false);
  }

  /**
  * call when user will press cancel button
  *
  */
  navigateToSummaryPage() {
    this._router.navigateByUrl("/bbc-preference-setup/bucket-ageing/ap-bucket-ageing");
    this.addEditAPBucketAgeing.reset();
    this._message.showLoader(false);
  }

  /**
  * getting css for validation
  * 
  */
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditAPBucketAgeing)
  }

  /**
  * for validation
  * 
  */
  getFormControl(field: string) {
    return this.addEditAPBucketAgeing.get(field);
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
      return !this.addEditAPBucketAgeing.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditAPBucketAgeing.valid || this.addEditAPBucketAgeing.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

}