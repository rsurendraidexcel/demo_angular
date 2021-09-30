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
import { BorrowerGuarantorsService } from '../service/borrower-guarantors.service.component'
import { Country, State, NaicsCodeCombined, NaicsCode, CorporateType, BorrowerGuarantors, UpdateRequestBody } from '../model/borrower-guarantors.model.component'
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

/**
* @author - Lavish
*
*/
@Component({
  selector: 'app-borrower-guarantors-add',
  templateUrl: './add.borrower-guarantors.component.html'
})
export class BorrowerGuarantorsAddComponent {

  addEditBorrowerGuarantors: FormGroup;
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
  countriesList: Country[];
  corporateTypeList: any[];
  statesList: State[];
  naicsCodeList: NaicsCodeCombined[];
  filteredNaicsCode: NaicsCodeCombined[];
  naicsCodesList: NaicsCode[];
  corporateTypesList: CorporateType[];
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
    private _borrowersService: BorrowerGuarantorsService,
    private _clientSelectionService: ClientSelectionService
  ) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
    this._message.showLoader(true);
   // this.registerReloadGridOnClientSelection();
    this.initializeForm();
    this.getAllCountries();
    this.getCorporateType();
    this.getAllNaicsCode();
    this._renderForm();
    //this.getNaicsCodes();
  }

  /**
  * Initializing the form controls
  *
  */
  initializeForm() {
    this.addEditBorrowerGuarantors = this.fb.group({
      company_name: new FormControl('', Validators.compose([Validators.required])),//label Name: Company Name
      federal_id: new FormControl('', Validators.compose([Validators.required])),//label Name: Federal Id
      country_id: new FormControl(''),      //label Name: Country
      state_province_id: new FormControl(''), //label Name: State
      naics_code_id: new FormControl('', Validators.compose([Validators.required])),//label Name: NAICS Codes
      corporate_type: new FormControl(''), //label Name: Corporate Type
      percent_owned: new FormControl(''), //label Name: Percent Owned
    });
    this.enableOrDisableStateDropDown();
  }

  /**
  * getting the router parameter
  *
  */
  _renderForm() {
    this.route.params.subscribe(params => {
      this.RecordId = params['id'];
      if (this.RecordId !== undefined && this.RecordId !== 'add') {
        this.currentAction = 'Edit';
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showDetailsInForm();
      } else {
        this.currentAction = 'Add';
        this.currentActionBtnText = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT;
        this.addEditBorrowerGuarantors.controls['country_id'].setValue(null);
        // this.addEditGuarantors.controls['naics_code_id'].setValue(null);
        this.addEditBorrowerGuarantors.controls['state_province_id'].setValue(null);
        this.addEditBorrowerGuarantors.controls['corporate_type'].setValue(null);
      }
    });
  }

  /**
  * showing record details in form
  *
  */
  showDetailsInForm() {
    this._borrowersService.getDetails(this._apiMapper.endpoints[CyncConstants.UPDATE_CLIENT_BORROWER_GUARANTORS].replace("{clientId}", this.borrowerId) + "/" + this.RecordId).subscribe(user => {
      this.addEditBorrowerGuarantors.patchValue(user, { onlySelf: true });
      this.onChangeOfCountry()
    });
  }

  /**
  * getting the countries list for dropdown
  * 
  */
  getAllCountries() {
    this._borrowersService.setCountriesListApiEndpoint();
    this._borrowersService.getCountriesList().subscribe(countriesResp => {
      this.countriesList = countriesResp;
    });
  }

  /**
  * method will call on change of country value in dropdown
  * 
  */
  onChangeOfCountry() {
    this._borrowersService.setStatesListApiEndpoint(this.addEditBorrowerGuarantors.controls['country_id'].value);
    this.getAllStatesByCountryId();
  }

  /**
  * getting state list by country id
  * 
  */
  getAllStatesByCountryId() {
    this._borrowersService.getStatesListBasedOnSelectedCountry().subscribe(statesResp => {
      this.statesList = statesResp;
      this.enableOrDisableStateDropDown();
    })
  }

  /**
  * making state dropdown enable/disable based on api response 
  * 
  */
  enableOrDisableStateDropDown() {
    if (this.statesList != undefined && this.statesList.length > 0) {
      this.addEditBorrowerGuarantors.controls['state_province_id'].enable();
    } else {
      this.addEditBorrowerGuarantors.controls['state_province_id'].disable();
    }
  }

  /**
  * getting naics codes list for dropdown
  * 
  */
  getAllNaicsCode() {
    this._borrowersService.setNaicsCodeListApiEndpoint();
    this._borrowersService.getNaicsCodeList().subscribe(naicsResp => {
      this.naicsCodesList = naicsResp;
      this._message.showLoader(false);
    });
  }

  /*   getNaicsCode() {
      this.naicsCodeList = this._guarantorsService.getCombinedNaicsCode();
    }
  
    filterSearchedNaicsCode(event) {
      let query = event.query;
      this.filteredNaicsCode = this._guarantorsService.searchForNaicsCode(query, this.naicsCodeList);
    } */

  /**
  * getting corporate list for dropdown
  * 
  */
  getCorporateType() {
    this._borrowersService.setCotporateListApiEndpoint();
    this._borrowersService.getCorporateList().subscribe(Resp => {
      this.corporateTypesList = Resp;
    });
  }

  /**
  * call when user click on save button
  * @param - model, isVslid, isSavenCont
  */
  saveData(model: BorrowerGuarantors, isValid: boolean, isSavenCont: boolean) {
    if (this.currentAction == 'Add') {
      this.saveDetails(model, isValid, isSavenCont);
    }
    if (this.currentAction == 'Edit') {
      this.updateRecordDetails(model);
    }
  }

  /**
  * saving the new record
  * @param - model, isVslid, isSavenCont
  */
  saveDetails(model: BorrowerGuarantors, isValid: boolean, isSavenCont: boolean) {
    if (isValid) {
      this._message.showLoader(true);
      let requestBody = new UpdateRequestBody();
      requestBody.guarantor_borrower = model;
      this._borrowersService.saveNew(this._apiMapper.endpoints[CyncConstants.UPDATE_CLIENT_BORROWER_GUARANTORS].replace("{clientId}", this.borrowerId), requestBody).subscribe(res => {
        this._message.addSingle(CyncConstants.SAVE_MESSAGE, "success");
        if (!isSavenCont) {
          this.navigateToHome();
        } else {
          this.addEditBorrowerGuarantors.reset();
          this.addEditBorrowerGuarantors.controls['state_province_id'].disable();
          this.addEditBorrowerGuarantors.controls['naics_code_id'].setValue("");
          this._message.showLoader(false);
        }
      })
    }
  }

  /**
  * for updating the existing record
  * @param - model
  */
  updateRecordDetails(model: BorrowerGuarantors) {
    this._message.showLoader(true);
    let requestBody = new UpdateRequestBody();
    requestBody.guarantor_borrower = model;
    this._borrowersService.updateDetails(this._apiMapper.endpoints[CyncConstants.UPDATE_CLIENT_BORROWER_GUARANTORS].replace("{clientId}", this.borrowerId) + "/" + this.RecordId, requestBody).subscribe(res => {
      this._message.addSingle(CyncConstants.UPDATE_MESSAGE, "success");
      this.navigateToHome();
    });
  }

  /**
  * call when user will press cancel button
  *
  */
  navigateToHome() {
    this._router.navigateByUrl("/client-maintenance/client-loan-terms/borrower-guarantors");
    this.addEditBorrowerGuarantors.reset();
    this._message.showLoader(false);
  }

  /**
  * getting css for validation
  * 
  */
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.addEditBorrowerGuarantors)
  }

  /**
  * for validation
  * 
  */
  getFormControl(field: string) {
    return this.addEditBorrowerGuarantors.get(field);
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
      return !this.addEditBorrowerGuarantors.valid;
    } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.addEditBorrowerGuarantors.valid || this.addEditBorrowerGuarantors.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }



}