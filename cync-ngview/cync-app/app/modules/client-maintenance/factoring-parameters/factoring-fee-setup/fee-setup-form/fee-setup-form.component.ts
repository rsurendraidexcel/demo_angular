import { Component, OnInit, HostListener, Renderer2, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Helper } from "@cyncCommon/utils/helper";
import { APIMapper } from "@cyncCommon/utils/apimapper";
import { CyncConstants } from "@cyncCommon/utils/constants";
import { FactoringFeeSetupService } from "../service/factoring-fee-setup.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FactoringFeeSetup } from "../model/factoring-fee-setup";
import { MatDialog } from '@angular/material';
import { AddNewFeeComponent } from './sub-component/add-new-fee/add-new-fee.component';
import { ViewHistoryComponent } from './sub-component/view-history/view-history.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
declare var $: any;

@Component({
  selector: "app-fee-setup-form",
  templateUrl: "./fee-setup-form.component.html",
  styleUrls: ["./fee-setup-form.component.scss"],
})
export class FeeSetupFormComponent implements OnInit {
  factoringFeeSetupForm: FormGroup;
  feeSetup: any;
  feeCalculatedOn: any;
  editForm: boolean;
  feeSetupId: any;
  clientId: any;
  apires: any;
  feeCodes: any;
  borrowerId: any;
  feeCalculationMethodsOptions: any;
  showSpread: boolean;
  feeCalculationMethodValue: any;
  feeCalculatedonValue: any;
  feeNames:any;
  recourseFactor: boolean;
  parent:any;
  showEditButton: boolean;

  constructor(
    private fb: FormBuilder,
    private apiMapper: APIMapper,
    private helper: Helper,
    private feeSetupService: FactoringFeeSetupService,
    public dialog: MatDialog,
    private clientSelectSrv: ClientSelectionService,
    private route: ActivatedRoute,
    private renderer2: Renderer2, 
    private elementRef: ElementRef
    
  ) {
    this.borrowerId = CyncConstants.getSelectedClient();
    this.helper.getClientID().subscribe((d) => this.clientId = d);
  }

  ngOnInit() {
    this.createRollForwardLogsForm();
    this.helper.getClientID().subscribe((data) => {
      let cltid = data;
      if(cltid!=='null'){
        this.borrowerId = data;
        this.afterBorrowChangeLoad();
      }
    });
    if(this.borrowerId!==undefined){
       this.afterBorrowChangeLoad();
    }

    this.factoringFeeSetupForm.disable();
    this.factoringFeeSetupForm.get('fee_names').enable();

    this.feeSetupService.getFeeTierData1().subscribe((res) => {
      this.feeCodes = res;
    });

    this.feeSetupService.getFeeNames().subscribe(res =>{
      this.feeNames = res;
    });

  }
  
  ngAfterViewInit(){
    this.setScrollbar();
  }
  
  @HostListener('window:resize')
  setScrollbar(){
  const scrollElm =  document.querySelector("#innerScrollbar");
  const h = $(document).height() - 260;
  this.renderer2.setStyle(scrollElm,'height',h+'px');
  this.renderer2.setStyle(scrollElm,'margin-right','4px');
  this.renderer2.setStyle(scrollElm,'overflow-y','auto');
  }
 
  afterBorrowChangeLoad(){
     if(this.editForm===true){
      // this.onClientChangeAlert();
     } else{
      this.getFeeSetupData();
      this.getAllFeeNames();
      this.factoringFeeSetupForm.disable();
      this.factoringFeeSetupForm.get('fee_names').enable();
     }
  }

  createRollForwardLogsForm() {
    this.factoringFeeSetupForm = this.fb.group({
      fee_names: [],
      name: ["", Validators.required],
      fact_recourse_factoring: [],
      advance_rate: [],
      fact_recourse_days: ["", Validators.required],
      fee_calculated_on_options: [''],
      fee_calculation_methods_options: [],
      fact_recourse_fee_pct: [0, Validators.required],
      max_fee_percent: [0.0, Validators.required],
      min_fee_days: [""],
      min_per_invoice: [0.0],
      spread_percentage: [0, Validators.required],
      divisor: [0, Validators.required],
      active:[false]
    });
  }

