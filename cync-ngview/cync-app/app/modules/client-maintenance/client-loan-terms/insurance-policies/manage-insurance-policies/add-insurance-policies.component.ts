import { Component, OnInit } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { Router } from "@angular/router";
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { ControlMessagesComponent } from '@cyncCommon/formValidation/control-messages.component'
import { Observable } from 'rxjs/Observable';
import { InsPoliciesService } from '../service/insurance-policies.service'
import { InsPoliciesModel, UpdateRequestBody } from '../model/insurance-policies.model'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

/**
* @author - Lavish
* 
*/
@Component({
  selector: 'app-ins-policiessss',
  templateUrl: './add-insurance-policies.component.html'
})
export class InsurancePoliciesAddComponent {

  lenderId: string;
  isDisable: boolean = false;
  InsPoliciesId: any;
  isCodeValid: boolean = true;
  isDescValid: boolean = true;
  IPDtls: any;
  currentAction: string = 'Add';
  addEditInsurancePolicies: FormGroup;
  requestModel: any;
  isSaveAndNew: boolean = false;
  isARNew: boolean;
  isSaveNContinue: boolean = false;
  borrowerId: string;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;

  constructor(private _location: Location,
    private _message: MessageServices,
    private formvalidationService: FormvalidationService,
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _service: CustomHttpService,
    private config: AppConfig,
    private _helper: Helper,
    private _apiMapper: APIMapper,
    private _commonService: CyncHttpService,
    private _ipservice: InsPoliciesService,
    private _clientSelectionService: ClientSelectionService
  ) {
    this.borrowerId = CyncConstants.getSelectedClient();

  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
    //this.registerReloadGridOnClientSelection();
    this.initFormValidator();
    this._renderForm();
  }

  /**
  * Initializing the form controls
  *
  */
  initFormValidator() {
    this.addEditInsurancePolicies = this.fb.group({
      legal_name: new FormControl('', Validators.compose([Validators.required])),
      insurance_name: new FormControl('', Validators.compose([Validators.required])),
      amount: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
  * getting the router parameter
  *
  */
  _renderForm() {
    /* getting router parameters */
    this.route.params.subscribe(params => {
      this.InsPoliciesId = params['id'];
      if (this.InsPoliciesId !== undefined && this.InsPoliciesId !== 'add') {
        this.currentAction = 'Edit';
        this.isARNew = false;
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showIPDetailsInForm();
      } else {
        this.currentAction = 'Add';
        this.isARNew = true;
        this.currentActionBtnText = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT;
      }
    });
  }

  /**
  * showing record details in form
  *
  */
  showIPDetailsInForm() {
    this._message.showLoader(true);
    this._ipservice.getIPDetails(this._apiMapper.endpoints[CyncConstants.UPDATE_INSURANCE_POLICIES].replace("{clientId}", this.borrowerId) + "/" + this.InsPoliciesId).subscribe(user => {
      this.addEditInsurancePolicies.patchValue(user, { onlySelf: true });
      this._message.showLoader(false);
    });

  }

  /**
  * call when user click on save button
  * @param - model, isVslid
  */
  saveData(model: InsPoliciesModel, isValid: boolean) {
    if (this.isARNew) {
      this.saveIPDetails(model, isValid);
    }
    if (!this.isARNew) {
      this.updateIPDetails(model);
    }
  }

  /**
  * saving the new record
  * @param - model, isVslid
  */
  saveIPDetails(model: InsPoliciesModel, isValid: boolean) {
    if (isValid) {
      let requestBody = new UpdateRequestBody();
      requestBody.insurance_policy = model;
      this._ipservice.saveInsPolicies(this._apiMapper.endpoints[CyncConstants.UPDATE_INSURANCE_POLICIES].replace("{clientId}", this.borrowerId), requestBody).subscribe(res => {
        this.getBackToList();
      })
    }
  }

  /**
  * for updating the existing record
  * @param - model
  */
  updateIPDetails(model: InsPoliciesModel) {
    this._message.showLoader(true);
    let requestBody = new UpdateRequestBody();
    requestBody.insurance_policy = model;
    this._ipservice.updateInsPolicies(this._apiMapper.endpoints[CyncConstants.UPDATE_INSURANCE_POLICIES].replace("{clientId}", this.borrowerId)
      + "/" + this.InsPoliciesId, requestBody).subscribe(res => {
        this.getBackToList();
      });
  }

  /**
  * call when user will press Save n Continue button
  *
  */
  saveNContinue(model: InsPoliciesModel, isValid: boolean) {
    if (isValid) {
      this.isSaveNContinue = true;
      this._message.showLoader(true);
      this.saveIPDetails(model, isValid);
    }
  }

  /**
  * call after saving the record
  *
  */
  getBackToList() {
    if (this.isARNew) {
      this._message.addSingle(CyncConstants.SAVE_MESSAGE, "success");
    } else {
      this._message.addSingle(CyncConstants.UPDATE_MESSAGE, "success");
    }
    if (!this.isSaveNContinue) { // if user has not clicked on save and continue
      this._router.navigateByUrl("/client-maintenance/client-loan-terms/insurance-policies");
    } else {
      this.isSaveNContinue = false;
    }
    this.addEditInsurancePolicies.reset();
    this._message.showLoader(false);
  }

  /**
  * call when user will press cancel button
  *
  */
  navigateToHome() {
    this._router.navigateByUrl("/client-maintenance/client-loan-terms/insurance-policies");
    this.addEditInsurancePolicies.reset();
    this._message.showLoader(false);
  }

  /**
  * getting css for validation
  * 
  */
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditInsurancePolicies)
  }

  /**
  * for validation
  * 
  */
  getFormControl(field: string) {
    return this.addEditInsurancePolicies.get(field);
  }

  /**
  * call when user will change the client
  * 
  */
 registerReloadGridOnClientSelection() {
  this._clientSelectionService.clientSelected.subscribe(clientId => {
    this.navigateToHome();
  });
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
      return !this.addEditInsurancePolicies.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditInsurancePolicies.valid || this.addEditInsurancePolicies.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

}