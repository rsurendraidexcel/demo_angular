import { Component, OnInit } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { Router } from "@angular/router";
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { ControlMessagesComponent } from '@cyncCommon/formValidation/control-messages.component'
import { Observable } from 'rxjs/Observable';
import { PersonalGuarantorsService } from '../service/personal-guarantors.service'
import { PersonalGuarantorsModel, UpdateRequestBody } from '../model/personal-guarantors.model'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

/**
* @author - Lavish
*
*/
@Component({
  selector: 'app-personal-add',
  templateUrl: './add-personal-guarantors.component.html'
})
export class PersonalGuarantorsAddComponent {

  lenderId: string;
  isDisable: boolean = false;
  RecordId: any;
  isCodeValid: boolean = true;
  isDescValid: boolean = true;
  IPDtls: any;
  currentAction: string = 'Add';
  addEditForm: FormGroup;
  requestModel: any;
  isSaveAndNew: boolean = false;
  isARNew: boolean;
  isSaveNContinue: boolean = false;
  borrowerId: string;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;


  constructor(
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
    private _pgservice: PersonalGuarantorsService,
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
    this.addEditForm = this.fb.group({
      legal_name: new FormControl('', Validators.compose([Validators.required])),
      percent_owned: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
  * getting the router parameter
  *
  */
  _renderForm() {
    /* getting router parameters */
    this.route.params.subscribe(params => {
      this.RecordId = params['id'];
      if (this.RecordId !== undefined && this.RecordId !== 'add') {
        this.currentAction = 'Edit';
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.isARNew = false;
        this.showDetailsInForm();
      } else {
        this.currentAction = 'Add';
        this.currentActionBtnText = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT;
        this.isARNew = true;
      }
    });
  }

  /**
  * showing record details in form
  *
  */
  showDetailsInForm() {
    this._message.showLoader(true);
    this._pgservice.getDetails(this._apiMapper.endpoints[CyncConstants.UPDATE_PERSONAL_GUARANTORS].replace("{clientId}", this.borrowerId) + "/" + this.RecordId).subscribe(user => {
      this.addEditForm.patchValue(user, { onlySelf: true });
      this._message.showLoader(false);
    });

  }

  /**
  * call when user click on save button
  * @param - model, isVslid
  */
  saveData(model: PersonalGuarantorsModel, isValid: boolean) {
    if (this.isARNew) {
      this.saveDetails(model, isValid);
    }
    if (!this.isARNew) {
      this.updateDetails(model);
    }
  }

  /**
  * saving the new record
  * @param - model, isVslid
  */
  saveDetails(model: PersonalGuarantorsModel, isValid: boolean) {
    if (isValid) {
      let requestBody = new UpdateRequestBody();
      requestBody.personal_guarantor = model;
      this._pgservice.savePersonalGuarantors(this._apiMapper.endpoints[CyncConstants.UPDATE_PERSONAL_GUARANTORS].replace("{clientId}", this.borrowerId), requestBody).subscribe(res => {
        this.getBackToList();
      })
    }
  }

  /**
  * for updating the existing record
  * @param - model
  */
  updateDetails(model: PersonalGuarantorsModel) {
    this._message.showLoader(true);
    let requestBody = new UpdateRequestBody();
    requestBody.personal_guarantor = model;
    this._pgservice.updatePersonalGuarantors(this._apiMapper.endpoints[CyncConstants.UPDATE_PERSONAL_GUARANTORS].replace("{clientId}", this.borrowerId)
      + "/" + this.RecordId, requestBody).subscribe(res => {
        this.getBackToList();
      });
  }

  /**
  * save and continue button
  * @param - model, isVslid
  */
  saveNContinue(model: PersonalGuarantorsModel, isValid: boolean) {
    if (isValid) {
      this.isSaveNContinue = true;
      this._message.showLoader(true);
      this.saveDetails(model, isValid);
    }
  }

  /**
  * get back to summary page
  * 
  */
  getBackToList() {
    if (this.isARNew) {
      this._message.addSingle(CyncConstants.SAVE_MESSAGE, "success");
    } else {
      this._message.addSingle(CyncConstants.UPDATE_MESSAGE, "success");
    }
    if (!this.isSaveNContinue) { // if user has not clicked on save and continue
      this._router.navigateByUrl("/client-maintenance/client-loan-terms/personal-guarantors");
    } else {
      this.isSaveNContinue = false;
    }
    this.addEditForm.reset();
    this._message.showLoader(false);
  }

  /**
  * call when user will press cancel button
  *
  */
  navigateToHome() {
    this._router.navigateByUrl("/client-maintenance/client-loan-terms/personal-guarantors");
    this.addEditForm.reset();
    this._message.showLoader(false);
  }

  /**
  * getting css for validation
  * 
  */
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditForm)
  }

  /**
  * for validation
  * 
  */
  getFormControl(field: string) {
    return this.addEditForm.get(field);
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
      return !this.addEditForm.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditForm.valid || this.addEditForm.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

}