  getFeeSetupData() {
    const url = this.apiMapper.endpoints[
      CyncConstants.FACTORING_FEE_SETUP_ID
    ].replace("{borrower_id}",this.borrowerId);
    let feeComponent = this;
    this.feeSetupService.getFeeSetupDataService(url).subscribe((response) => {
      let temapiRespose = <any>JSON.parse(response._body);

      if (temapiRespose.fee_setup.fee_calculation_method == null) {
        temapiRespose.fee_setup.fee_calculation_method = "per_day";
      }
      if (temapiRespose.fee_setup.fee_calculated_on == null) {
        temapiRespose.fee_setup.fee_calculated_on = "Face Value";
      }
      if (temapiRespose.fee_setup.fact_recourse_factoring == null) {
        temapiRespose.fee_setup.fee_calculation_method = false;
        feeComponent.recourseFactor = false;
      }
      feeComponent.feeSetupService.setMaximumFeeValue(
        Number(temapiRespose.fee_setup.max_fee_percent)
      );
      feeComponent.apires = temapiRespose;
      feeComponent.feeSetupId = feeComponent.apires.fee_setup.id;
     // this.feeSetupService.setFeeId(Number(this.feeSetupId));
     feeComponent.feeCalculationMethodValue = feeComponent.apires.fee_setup.fee_calculation_method;
     feeComponent.feeCalculatedonValue = this.apires.fee_setup.fee_calculated_on;
     feeComponent.recourseFactor = feeComponent.apires.fee_setup.fact_recourse_factoring;
      let elem = document.getElementById("hide-control");
      if (feeComponent.apires.fee_setup.fee_calculation_method === "tier_based") {
        elem.style.display = "block";
        feeComponent.showSpread = false;
      } else {
        elem.style.display = "none";
        feeComponent.showSpread = true;
        feeComponent.factoringFeeSetupForm.get("max_fee_percent").disable();
        feeComponent.factoringFeeSetupForm.get("min_fee_days").disable();
        feeComponent.factoringFeeSetupForm.get("min_per_invoice").disable();
      }
      feeComponent.feeSetupService.setFeeTierData(feeComponent.apires);

      feeComponent.patchRollForwartdLogData();
    });
  }

