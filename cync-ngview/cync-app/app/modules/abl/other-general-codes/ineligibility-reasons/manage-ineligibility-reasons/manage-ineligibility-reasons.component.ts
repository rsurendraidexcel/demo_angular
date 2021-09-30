import { Component, OnInit } from '@angular/core';
import { IneligibilityReasonsService } from '../services/ineligibility-reasons.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Helper } from '@cyncCommon/utils/helper';
import {
  AddOrUpdateIneligibilityReasons,
  AddOrUpdateIneligibilityReasonsRequest,
  IneligibilityReasons
} from '../models/ineligibility-reasons.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MenuPaths } from '@cyncCommon/utils/menu-path';

@Component({
  selector: 'app-manage-ineligibility-reasons',
  templateUrl: './manage-ineligibility-reasons.component.html',
  styleUrls: ['./manage-ineligibility-reasons.component.scss']
})
export class ManageIneligibilityReasonsComponent implements OnInit {

  addEditIneligibilityReason: FormGroup;
  currentAction: string;
  headerText: string;
  isSaveAndNew: boolean = false;
  ineligibilityReasonId: number = 0;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;

  constructor(
    private _helper: Helper,
    private _ineligibilityReasonsService: IneligibilityReasonsService,
    private _message: MessageServices,
    private _fb: FormBuilder,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _apiMapper: APIMapper
  ) { }

  ngOnInit() {
    this._helper.adjustUI();
    this.initializeFormFields();
    this.checkCurrentAction();
  }

  /** 
   * initialize Form Fields
  */
  initializeFormFields() {
    this.addEditIneligibilityReason = this._fb.group({
      //label Name: Ineligibility Reason Code
      code: new FormControl('', [Validators.required]),
      //label Name: Description
      description: new FormControl('', [Validators.required]),
      //label Name: System Defined
      // system_defined: new FormControl(''),
      //label Name: Calculate On Negative Balance
      calculate_on_negative_balance: new FormControl(''),
      calculate_on_negative_debtor_balance: new FormControl('')
    });
    this.setDefaultValue();
  }

  /** 
   * Set Default values for few form fields
  */
  setDefaultValue() {
    this.addEditIneligibilityReason.patchValue({ 'calculate_on_negative_balance': false });
    // this.addEditIneligibilityReason.patchValue({ 'system_defined': false });
    //this.addEditIneligibilityReason.controls['system_defined'].disable();
  }

  /**
   * Check If current action is Add or Update
   */
  checkCurrentAction() {
    this._activateRoute.params.subscribe(params => {
      let tmpId = params['id'];
      if (tmpId != undefined && tmpId != 'add') {
        //Update Action
        this.ineligibilityReasonId = tmpId;
        this.currentAction = CyncConstants.EDIT_OPERATION;
        this.headerText = 'Ineligibility Reasons - Edit';
        this._message.showLoader(true);
        this.getRecordAndUpdateFormFields();
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
      } else {
        //Create Action
        this.currentAction = CyncConstants.ADD_OPERATION;
        this.headerText = 'Ineligibility Reasons - Add';
      }
    });
  }

  /**
  * This Method is used to check if the current action is add
  */
  isCurrentActionAdd(): boolean {
    return this._helper.isCurrentActionAdd(this.currentAction);
  }

