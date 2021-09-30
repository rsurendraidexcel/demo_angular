import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Location } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
//import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { Observable } from 'rxjs/Observable';
import { BasicParameterService } from './service/basic-parameter.service'


@Component({
  selector: 'app-basic-parameters',
  templateUrl: './basic-parameters.component.html',
  styleUrls: ['./basic-parameters.component.css']
})

/**
 * @author Ranveer
 * Basic Parameter for BBC
 */
export class BasicParametersComponent implements OnInit {
  basicParamForm: FormGroup;
  isEditIconEnabled: boolean;
  isDisable: boolean;
  showSpinner: boolean

  constructor(
    private _location: Location,
    private _basicParamService: BasicParameterService,
    private fb: FormBuilder,
    private _helper: Helper

  ) { }


  /**
   * Init for component
   */
  ngOnInit() {
    this._helper.adjustUI();
    this.initFormValidator();
    this.getBorrowerDetails();
    this.getBBCOptionDetails();
    this.getBorrowerBasicParameters();
    this.getAsyncDropdown();

    // var appbody_cont = window.innerHeight;
    //   $(window).resize(function () {
    //     appbody_cont = window.innerHeight;
    //     if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
    //     if (document.getElementById("main_contents")) {
    //       if (document.getElementById('app-body-container').classList.contains("has-submenu")) {
    //         document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 49 - 54) + 'px';
    //       }

    //       else {
    //         document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 54) + 'px';
    //       }

    //   }

    //   if (document.getElementById("dialog")) { document.getElementById('dialog').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
    // })

  }

  /**
   * This method will register all needed BBC Options api response key as 
   * form the controls. 
   * @see http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/client-maintenance.html#borrowers__id__get
   */
  initBorrowerAPIResponseFormControls() {
    return this.fb.group({
      bbc_frequency: new FormControl(null, ),//BBC Frequency
      bbc_frequency_date: new FormControl(null, ),//Starting BBC Date
      bbc_period: new FormControl(null, ),//Period
      bbc_day: new FormControl(null, )//Day
    });
  }

  /**
   * 
   */
  initAsynchronousFromControls() {
    return this.fb.group({
      mydropdown: new Array()
    });
  }

  /**
   * This method will register all needed BBC Options api response key as 
   * form the controls. 
   * @see http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/client-maintenance.html#borrowers_summary_borrower_bbc_options_get
   */
  initBBCOptionsFormControls() {
    return this.fb.group({
      rollfwd: new FormControl(null, ),//Rollforward  
      ineligible: new FormControl(null, ),  //Ineligible
      inventory: new FormControl(null, ),  //Inventory
      other_collateral: new FormControl(null, ),  //Other Collateral
      reserves: new FormControl(null, )  //Reserves
    });
  }

  /**
   * This method will register all needed parameter api response key as 
   * form the controls. 
   * @see http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/client-maintenance.html#borrowers__id__parameter_get 
   */
  initParametersAPIResponseFormControls() {
    return this.fb.group({
      concentration_report_threshold: new FormControl(null, ),//Concentration Report Thresold %
      invoice_max_amt: new FormControl(null, ),//Maximum Invoice Amount
      collateral_change_pct: new FormControl(null, ),//Collateral Change %
      send_audit_letter_in_days: new FormControl(null, ),//Audit Letter Days
      default_invoice_status: new FormControl(null, ),//Default Invoice Status
      accept_duplicate: new FormControl(null, ),//Accept Duplicate
      combine_summ_det_ar_yn: new FormControl(null, ),//Processing Summary Aging
      maintain_current_ar: new FormControl(null, ),//Maintain Current AR
      add_cash_from_batch_to_rollforward: new FormControl(null, ),//Post Cash To Rollforward  
      division_or_all_in_rollforward: new FormControl(null, ),//To All , To Division
      allow_over_advance: new FormControl(null, ),//Allow Over Advance  
      over_advance_pct: new FormControl(null, Validators.compose([Validators.required])),//Max Over Advance %
      fund_send_by: new FormControl(null, ),//Fund Send By
      receivable_sublimit: new FormControl(null, ),//AR Sublimit Cap
      receivable_sublimit_based_on: new FormControl(null, ),//Based On
      receivable_sublimit_calculated_cap_by: new FormControl(null, ),//Calculated Cap By
      receivable_sublimit_max_cap_pct: new FormControl(null, ),//Max Cap %
      inventory_sublimit: new FormControl(null, ),//Inventory Sublimit Cap
      inventory_sublimit_based_on: new FormControl(null, ),//Based On
      inventory_sublimit_calculated_cap_by: new FormControl(null, ),//Calculated Cap By
      inventory_sublimit_max_cap_pct: new FormControl(null, ),//Max Cap %
      other_sublimit: new FormControl(null, ),//Other Sublimit Cap
      other_collateral_based_on: new FormControl(null, ),//Based On
      other_collateral_calculated_cap_by: new FormControl(null, ),//Calculated Cap By
      other_collateral_max_cap_pct: new FormControl(null, ),//Max Cap %
      auto_calculate_nolv: new FormControl(null, ),//Auto Calculate NOLV  
      lesser_of_pct_cost_or_nolv: new FormControl(null, ),//Lesser Of % Cost/NOLV
      min_liq_cost: new FormControl(null, ),//Min. Liq. Cost
      percentage_of_var_liq_cost: new FormControl(null, ),//Variable % For Min Liq Cost
      liq_cost: new FormControl(null, ),//Liq. Cost %
      percentage_of_nolv: new FormControl(null, ),//% Of NOLV
      percentage_of_cost: new FormControl(null, ),//% of Cost
      ar_reliance_pct: new FormControl(null, ),//Inventory AR Reliance %
      ar_reliance_based_on: new FormControl(null, ),//Based On
      ar_reliance_calcaulated_cap_by: new FormControl(null, ),//Calculated Cap By
      ar_reliance_max_cap_pct: new FormControl(null, ),//Max Cap %
      ar_or_inventory: new FormControl(null, ),//Advance On AR Vs Inventory
      inventory_with_sublimit: new FormControl(null, ),//Inventory Reserve Before Cap
      loan_amt_pct: new FormControl(null, ),//Inventory Loan Balance %
      concentration_pct: new FormControl(null, ),//Concentration %  
      conc_pct_type: new FormControl(null, ),//Concentration % Type
      cross_aging_pct: new FormControl(null, ),//Concentration %
      cross_aging_by_project: new FormControl(null, ),//Cross Age By Project 
      consider_past_due_for_cross_age: new FormControl(null, ),//Consider Past Due 
      cross_age_past_due_days: new FormControl(null, ),//Past Due Days
      cross_age_past_due_pct: new FormControl(null, ),//Past Due %
      ar_aging_days: new FormControl(null, ),//Past Due AR Days
      ineligible_past_due_flag: new FormControl(null, ),//Past Due Amount
      ineligible_aged_credit_flag: new FormControl(null, ),//Age Credit Amount
      age_credit_ineligible: new FormControl(null, ),//Age Credit Ineligible
      include_negative_ineligibles: new FormControl(null, ),//Include Negative Ineligibles In Total 
      aging_starts_from_inv_date: new FormControl(null, ),//Aging Starts From Inv Date 
      age_by_due_dt: new FormControl(null, ),//Aging By Due Date
      current_bucket_is_0_or_less: new FormControl(null, ),//Current Bucket Is 0 Or Less 
      over_invoice_days: new FormControl(null, ),//Payment Term Overdays
      ineligible_calculate_by: new FormControl(null, ),//Ineligible Calculation At 
      ignore_negative_inventory_available: new FormControl(null, ),//Ignore Negative Availability 
      display_inventory_ineligibles: new FormControl(null, ),//Display Inventory Ineligibles
    });
  }