  /**
   * Patch rollforward log data
   */
  patchRollForwartdLogData() {
    let parameterDataList = this.apires.fee_setup;
    this.feeCalculatedOn = this.apires.fee_setup.fee_calculated_on_options;
    this.feeCalculationMethodsOptions = this.apires.fee_setup.fee_calculation_methods_options;
    this.showEditButton = this.apires.fee_setup.edit_permission;
    const parameterFormGroup = this.factoringFeeSetupForm;
    parameterFormGroup.patchValue(parameterDataList);
    parameterFormGroup.get('fee_calculation_methods_options').setValue(this.apires.fee_setup.fee_calculation_method);
    parameterFormGroup.get('fee_calculated_on_options').setValue(this.apires.fee_setup.fee_calculated_on);
    if(this.editForm  === true){
      this.onEditclick();
    }
  }
  onEditclick() {
    if (this.apires.fee_setup.editable === true) {
      this.editForm = true;
      this.helper.setEditForm(this.editForm);
      let recourseFact = this.apires.fee_setup.fact_recourse_factoring;
      this.feeSetupService.setEditValue(false);

      if (this.feeCalculationMethodValue === "per_day" && this.apires.fee_setup.parent===true) {

            this.factoringFeeSetupForm.get("max_fee_percent").disable();
            this.factoringFeeSetupForm.get("min_fee_days").disable();
            this.factoringFeeSetupForm.get("min_per_invoice").disable();

            if(this.apires.fee_setup.can_change_calculation_method == true)
            {
              this.factoringFeeSetupForm.get("fee_calculation_methods_options").enable();
              this.factoringFeeSetupForm.get("advance_rate").enable();
              this.factoringFeeSetupForm.get("divisor").enable();
              this.factoringFeeSetupForm.get("fee_calculated_on_options").enable();
              this.factoringFeeSetupForm.get("fact_recourse_factoring").enable();
              if (recourseFact === true) {
                this.factoringFeeSetupForm.get("fact_recourse_days").enable();
                this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
              }
              else{
                this.factoringFeeSetupForm.get("fact_recourse_days").disable();
                this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    
              }
            }else{
              this.factoringFeeSetupForm.get("fee_calculation_methods_options").disable();
              this.factoringFeeSetupForm.get("advance_rate").disable();
              this.factoringFeeSetupForm.get("divisor").disable();
              this.factoringFeeSetupForm.get("fact_recourse_factoring").disable();
              this.factoringFeeSetupForm.get("fact_recourse_days").disable();
              this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable(); 
              this.factoringFeeSetupForm.get("fee_calculated_on_options").disable();
            }

            this.factoringFeeSetupForm.get("spread_percentage").enable();
            this.factoringFeeSetupForm.get("active").enable();
            this.factoringFeeSetupForm.get("name").enable();
         

            // if (recourseFact === true) {
            //   this.factoringFeeSetupForm.get("fact_recourse_days").enable();
            //   this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
            // }
            // else{
            //   this.factoringFeeSetupForm.get("fact_recourse_days").disable();
            // this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    

            // }

      }

      if (this.feeCalculationMethodValue === "per_day" && this.apires.fee_setup.parent === false){

            this.factoringFeeSetupForm.get("max_fee_percent").disable();
            this.factoringFeeSetupForm.get("min_fee_days").disable();
            this.factoringFeeSetupForm.get("min_per_invoice").disable();
            this.factoringFeeSetupForm.get("fee_calculated_on_options").disable();

            // if(this.apires.fee_setup.can_change_calculation_method == true)
            // {
            //   this.factoringFeeSetupForm.get("fee_calculation_methods_options").enable();
            // }else{
            //   this.factoringFeeSetupForm.get("fee_calculation_methods_options").disable();
            // }
            this.factoringFeeSetupForm.get("fee_calculation_methods_options").disable();

            this.factoringFeeSetupForm.get("advance_rate").disable();
            this.factoringFeeSetupForm.get("divisor").disable();
            this.factoringFeeSetupForm.get("spread_percentage").enable();
            this.factoringFeeSetupForm.get("active").enable();
            this.factoringFeeSetupForm.get("name").enable();
            this.factoringFeeSetupForm.get("fact_recourse_factoring").disable();
            this.factoringFeeSetupForm.get("fact_recourse_days").disable();
            this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();  
            // if (recourseFact === true) {   
            //   this.factoringFeeSetupForm.get("fact_recourse_days").enable();
            //   this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
            // }
            // else{
            //   this.factoringFeeSetupForm.get("fact_recourse_days").disable();
            //   this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    

            // }

      }


      if (this.feeCalculationMethodValue === "tier_based") {

          if (recourseFact === true) {
            this.factoringFeeSetupForm.get("fact_recourse_days").enable();
            this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
          }
          else{
            this.factoringFeeSetupForm.get("fact_recourse_days").disable();
            this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    
          }
          if(this.apires.fee_setup.can_change_calculation_method == true)
          {
            this.factoringFeeSetupForm.get("fee_calculation_methods_options").enable();
          }else{
            this.factoringFeeSetupForm.get("fee_calculation_methods_options").disable();
          }
          this.commomControlValidations();
      }
     
    } else {
      this.helper.openAlertPoup(
        "",
        "Factoring Fee setup page canot be edited as there are open invoices associated with this fee set up"
      );
    }
  }

  commomControlValidations() {
    this.factoringFeeSetupForm.get("name").enable();
    this.factoringFeeSetupForm.get("max_fee_percent").enable();
    this.factoringFeeSetupForm.get("min_fee_days").enable();
    this.factoringFeeSetupForm.get("min_per_invoice").enable();
    this.factoringFeeSetupForm.get("fact_recourse_factoring").enable();
    this.factoringFeeSetupForm.get("advance_rate").enable();
   this.factoringFeeSetupForm.get("fee_calculated_on_options").enable();
  }

  onCancelclick() {
    const popupParams = { 'title': 'Confirmation', message: 'The edits will be discarded Do you wish to proceed? ' }
    this.helper.openConfirmPopup(popupParams).subscribe(result =>{
      if (result === true) {
        this.editForm = false;
        this.helper.setEditForm(this.editForm);
        this.getFeeSetupData();
        this.getAllFeeNames();
        this.factoringFeeSetupForm.disable();
        this.factoringFeeSetupForm.get('fee_names').enable();
        this.feeSetupService.setEditValue(true);
      }
    });
   
  }

