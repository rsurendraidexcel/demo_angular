import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { ARBucketService } from '../service/ar-bucket-ageing.service'
import { ARBucket, UpdateARRequestBody } from '../model/ar-bucket-ageing.model'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';

@Component({
  selector: 'app-ar-bucket',
  templateUrl: './manage.ar-bucket-ageing.component.html'
})
export class ARBucketAgeingAddComponent {

  arBucketId: any;
  currentAction: string = 'Add';
  addEditARBucketAgeing: FormGroup;
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
    private _arservice: ARBucketService) {
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
    this.addEditARBucketAgeing = this.fb.group({
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
    /* getting router parameters */
    this.route.params.subscribe(params => {
      this.arBucketId = params['id'];
      if (this.arBucketId !== undefined && this.arBucketId !== 'add') {
        this.currentAction = CyncConstants.EDIT_OPERATION;
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showARDetailsInForm();
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
  showARDetailsInForm() {
    this._message.showLoader(true);
    this._arservice.getARDetails(this._apiMapper.endpoints[CyncConstants.GET_AR_BUCKET_AGEING].replace("{clientId}", this.borrowerId) + "/" + this.arBucketId).subscribe(user => {
      this.addEditARBucketAgeing.patchValue(user, { onlySelf: true })
      this._message.showLoader(false);
    });

  }

  /**
  * call when user click on save button
  * @param - model, isVslid
  */
  saveData(model: ARBucket, isValid: boolean) {
    if (this.isCurrentActionAdd()) {
      this.saveUserDetails(model, isValid);
    } else {
      this.updateUserDetails(model);
    }
  }

  /**
  * saving the new record
  * @param - model, isVslid
  */
  saveUserDetails(model: ARBucket, isValid: boolean) {
    if (isValid) {
      this._message.showLoader(true);
      let requestBody = new UpdateARRequestBody();
      requestBody.bucket_ageing = model;
      this._arservice.saveNewUser(this._apiMapper.endpoints[CyncConstants.GET_AR_BUCKET_AGEING].replace("{clientId}", this.borrowerId), requestBody).subscribe(res => {
        this.getBackToARList();
      })
    }
  }

  /**
  * for updating the existing record
  * @param - model
  */
  updateUserDetails(model: ARBucket) {
    this._message.showLoader(true);
    let requestBody = new UpdateARRequestBody();
    requestBody.bucket_ageing = model;
    this._arservice.updateUserDetails(this._apiMapper.endpoints[CyncConstants.GET_AR_BUCKET_AGEING].replace("{clientId}", this.borrowerId)
      + "/" + this.arBucketId, requestBody).subscribe(res => {
        this.getBackToARList();
      });
  }

  /**
  * save and continue button
  * @param - model, isVslid
  */
  saveNContinue(model: ARBucket, isValid: boolean) {
    if (isValid) {
      this.isSaveNContinue = true;
      this._message.showLoader(true);
      this.saveUserDetails(model, isValid);
    }
  }

  /**
  * get back to summary page
  * 
  */
  getBackToARList() {
    if (this.isCurrentActionAdd()) {
      this._message.addSingle(CyncConstants.SAVE_MESSAGE, "success");
    } else {
      this._message.addSingle(CyncConstants.UPDATE_MESSAGE, "success");
    }
    if (!this.isSaveNContinue) { // if user has not clicked on save and continue
      this._router.navigateByUrl("/bbc-preference-setup/bucket-ageing/ar-bucket-ageing");
    } else {
      this.isSaveNContinue = false;
    }
    this.addEditARBucketAgeing.reset();
    this._message.showLoader(false);
  }

  /**
  * call when user will press cancel button
  *
  */
  navigateToSummaryPage() {
    this._router.navigateByUrl("/bbc-preference-setup/bucket-ageing/ar-bucket-ageing");
    this.addEditARBucketAgeing.reset();
    this._message.showLoader(false);
  }

  /**
  * getting css for validation
  * 
  */
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditARBucketAgeing)
  }

  /**
  * for validation
  * 
  */
  getFormControl(field: string) {
    return this.addEditARBucketAgeing.get(field);
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
      return !this.addEditARBucketAgeing.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditARBucketAgeing.valid || this.addEditARBucketAgeing.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

}