  /**
  * initializing form validator
  */
  initFormValidator() {
    this.basicParamForm = this.fb.group({
      borrowerDetails: this.initBorrowerAPIResponseFormControls(),
      bbcOptions: this.initBBCOptionsFormControls(),
      borrowerBasicParameters: this.initParametersAPIResponseFormControls(),
      asynchronousFormControls: this.initAsynchronousFromControls()
    });
  }

  /** */
  getBorrowerDetails() {//need to remove this later the hard coded value
    this._basicParamService.getBorrowerDetails('37').subscribe(apiResponse => {
      this.basicParamForm.controls['borrowerDetails'].patchValue(apiResponse.borrower);
    })
  }

  /** */
  getBBCOptionDetails() {
    this._basicParamService.getBBCOptionDetails('37').subscribe(apiResponse => {
      this.basicParamForm.controls['bbcOptions'].patchValue(apiResponse);
    });
  }

  /** */
  getBorrowerBasicParameters() {
    this._basicParamService.getBorrowerBasicParameters('37').subscribe(apiResponse => {
      this.basicParamForm.controls['borrowerBasicParameters'].patchValue(apiResponse.parameter);
    })
  }

  /**
   * 
   * @param nestedFormName 
   * @param key 
   */
  getFormControlModel(nestedFormName: string, key: string) {
    return this.basicParamForm.get(nestedFormName)['controls'].key;
  }

  /**
   * 
   * @param field 
   */
  getFormControl(field: string) {
    return this.basicParamForm.get(field);
  }

  /**
   * This method will get the select dropdowns need in html page asynchronously 
   */
  getAsyncDropdown() {
    this._basicParamService.getBBCFrequencyDropDown().subscribe(dropDowns => {
      this.basicParamForm.get('asynchronousFormControls.mydropdown').setValue(dropDowns);
    });

    //  below code is to simulate situation like api response takes 2 seconds
    // setTimeout(() => {
    //   this._basicParamService.getBBCFrequencyDropDown().subscribe(dropDowns => {
    //     this.basicParamForm.get('asynchronousFormControls.mydropdown').setValue(dropDowns);
    //   });
    // }, 2000)

  }


  /** */
  navigateToHomeCancel() {
    this._location.back();
  }

  /** */
  saveDetails(formData: any) {
    this.showSpinner = true;
    console.log(formData);
    const popupParam = { 'title': 'Confirmation', 'message': 'what you want to do ?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      this.showSpinner = false;      
      if (result) {
        console.log('user has clicked on yes');
        //this._helper.openFileUploadSuccessPopup(popupParam);
      } else {
        console.log('user has clicked on cancel');
      }
    });
  }

  /**
   * @param field
   */
  displayFieldCss(field: string) {
    return this._helper.getFieldCss(field, this.basicParamForm)
  }

  /**
   * 
   * @param id 
   */
  onClick(id: string) {
    let x = document.querySelector(id);
    if (x) {
      x.scrollIntoView();
    }
  }
}