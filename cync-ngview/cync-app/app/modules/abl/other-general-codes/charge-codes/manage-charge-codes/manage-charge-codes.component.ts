import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppConfig } from '@app/app.config';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ChargeCodes, AddEditChargeCodes, Dropdown } from '../model/charge-codes.model';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ChargeCodesService } from '../service/charge-codes-service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of, interval } from 'rxjs';

@Component({
  selector: 'app-add-charge-codes',
  templateUrl: './manage-charge-codes.component.html'
})

/**
 * @author : Saakshi Sharma
 */
export class ManageChargeCodesComponent implements OnInit {

  chargeCodesForm: FormGroup;
  chargeCodeId: any;
  currentAction: string = CyncConstants.ADD_OPERATION;
  asyncData: any;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;
  //DropDown Global Variables
  frequencies: SelectDropDown[];
  nat_signs: SelectDropDown[];
  charge_types: SelectDropDown[];
  posting_types: SelectDropDown[];
  source_types: SelectDropDown[];


  // These variables will have display texts for all the frequencies and charge type
  allFrequencies: Dropdown[];
  allChargeTypes: Dropdown[];
  chargeCodesDropDownResult : Observable<any>;

  static CHARGE_CODE_SYSTEM_FREQUENCY = 'SD';
  static CHARGE_TYPE_OVER_ADVANCE = 'OAD';
  static CHARGE_TYPE_NEW_SALES = 'NS';
  static CHARGE_TYPE_ACCURED_INTEREST = 'AI';
  static DISABLE_SD_OA_PARAMS = ['charge_type', 'natural_sign', 'frequency', 'add_to_borrower'];
  static DISABLE_SD_PARAMS = ['charge_type', 'natural_sign', 'frequency', 'add_to_borrower', 'posting_type', 'charge_value'];
  static DISABLE_NS_OA_PARAMS = ['charge_type', 'natural_sign', 'frequency', 'add_to_borrower', 'posting_type'];
  static DISABLE_AI_PARAMS = ['charge_type', 'natural_sign', 'frequency', 'add_to_borrower', 'posting_type', 'charge_value', 'sequence'];

  /**
   * Constructor for Add/Edit Charge Code Components
   * @param _router
   * @param _helper
   * @param route
   * @param fb
   * @param _apiMapper
   * @param chargeCodesService
   * @param _service
   * @param _msgLoader
   */
  constructor(private _router: Router,
    private _helper: Helper,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _apiMapper: APIMapper,
    private chargeCodesService: ChargeCodesService,
    private _service: CustomHttpService,
    private _msgLoader: MessageServices) {
  }

  /**
   * Initialize the form data and also Renders the form in case of Edit operation
   */
  ngOnInit() {
    this._helper.adjustUI();
    this.initFormValidator();
   
    this.getDropDownValues().subscribe(result => {
      this.populateDropDown(result);
      this._renderForm();
    })

  }

  /**
   * This method Initializes form data
   */
  initFormValidator() {
    this.chargeCodesForm = this.fb.group({
      frequency: new FormControl(null, Validators.compose([Validators.required])), //Frequency
      description: new FormControl('', Validators.compose([Validators.required])),  //Charge Codes
      natural_sign: new FormControl(null, Validators.compose([Validators.required])), //Nat Sign
      charge_type: new FormControl(null, Validators.compose([Validators.required])), //Charge Type
      //Add this one once api is ready
      posting_type: new FormControl(null, Validators.compose([Validators.required])), //Posting Type
      source_type: new FormControl(null, Validators.compose([])), //Source Type
      trans_code: new FormControl('', Validators.compose([])), //Transaction Code
      sequence: new FormControl('', Validators.compose([])), //Sequence
      charge_value: new FormControl('', Validators.compose([])), //Value

      //Check if this is Auto New Client
      add_to_borrower: new FormControl('', Validators.compose([])), //Auto New Client
      id: new FormControl('', Validators.compose([])), //Id field not to show

    });
  }

