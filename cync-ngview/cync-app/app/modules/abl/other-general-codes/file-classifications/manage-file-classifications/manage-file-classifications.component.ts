import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { FileClassificationsService } from '../service/file-classifications.service'
import { FileClassification, UpdateRequestBody } from '../model/file-classifications.model'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';


@Component({
  selector: 'app-manage-file-classifications',
  templateUrl: './manage-file-classifications.component.html'
})
export class ManageFileClassificationsComponent {

  recordId: any;
  currentAction: string = 'Add';
  addEditFileClassifications: FormGroup;
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
    private _fcservice: FileClassificationsService) {

  }

  ngOnInit() {
    this._helper.adjustUI();
    this.initFormValidator();
    this._renderForm();
  }

  /**
    * Initiating form validator
    * 
    */
  initFormValidator() {
    this.addEditFileClassifications = this.fb.group({
      name: new FormControl('', Validators.compose([Validators.required])), //Classification
      description: new FormControl('', Validators.compose([Validators.required])),//Descritpion
    });
  }

  _renderForm() {
    this.route.params.subscribe(params => {
      this.recordId = params['id'];
      if (this.recordId !== undefined && this.recordId !== 'add') {
        this.currentAction = CyncConstants.EDIT_OPERATION;
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showDetailsInForm();
      } else {
        this.currentAction = CyncConstants.ADD_OPERATION;
        this.currentActionBtnText = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT;
      }
    });
  }

  /*
   * showing details in form
   */
  showDetailsInForm() {
    this._message.showLoader(true);
    this._fcservice.getDetails(this._apiMapper.endpoints[CyncConstants.UPDATE_FILE_CLASSIFICATION] + "/" + this.recordId).subscribe(user => {
      this.addEditFileClassifications.patchValue(user, { onlySelf: true });
      this._message.showLoader(false);
    });

  }

  /*
  * this method will get called when user will press save button
  */
  saveData(model: FileClassification, isValid: boolean, isSavenCont: boolean) {
    if (this.isCurrentActionAdd()) {
      this.saveDetails(model, isValid, isSavenCont);
    } else {
      this.updateFCDetails(model);
    }
  }

  /*for saving the new record */
  saveDetails(model: FileClassification, isValid: boolean, isSavenCont: boolean) {
    if (isValid) {
      this._message.showLoader(true);
      let requestBody = new UpdateRequestBody();
      requestBody.file_classification = model;
      this._fcservice.saveNew(this._apiMapper.endpoints[CyncConstants.UPDATE_FILE_CLASSIFICATION], requestBody).subscribe(res => {
        this._message.addSingle(CyncConstants.SAVE_MESSAGE, "success");
        if (!isSavenCont) {
          this.navigateToSummaryPage();
        } else {
          this.addEditFileClassifications.reset();
          this._message.showLoader(false);
        }
      })
    }
  }

  /*for updating the existing record */
  updateFCDetails(model: FileClassification) {
    this._message.showLoader(true);
    let requestBody = new UpdateRequestBody();
    requestBody.file_classification = model;
    this._fcservice.updateDetails(this._apiMapper.endpoints[CyncConstants.UPDATE_FILE_CLASSIFICATION] + "/" + this.recordId, requestBody).subscribe(res => {
      this._message.addSingle(CyncConstants.UPDATE_MESSAGE, "success");
      this.navigateToSummaryPage();
    });
  }

  /*if user will press cancel button*/
  navigateToSummaryPage() {
    this._router.navigateByUrl("/otherGeneralCodes/file-classifications");
    this.addEditFileClassifications.reset();
    this._message.showLoader(false);
  }

  /*css For Validation*/
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditFileClassifications)
  }

  getFormControl(field: string) {
    return this.addEditFileClassifications.get(field);
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
      return !this.addEditFileClassifications.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditFileClassifications.valid || this.addEditFileClassifications.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }


}