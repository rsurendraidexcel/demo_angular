import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { CurrencyCodeService } from '../service/currency-code.service';
import { CurrencyCode, UpdateCurrencyCode } from '../model/currency-code.model';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';

@Component({
  selector: 'app-manage-currency-code',
  templateUrl: './manage-currency-code.component.html',
  styleUrls: ['./manage-currency-code.component.scss']
})
export class ManageCurrencyCodeComponent implements OnInit {
  recordId: any;
  currentAction: string = 'Add';
  manageCurrencyCodeForm: FormGroup;
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
    private _service: CurrencyCodeService,
    private _formValidationService: FormValidationService,
    private _apiMsgService: APIMessagesService  ) {

  }

  ngOnInit() {
    this.initFormValidator();
    this._renderForm();
  }

  /**
    * Initiating form validator
    * 
    */
  initFormValidator() {
    this.manageCurrencyCodeForm = this.fb.group({
      currency_cd: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3), this._formValidationService.validateName])), //currency_cd
      description: new FormControl('', Validators.compose([Validators.required])),//Descritpion
      decimal_precision: new FormControl(5, Validators.compose([Validators.required, , this._formValidationService.validateNumber])),//decimal_precision
    });
  }

  /**
   *  rendering form
   */
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

  /**
   * showing details in form for requested id
   */
  showDetailsInForm() {
    this._message.showLoader(true);
    this._service.getCurrenyCodeDetails(this._apiMapper.endpoints[CyncConstants.GET_CURRENCY_CODE_DETAILS] + "/" + this.recordId).subscribe(response => {
      this.manageCurrencyCodeForm.patchValue(response, { onlySelf: true });
      this._message.showLoader(false);
    })
  }

  /*
   * this method will get called when user will press save button
   */
  saveData(model: CurrencyCode, isValid: boolean, isSavenCont: boolean) {
    if (this.isCurrentActionAdd()) {
      this.saveCurrencyCode(model, isValid, isSavenCont);
    } else {
      this.updateCurrencyCode(model);
    }
  }

  /**
   * this method will save new currency code 
   * @param model 
   * @param isValid 
   * @param isSavenCont 
   */
  saveCurrencyCode(model: CurrencyCode, isValid: boolean, isSavenCont: boolean) {
    if (isValid) {
      this._message.showLoader(true);
      let requestBody = new UpdateCurrencyCode();
      requestBody.currency = model;
      this._service.saveCurrencyCode(this._apiMapper.endpoints[CyncConstants.UPDATE_CURRENCY_CODE], requestBody).subscribe(res => {
        this._apiMsgService.add(new APIMessage('success', CyncConstants.SAVE_MESSAGE));
        if (!isSavenCont) {
          this.navigateToSummaryPage();
        } else {
          this.manageCurrencyCodeForm.reset();
          this._message.showLoader(false);
        }
      })
    }
  }


  /**
   * this method will update the currency code details 
   * @param model 
   */
  updateCurrencyCode(model: CurrencyCode) {
    this._message.showLoader(true);
    let requestBody = new UpdateCurrencyCode();
    requestBody.currency = model;
    this._service.updateCurrencyCode(this._apiMapper.endpoints[CyncConstants.UPDATE_CURRENCY_CODE] + "/" + this.recordId, requestBody).subscribe(res => {
      this._apiMsgService.add(new APIMessage('success', CyncConstants.UPDATE_MESSAGE));
      this.navigateToSummaryPage();
    });
  }

  /*css For Validation*/
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.manageCurrencyCodeForm)
  }

  getFormControl(field: string) {
    return this.manageCurrencyCodeForm.get(field);
  }


  /*if user will press cancel button*/
  navigateToSummaryPage() {
    this._router.navigateByUrl("/generalCodes/currency-code");
    this.manageCurrencyCodeForm.reset();
    this._message.showLoader(false);
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
      return !this.manageCurrencyCodeForm.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.manageCurrencyCodeForm.valid || this.manageCurrencyCodeForm.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }



}