  onSaveclick(model: any) {
    let requestBody = new FactoringFeeSetup();
    requestBody.fee_setup = model;
    requestBody.fee_setup.fee_calculated_on = this.factoringFeeSetupForm.get("fee_calculated_on_options" ).value;
    requestBody.fee_setup.fee_calculation_method = this.factoringFeeSetupForm.get("fee_calculation_methods_options").value;
        // this.feeSetupId = this.apires.fee_setup.id;
        if(requestBody.fee_setup.fee_calculation_method  === "tier_based"){
            requestBody.fee_setup.fee_codes_attributes = this.feeCodes;
        if ( (requestBody.fee_setup.fee_codes_attributes === undefined || requestBody.fee_setup.fee_codes_attributes.length === 0) ) {
          if (this.apires.fee_setup.fee_codes_attributes.length === 0) {
            this.helper.openAlertPoup( "", "Please add atleast one tier setup to proceed");
          } else {
            requestBody.fee_setup.fee_codes_attributes = this.apires.fee_setup.fee_codes_attributes;
           this.saveFeeSetupData(requestBody);
          }
        } else {
          this.saveFeeSetupData(requestBody);
        }
  }
     else {
          const popupParams = { 'title': 'Confirmation', message: 'Changes made will only affect future invoices assigned to this fee' }
          this.helper.saveFacoringFeeSetupPop(popupParams).subscribe(result =>{
            if (result === true) {
              requestBody.fee_setup.spread_percentage = requestBody.fee_setup.spread_percentage.toString();
            this.saveFeeSetupData(requestBody);
            }
          });
            }
          
       
  }
  