  /**
   * Get Drop down values using APIs
   */
  getDropDownValues() : Observable<any[]> {
    let res1 = this.chargeCodesService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.NAT_SIGNS], 'natural_sign');
    let res2 = this.chargeCodesService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.FREQUENCY], 'frequency');
    let res3 = this.chargeCodesService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.CHARGE_TYPE], 'charge_type');
    let res4 = this.chargeCodesService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.POSTING_TYPE], 'posting_type');
    //let res5 = this.chargeCodesService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.SOURCE_TYPE], 'source_type');
    return forkJoin([res1, res2, res3, res4]);
  }

  /**
   * This method will populate all teh dropdown fields from the data recieved from service
   * @param result
   */
  populateDropDown(result : any){
    // Pass url for Nat Sign Drop Down
    this.nat_signs = this.mapDropDownToSelectDropDown(result[0]);

    // Pass url for Frequencies Drop Down
    this.allFrequencies = result[1];
    this.frequencies = this.mapDropDownToSelectDropDown(result[1]);

    // Pass url for Charge Type Drop Down
    this.allChargeTypes = result[2];
    this.charge_types = this.mapDropDownToSelectDropDown(result[2]);

    // Pass url for Posting Type Drop Down
    this.posting_types = this.mapDropDownToSelectDropDown(result[3]);

  }

  /**
   * This method is used to map the dropdown Datatype list
   * to SelectDropDown Datatype list
   * @param dropDownsList
   */
  mapDropDownToSelectDropDown(dropDownsList: Dropdown[]): SelectDropDown[] {
    if (dropDownsList !== null && dropDownsList !== undefined) {
      return dropDownsList.filter(d => (d.show === undefined || d.show)).map(d => new SelectDropDown(d.value, d.text));
    }
    return [];
  }


  /**
   * Render Form with values as per the Add / Edit operation
   */
  _renderForm() {
    /* getting router parameters */
    this.route.params.subscribe(params => {
      this.chargeCodeId = params['id'];
      if (this.chargeCodeId !== undefined && !this._helper.isCurrentActionAdd(this.chargeCodeId)) {
        this.currentAction = CyncConstants.EDIT_OPERATION;
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showChargeCodesForm();
      } else {
        this.currentAction = CyncConstants.ADD_OPERATION;
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
   * This method is used to enable or disable Charge Code page fields
   * based on the frequency and charge Type Drop Down
   */
  renderChargeCodesDisabledParams(frequency: string, charge_type: string) {
    let paramList: string[] = [];
    if (this._helper.compareIgnoreCase(charge_type, ManageChargeCodesComponent.CHARGE_TYPE_ACCURED_INTEREST)) {
      paramList = ManageChargeCodesComponent.DISABLE_AI_PARAMS;
    } else if (this._helper
      .compareIgnoreCase(frequency, ManageChargeCodesComponent.CHARGE_CODE_SYSTEM_FREQUENCY)
      && this._helper.compareIgnoreCase(charge_type, ManageChargeCodesComponent.CHARGE_TYPE_OVER_ADVANCE)) {
      paramList = ManageChargeCodesComponent.DISABLE_SD_OA_PARAMS;
    } else if (this._helper
      .compareIgnoreCase(frequency, ManageChargeCodesComponent.CHARGE_CODE_SYSTEM_FREQUENCY)) {
      paramList = ManageChargeCodesComponent.DISABLE_SD_PARAMS;
    } else if (this._helper
      .compareIgnoreCase(charge_type, ManageChargeCodesComponent.CHARGE_TYPE_NEW_SALES)
      || this._helper.compareIgnoreCase(charge_type, ManageChargeCodesComponent.CHARGE_TYPE_OVER_ADVANCE)) {
      paramList = ManageChargeCodesComponent.DISABLE_NS_OA_PARAMS;
    } else {
      return;
    }
    this.disableChargeCodesParams(paramList);
  }

  /**
   * This method is used to disable the fields provided in input list
   * @param paramsList
   */
  disableChargeCodesParams(paramsList: string[]) {
    paramsList.forEach(param => this.chargeCodesForm.get(param).disable());
  }

  /**
   * Method to map Charge Codes Model Values with Charge Codes Form
   */
  showChargeCodesForm() {
    this._msgLoader.showLoader(true);
    this.chargeCodesService.getChargeCodesById(this._apiMapper.endpoints[CyncConstants.CHARGE_CODES_BY_ID].replace('{id}', this.chargeCodeId)).subscribe(chargeCodesResponse => {
      chargeCodesResponse['source_type'] = (chargeCodesResponse['source_type'] == 'hyphen') ? 'null' : chargeCodesResponse['source_type'];
      this.chargeCodesForm.patchValue(chargeCodesResponse);
      // Show hidden Charge Type or Frequency Fields when required
      this.appendFieldsToDropDown(this.allFrequencies, chargeCodesResponse.frequency, this.frequencies);
      this.appendFieldsToDropDown(this.allChargeTypes, chargeCodesResponse.charge_type, this.charge_types)
      const frequencyExists = this.allFrequencies.map(f => f.value).includes(chargeCodesResponse.frequency);
      this.renderChargeCodesDisabledParams(chargeCodesResponse.frequency, chargeCodesResponse.charge_type);
      this.sourceTypeAPICall(chargeCodesResponse.posting_type);
      this._msgLoader.showLoader(false);
    });
    
  }

  /**
  * Source type dropdown api call
  * @param posting_type 
  */
  sourceTypeAPICall(posting_type: string){
    if(posting_type != null && posting_type != undefined && posting_type != ''){
      const url = this._apiMapper.endpoints[CyncConstants.SOURCE_TYPE] + "?posting_type=" + encodeURIComponent(posting_type);
      this.chargeCodesService.getDropDownValues(url, 'source_type').subscribe(sourceTypeResult => {
        this.source_types = this.mapDropDownToSelectDropDown(sourceTypeResult)
      });
    }

  }
  
  /**
   * This method is used to append the System frequency
   * or OAD, NS and AI
   * @param allDropDownFields
   * @param chargeCodesResponse
   * @param dropdownList
   * @param responseKey
   */
  appendFieldsToDropDown(allDropDownFields: Dropdown[], value: string,
    dropdownList: SelectDropDown[]) {
    if (allDropDownFields != undefined) {
      const dropDownField = allDropDownFields.find(d => d.value === value);
      if (dropDownField !== undefined && !dropDownField.show) {
        dropdownList.push(new SelectDropDown(dropDownField.value, dropDownField.text));
      }
    }
  }

  /**
   * Method to save Charge Codes
   * @param model
   * @param isValid
   */
  saveChargeCode(model: ChargeCodes, isValid: boolean, isNew: boolean) {
    let chargeCodesModel = new AddEditChargeCodes();
    chargeCodesModel.charge_code = model;
    if (isValid) {
      if (this.isCurrentActionAdd()) {
        this.createChargeCode(chargeCodesModel, isNew);
      } else {
        this.updateChargeCode(chargeCodesModel)
      }

    }
  }

  /**
   * Method to Create New Charge Code
   * @param requestBody
   * @param isNew
   */
  createChargeCode(model: AddEditChargeCodes, isNew: boolean) {
    let message: string = 'Charge Code saved successfully,';
    //Only in case of save and new we need to show the loader because in other case the getdata method has loader
    this._msgLoader.showLoader(true);

    // Model update null value with empty string
    Object.keys(model.charge_code).forEach(function(key) {
      if(model.charge_code[key] === null) {
        if(key == 'source_type'){
          model.charge_code[key] = 'hyphen';
        }else{
          model.charge_code[key] = '';
        }
      }
    });
    
    this.chargeCodesService.saveChargeCode(this._apiMapper.endpoints[CyncConstants.CHARGE_CODES_API], model).subscribe(res => {
      this._helper.showApiMessages(message, 'success');
      this._msgLoader.showLoader(false);
      if (!isNew) {
        this.navigateToChargeCodesList();
      } else {
        // On Click of Save and New the form should get reset and Drop Downs should be reloaded
        this.chargeCodesForm.reset();
        //this.getDropDownValues();
      }
    });
  }

  /**
   * Method to Update Charge Codes
   * @param model
   * @param isValid
   */
  updateChargeCode(model: AddEditChargeCodes) {
    // Validate the charge value cannot be null
    if (model.charge_code !== undefined && (model.charge_code.charge_value === null || model.charge_code.charge_value === undefined)) {
      model.charge_code.charge_value = 0.0;
    }

    // Model update null value with empty string
    Object.keys(model.charge_code).forEach(function(key) {
      if(model.charge_code[key] === null) {
        if(key == 'source_type'){
          model.charge_code[key] = 'hyphen';
        }else{
          model.charge_code[key] = '';
        }
      }
    });

    if(model.charge_code['source_type'] === "interest" && this.chargeCodesForm.get('description').value === "ACCRUED INTEREST L"){
     
      model.charge_code['source_type'] = "accrued interest";
    }

    if(model.charge_code['source_type'] === "interest" && this.chargeCodesForm.get('description').value === "ACCRUED INTEREST S"){
     
      model.charge_code['source_type'] = "accrued interest";
    }

    if(model.charge_code['source_type'] === "fees/charges" && this.chargeCodesForm.get('description').value === "ACCRUED FEES L"){
     
      model.charge_code['source_type'] = "accrued fees/charges";
    }

    if(model.charge_code['source_type'] === "fees/charges" && this.chargeCodesForm.get('description').value === "ACCRUED FEES S"){
     
      model.charge_code['source_type'] = "accrued fees/charges";
    }

    if(model.charge_code['source_type'] === "fees/charges" && this.chargeCodesForm.get('description').value === "ADJUSTMENT"){
     
      model.charge_code['source_type'] = "adjustment";
    }

    this.chargeCodesService.updateChargeCodes(this._apiMapper.endpoints[CyncConstants.CHARGE_CODES_BY_ID].replace('{id}', this.chargeCodeId), model).subscribe(res => {
      let message: string = 'Charge Code updated successfully';
      this._helper.showApiMessages(message, 'success');
      this.navigateToChargeCodesList();
    });
  }

  /**
   * Method to navigate back to charge codes list
   */
  navigateToChargeCodesList() {
    this._router.navigateByUrl(MenuPaths.CHARGE_CODES_PATH);
  }

  /**
   * Method to hightlight mandatory fileds if form validations fail
   * @param field
   */
  displayCssField(field: string) {
    return this._helper.getFieldCss(field, this.chargeCodesForm);

  }

  /**
   * Get Form Control field
   * @param field
   */
  getFormControl(field: string) {
    return this.chargeCodesForm.get(field);
  }

  /**
   * If user has not done any changes to form , this method is to check same and disable action btn save/update
   */
  isFormValid(): boolean {
    if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      return !this.chargeCodesForm.valid;
    }

    if (CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.chargeCodesForm.valid || this.chargeCodesForm.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

  /**
  * Check source type enable/disable validation according to posting type value
  */
  sourceTypeValidation(): any{
    let currentSourceValue = this.chargeCodesForm.get('description').value;
    if(currentSourceValue === 'REPAYMENT' || currentSourceValue === 'DISBURSEMENT' || currentSourceValue === 'INTEREST' || currentSourceValue === 'ADJUSTMENT' || currentSourceValue === 'ACCRUED INTEREST L' || currentSourceValue === 'ACCRUED FEES L' || currentSourceValue === 'ACCRUED INTEREST S' || currentSourceValue === 'ACCRUED FEES S'){
     // this.chargeCodesForm.controls.source_type.setValue(null);
     switch (currentSourceValue) {
      case 'DISBURSEMENT':
        
        this.chargeCodesForm.controls.source_type.setValue('advance');
        break;
      case 'REPAYMENT':
        
        this.chargeCodesForm.controls.source_type.setValue('collection');
        break;
        case 'INTEREST':

          this.chargeCodesForm.controls.source_type.setValue('interest');
          break;

          case 'ACCRUED INTEREST L':
            this.chargeCodesForm.controls.source_type.setValue('interest');
            break;

            case 'ACCRUED FEES L':

              this.chargeCodesForm.controls.source_type.setValue('fees/charges');
              break;

              case 'ACCRUED INTEREST S':
                this.chargeCodesForm.controls.source_type.setValue('interest');
                break;
    
                case 'ACCRUED FEES S':
    
                  this.chargeCodesForm.controls.source_type.setValue('fees/charges');
                  break;

          case 'ADJUSTMENT':
       
            this.chargeCodesForm.controls.source_type.setValue('fees/charges');
            break;
    }
      return false;


    }else{
      // this.chargeCodesForm.controls.source_type.setValue(null);
      return true;
    }
  }



  /**
  * Posting dropdown value change event
  */
  onChangePostingValue(selectedOption: string) {
    let currentSourceValue = this.chargeCodesForm.get('description').value;
    

        if(currentSourceValue === 'REPAYMENT' || currentSourceValue === 'DISBURSEMENT' || currentSourceValue === 'INTEREST' || currentSourceValue === 'ADJUSTMENT'){
          const popupParam = { };
          this._helper.openAlertPoup('Alert',  "The action will also change the posting type of custom interest charge code if present")
        
       
    let formatedSelectedValue = '';
    if(selectedOption.includes("in balance")){
      formatedSelectedValue = 'in balance';
    }else if(selectedOption.includes("accrue to loan")){
      formatedSelectedValue = 'accrue to loan';
    }else if(selectedOption.includes("accrue to statement")){
      formatedSelectedValue = 'accrue to statement';
    }
    if(selectedOption.includes("in balance") || selectedOption.includes("accrue to loan") || selectedOption.includes("accrue to statement")){
      this.sourceTypeAPICall(formatedSelectedValue);
      this.chargeCodesForm.controls.source_type.setValue("fees/charges");
    }
  }

else{
  let formatedSelectedValue = '';
  if(selectedOption.includes("in balance")){
    formatedSelectedValue = 'in balance';
  }else if(selectedOption.includes("accrue to loan")){
    formatedSelectedValue = 'accrue to loan';
  }else if(selectedOption.includes("accrue to statement")){
    formatedSelectedValue = 'accrue to statement';
  }
  if(selectedOption.includes("in balance") || selectedOption.includes("accrue to loan") || selectedOption.includes("accrue to statement")){
    this.sourceTypeAPICall(formatedSelectedValue);
    this.chargeCodesForm.controls.source_type.setValue("fees/charges");
  }
}
}

postingTypeValidation(): any{
  let currentPostingValue = this.chargeCodesForm.get('description').value;
 
 
  if(currentPostingValue === 'REPAYMENT' || currentPostingValue === 'DISBURSEMENT'){
  
    return false;


  }
  else{
    // this.chargeCodesForm.controls.source_type.setValue(null);
    return true;
  }

}

}