  /**
   * Get record details and update with form
   */
  getRecordAndUpdateFormFields() {
    let apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_INELIGIBILITY_REASONS];
    if (this.ineligibilityReasonId > 0) {
      this._ineligibilityReasonsService.getRecord(apiEndpoint, this.ineligibilityReasonId).subscribe(apiresponse => {
        let ineligibilityReasonModel: IneligibilityReasons = apiresponse;
        this.addEditIneligibilityReason.patchValue(ineligibilityReasonModel);
        this._message.showLoader(false);
      });
    }

  }

  /**
   * on click of save button this event gets fired
   * @param model 
   */
  saveRecord(model: AddOrUpdateIneligibilityReasons) {
    if (this.addEditIneligibilityReason.valid) {
      //console.log("::ineligibilityReasonModel-----", model);
      this.addOrUpdateRecord(model);
    }else{
      // need to show validation error msg on page . as phase1 
      // TODO
    }
  }

  /**
   * Based on the current action add or update the record
   * @param model 
   */
  addOrUpdateRecord(model: AddOrUpdateIneligibilityReasons) {
    let requestModel: AddOrUpdateIneligibilityReasonsRequest = new AddOrUpdateIneligibilityReasonsRequest();
    requestModel.ineligibility_reason = model;
    if (this.isCurrentActionAdd()) {
      //Add IneligibilityReasons
      let apiEndpoint = this._apiMapper.endpoints[CyncConstants.ADD_INELIGIBILITY_REASONS];
      this.addRecord(apiEndpoint, requestModel);
    } else {
      //Update IneligibilityReasons
      let apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_OR_UPDATE_INELIGIBILITY_REASONS];
      if (this.ineligibilityReasonId > 0) {
        this.updateRecord(apiEndpoint, requestModel);
      }
    }

  }

  /**
   * Call the api to add the record
   * @param apiEndpoint 
   * @param requestModel 
   */
  addRecord(apiEndpoint: string, requestModel: AddOrUpdateIneligibilityReasonsRequest) {
    this._ineligibilityReasonsService.createRecord(apiEndpoint, requestModel).subscribe(apiResponse => {
      if (apiResponse.status == CyncConstants.STATUS_201 || apiResponse.status == CyncConstants.STATUS_200) {
        //console.log("::successfully added IneligibilityReasons");
        //show success message
        this.fireSuccessMsg(CyncConstants.CREATE_SUCCESS_MSG);

        if (!this.isSaveAndNew) {
          //redirect to summary page if isSaveAndNew is false
          this.navigateToListIneligibilityReasons();
        } else {
          //reset form fields to add new record
          this.addEditIneligibilityReason.reset();
          this.setDefaultValue();
          this.isSaveAndNew = false;
        }

      }
    });
  }

  /**
   * Call the api to update the record
   * @param apiEndpoint 
   * @param requestModel 
   */
  updateRecord(apiEndpoint: string, requestModel: AddOrUpdateIneligibilityReasonsRequest) {
    if (this.addEditIneligibilityReason.pristine) {
      //console.log(":::untouched");
      //redirect to summary page 
      this.navigateToListIneligibilityReasons();
    } else {
      //console.log(":::made changes");
      this._ineligibilityReasonsService.updateRecord(apiEndpoint, this.ineligibilityReasonId, requestModel).subscribe(apiresponse => {
        if (apiresponse.status == CyncConstants.STATUS_204 || apiresponse.status == CyncConstants.STATUS_200) {
          //console.log("::updated IneligibilityReason successfully");
          //show success message
          this.fireSuccessMsg(CyncConstants.UPDATE_SUCCESS_MSG);
          //redirect to summary page 
          this.navigateToListIneligibilityReasons();
        }
      });
    }

  }

  /**
   * Show success message
   * @param successMsg 
   */
  fireSuccessMsg(successMsg: string) {
    this._ineligibilityReasonsService.showSuccessMessage(successMsg);
  }

  /**
   * Save the record and add new record
   * @param model 
   */
  saveAndAddNew(model: AddOrUpdateIneligibilityReasons) {
    this.isSaveAndNew = true;
    this.saveRecord(model);
  }

  /**
   * After saving the record redirect to Summary page
   */
  navigateToListIneligibilityReasons() {
    this._router.navigateByUrl(MenuPaths.INELIGIBILITY_REASON_PATH);
  }

  //Form Validation Code
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditIneligibilityReason)
  }

  getFormControl(field: string) {
    return this.addEditIneligibilityReason.get(field);
  }

  /**
   * If user has not done any changes to form , this method is to check same and disable action btn save/update
   */
  isFormValid(): boolean {
    if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      return !this.addEditIneligibilityReason.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditIneligibilityReason.valid || this.addEditIneligibilityReason.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

}