  saveFeeSetupData(requestBody:any){
    const url = this.apiMapper.endpoints[ CyncConstants.FACTORING_FFEE_SETUP_UPDATE_PARAMETERS].replace("{borrower_id}", this.borrowerId).replace("{fee_setupId}", this.feeSetupId);
    
    this.feeSetupService.updateFeeSetupDataService(url, requestBody).subscribe((response) => {
      const message = "factoring fee set up was successfully updated";
      this.helper.showApiMessages(message, "success");
      this.editForm = false;
      this.helper.setEditForm(this.editForm);
      this.factoringFeeSetupForm.disable();
      this.factoringFeeSetupForm.get('fee_names').enable();
      this.feeSetupService.setEditValue(true);
      if(this.apires.fee_setup.parent === true){
        this.afterBorrowChangeLoad();
      }else {
        this.getSelectedFeeNameData(Number(this.feeSetupId));
      }
    });
  }
  getSelectedFeeCalculationMethod(event: any) {
    let elem = document.getElementById("hide-control");
    if (event.target.value === "tier_based") {
      elem.style.display = "block";
      this.feeCalculationMethodValue = "tier_based";
      this.feeSetupService.setFeeCalculationMethod(false);
      this.showSpread = false;
      this.factoringFeeSetupForm.get("max_fee_percent").enable();
      this.factoringFeeSetupForm.get("min_fee_days").enable();
      this.factoringFeeSetupForm.get("min_per_invoice").enable();
      this.factoringFeeSetupForm.get("name").enable();
      this.factoringFeeSetupForm.get("advance_rate").setValue('0.0');
    } else if (event.target.value === "per_day") {
      elem.style.display = "none";
      this.feeCalculationMethodValue = "per_day";
      this.feeSetupService.setFeeCalculationMethod(true);
      this.showSpread = true;
      this.factoringFeeSetupForm.get("max_fee_percent").disable();
      this.factoringFeeSetupForm.get("min_fee_days").disable();
      this.factoringFeeSetupForm.get("min_per_invoice").disable();
      this.factoringFeeSetupForm.get("divisor").enable();
      this.factoringFeeSetupForm.get("spread_percentage").enable();

      this.factoringFeeSetupForm.get("advance_rate").setValue('100.0');
      this.factoringFeeSetupForm.get("divisor").setValue(360);
    }
  }
  changeValue(event) {
    let recourseFact = this.factoringFeeSetupForm.get("fact_recourse_factoring")
      .value;
    if (recourseFact === true) {
      this.recourseFactor = true;
      this.factoringFeeSetupForm.get("fact_recourse_days").enable();
      this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
    } else {
      this.recourseFactor = false;
      this.factoringFeeSetupForm.get("fact_recourse_days").setValue("");
      this.factoringFeeSetupForm.get("fact_recourse_fee_pct").setValue(0.0);
      this.factoringFeeSetupForm.get("fact_recourse_days").disable();
      this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();
    }
  }
  isFormValid() {
    if (this.feeCalculationMethodValue == "per_day") {
      if (this.factoringFeeSetupForm.valid) {
        return false;
      } else {
        return true;
      }
    }
    if (this.feeCalculationMethodValue == "tier_based") {
      if (this.recourseFactor == true) {
        if (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
          this.factoringFeeSetupForm.get("max_fee_percent").valid &&
          this.factoringFeeSetupForm.get("name").valid &&
          this.factoringFeeSetupForm.get("fact_recourse_fee_pct").valid &&
          this.factoringFeeSetupForm.get("fact_recourse_days").valid                                                  
        ) {
          return false;
        } else {                                                        
          return true;
        }
      } else {
        if (
          this.factoringFeeSetupForm.get("max_fee_percent").valid &&
          this.factoringFeeSetupForm.get("name").valid
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
  /** 
   * to restrict characters in numeric filed
   */
  onKeyPressEvent(event) {
    var e = window.event || event;
    var charCode = e.which || e.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 ||
        charCode > 57 ||
        charCode > 107 ||
        charCode > 219 ||
        charCode > 221) &&
      charCode != 40 &&
      charCode != 32 &&
      charCode != 41 &&
      (charCode < 43 || charCode <= 46 || charCode > 46)
    ) {
      if (window.event) {
        window.event.returnValue = false;
      } else {
        e.preventDefault();
      }
    }
    return true;
  }
  noZeroValueValidation(event, field: string) {
    console.log(event.target.value);
    if (
      event.target.value === "0" ||
      this.factoringFeeSetupForm.get(field).value === "0.0"
    ) {
      this.factoringFeeSetupForm.get(field).setValue("");
    }
  }
  maximumFeeValue(event, field: string) {
    if (
      event.target.value === "0" ||
      this.factoringFeeSetupForm.get(field).value === "0.0"
    ) {
      this.factoringFeeSetupForm.get(field).setValue("");
    } else {
      let maxfee = this.factoringFeeSetupForm.get("max_fee_percent").value;
      this.feeSetupService.setMaximumFeeValue(maxfee);
    }
  }

  openAddNewFeeDialog(id,name): void {
    const dialogRef = this.dialog.open(AddNewFeeComponent, {
     data: {feeCalculatedOnOptions: this.apires.fee_setup.fee_calculated_on_options,feeCalculatedMethodOptions:this.apires.fee_setup.fee_calculation_methods_options},
     width:'909px'
    });
  }
     
  getAllFeeNames(){
    const url = this.apiMapper.endpoints[
      CyncConstants.FEE_SETUP_FEE_NAMES
    ].replace("{borrower_id}", this.borrowerId);
    this.feeSetupService.getFeeSetupDataService(url).subscribe(response => {
      this.feeNames= <any>JSON.parse(response._body).fee_names
      this.parent = this.feeNames[0].id;
      this.factoringFeeSetupForm.get('fee_names').setValue(this.feeSetupId);
    });
  }
  getSelectedFeeNameData(event:any){
    if(typeof(event) === "number"){
      this.feeSetupId = event;
    }else{
      this.feeSetupId =  Number(event.target.value);
    }
    const url = this.apiMapper.endpoints[
      CyncConstants.GET_SELECTED_FEE_NAME_DATA
    ].replace("{borrower_Id}", this.borrowerId).replace("{fee_id}",  this.feeSetupId);
    let  feechangeChildComponent = this;
    this.feeSetupService.getSelectedFeeNameData(url).subscribe(response => {
       let temapiRespose  = <any>JSON.parse(response._body);
        if (temapiRespose.fee_setup.fee_calculation_method == null) {
          temapiRespose.fee_setup.fee_calculation_method = "per_day";
        }
        if (temapiRespose.fee_setup.fee_calculated_on == null) {
          temapiRespose.fee_setup.fee_calculated_on = "Face Value";
        }
        if (temapiRespose.fee_setup.fact_recourse_factoring == null) {
          temapiRespose.fee_setup.fee_calculation_method = false;
          feechangeChildComponent.recourseFactor = false;
        }
        feechangeChildComponent.apires = temapiRespose;

      let parameterDataList = feechangeChildComponent.apires.fee_setup;
      let recourseFact;

      if (feechangeChildComponent.apires.fee_setup.fact_recourse_factoring === null) {
        recourseFact = false;
      } else{
        recourseFact = feechangeChildComponent.apires.fee_setup.fact_recourse_factoring;
      }
      this.feeCalculationMethodsOptions = feechangeChildComponent.apires.fee_setup.fee_calculation_methods_options;
      this.feeCalculatedOn = feechangeChildComponent.apires.fee_setup.fee_calculated_on_options;
      const parameterFormGroup = this.factoringFeeSetupForm;

      parameterFormGroup.patchValue(parameterDataList);

      this.factoringFeeSetupForm.get('fee_calculation_methods_options').setValue('per_day');
      this.factoringFeeSetupForm.get('fee_calculated_on_options').setValue('Face Value');
      this.getAllFeeNames();

      if(feechangeChildComponent.apires.fee_setup.parent === true && this.editForm === true){
        this.factoringFeeSetupForm.get("max_fee_percent").disable();
        this.factoringFeeSetupForm.get("min_fee_days").disable();
        this.factoringFeeSetupForm.get("min_per_invoice").disable();

        if(feechangeChildComponent.apires.fee_setup.can_change_calculation_method == true)
        {
          this.factoringFeeSetupForm.get("fee_calculation_methods_options").enable();
          this.factoringFeeSetupForm.get("advance_rate").enable();
          this.factoringFeeSetupForm.get("divisor").enable();
          this.factoringFeeSetupForm.get("fact_recourse_factoring").enable();
          this.factoringFeeSetupForm.get("fee_calculated_on_options").enable();
          if (recourseFact === true) {
            this.factoringFeeSetupForm.get("fact_recourse_days").enable();
            this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
          }
          else{
            this.factoringFeeSetupForm.get("fact_recourse_days").disable();
            this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    
          }
          
        }else{
          this.factoringFeeSetupForm.get("fee_calculation_methods_options").disable();
          this.factoringFeeSetupForm.get("advance_rate").disable()
          this.factoringFeeSetupForm.get("divisor").disable;
          this.factoringFeeSetupForm.get("fact_recourse_factoring").disable();
          this.factoringFeeSetupForm.get("fact_recourse_days").disable();
          this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable(); 
          this.factoringFeeSetupForm.get("fee_calculated_on_options").disable();
        }
     
        this.factoringFeeSetupForm.get("spread_percentage").enable();
     
        if (recourseFact === true) {
          this.factoringFeeSetupForm.get("fact_recourse_days").enable();
          this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
        }
        else{
          this.factoringFeeSetupForm.get("fact_recourse_days").disable();
          this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    
        }

      }

      if (feechangeChildComponent.apires.fee_setup.parent === false && this.editForm === true){
        this.factoringFeeSetupForm.get("max_fee_percent").disable();
        this.factoringFeeSetupForm.get("min_fee_days").disable();
        this.factoringFeeSetupForm.get("min_per_invoice").disable();
        this.factoringFeeSetupForm.get("fee_calculated_on_options").disable();
        this.factoringFeeSetupForm.get("fee_calculation_methods_options").disable();
        this.factoringFeeSetupForm.get("advance_rate").disable();
        this.factoringFeeSetupForm.get("divisor").disable();
        this.factoringFeeSetupForm.get("spread_percentage").enable();
        this.factoringFeeSetupForm.get("active").enable();
        this.factoringFeeSetupForm.get("fee_names").enable();
        this.factoringFeeSetupForm.get("fact_recourse_factoring").disable();
        this.factoringFeeSetupForm.get("fact_recourse_days").disable();
        this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    
       

        // if (recourseFact === true) {
        //   this.factoringFeeSetupForm.get("fact_recourse_days").enable();
        //   this.factoringFeeSetupForm.get("fact_recourse_fee_pct").enable();
        // }
        // else{
        //   this.factoringFeeSetupForm.get("fact_recourse_days").disable();
        //   this.factoringFeeSetupForm.get("fact_recourse_fee_pct").disable();    
        // }
     }
    });
  }
  openViewHistoryDialog(): void {
    let feeId = Number(this.feeSetupId);
    const dialogRef = this.dialog.open(ViewHistoryComponent, {
     width:'999px',
     data: {title: "History Page", feeID: feeId }
    });
  }
  
  addnewAction(): boolean {
    let activeButton = true;
    if(this.apires !== undefined){
    if(this.apires.fee_setup.fee_calculation_method ==='tier_based'){
      activeButton = false;
    }
    else if(this.apires.fee_setup.fee_calculation_method ==='per_day'){
      if(this.apires.fee_setup.spread_percentage=="0.0" &&  this.apires.fee_setup.divisor==null){
        activeButton = false;
      } else{
        activeButton = true;
      }
    }
    if( this.editForm == true){
      activeButton = false;
    }
    return activeButton;
  }
  }
}
