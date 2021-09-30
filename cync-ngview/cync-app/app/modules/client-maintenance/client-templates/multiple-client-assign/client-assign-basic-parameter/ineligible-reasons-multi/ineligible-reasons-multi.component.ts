import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MultiCrossAgeBucketsGridComponent } from './multi-cross-age-buckets-grid/multi-cross-age-buckets-grid.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../../service/client-templates.service';

@Component({
  selector: 'app-ineligible-reasons-multi',
  templateUrl: './ineligible-reasons-multi.component.html',
  styleUrls: ['./ineligible-reasons-multi.component.scss']
})
export class IneligibleReasonsMultiComponent implements OnInit {
  allDropDownData: any
  ineligibleReasonForm: FormGroup;
  allClientTemplateData: any;
  ineligibleReasonData: any;
  basicParameterId:any;
  templateViewType:any;
  manualHidden: boolean;
  termdayHidden: boolean;

  @Output() formReady = new EventEmitter<FormGroup>();

  constructor(public dialog: MatDialog, private fb: FormBuilder, private clientTemplateDetails: ClientTemplatesService) {
    // geting basic parameter id
    this.clientTemplateDetails.getBasicParameterId().subscribe(data => {
      this.basicParameterId = data;
      
    })

      // geting view type of template
      this.clientTemplateDetails.getTemplateViewType().subscribe(data => {
        if (data) {
          this.templateViewType = data;
        }
      })

      this.clientTemplateDetails.getLabelNameValue().subscribe(data => {
        if(data === "Blank Template")
        {
          $('#calculatedOn').hide(); 
          $('#crossAgeBucket').hide();  
        }
        else {
          $('#calculatedOn').show(); 
          $('#crossAgeBucket').show();  
        }
      }) 
  }

  ngOnInit() {
    this.dropdownPopulation();
    this.formFunction();
    this.getAllParameterData()

    this.formReady.emit(this.ineligibleReasonForm);

    // reseting the form
    this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
      if (data == "reset") {
        this.patchValues(this.ineligibleReasonData)
      }
    })

    
    // hiding or displaying Consider Cross Age Buckets

    // if(this.ineligibleReasonForm.get['pastdue_type'].value == "I"){
      
    //   $('#crossAgeBucket').hide()
    // }
    // else{
    //   $('#crossAgeBucket').show()
    // }

        // get confirm msg from parent to send data for blank template
        this.clientTemplateDetails.getMultiClientBasicParameterBlankData().subscribe(data => {
          if (data==="blank") {
            $('#calculatedOn').hide(); 
            $('#crossAgeBucket').hide();          
          }         
        })
  }

  //form initilize function
  formFunction() {
    this.ineligibleReasonForm = this.fb.group({
      concentration_pct: null,
      concentration_on: null,
      concentration_denominator: null,
      conc_pct_type: null,
      is_manual_ineligible_amt_by_client: null,
      ineligible_amt_base_on: null,
      inventory_ineligible_amt_base_on: null,
      other_ineligible_amt_base_on: null,
      cross_aging_pct: null,
      cross_aging_by_project: null,
      pastdue_type: null,
      crossage_formula: null,
      ar_aging_days: null,
      allow_pastdue_over_balance: null,
      ineligible_past_due_flag: null,
      ineligible_aged_credit_flag: null,
      include_credits_in_past_age_due:null,
      only_positive_past_due:null,
      aged_credit_ineligible: null,
      aged_credit_by_balance:null,
      net_credit_ineligible:null,
      include_negative_balance_in_credits:null,
      include_negative_ineligibles: null,
      calculate_aging: null,
      invoice_agings_start_on: null,
      aging_starts_from_inv_date: null,
      age_by_due_dt: null,
      aging_starts_after_invoice_or_due_date: null,
      eligible_period_term_days: null,
      current_bucket_is_0_or_less: null,
      over_invoice_days: null,
      ineligible_calculate_by: null,
      clone_manual_ineligibles: null,
      ignore_negative_inventory_available: null,
      ignore_negative_other_available: null,
      ap_required_flag: null,
      ar_exclude_on: null,
      // display_inventory_ineligibles: null,

    });


    this.ineligibleReasonForm.controls['ar_exclude_on'].setValue('null')
  }

  //populate all dropdown

  dropdownPopulation() {
    this.clientTemplateDetails.shareDropDownDataFn().subscribe(data => {
      this.allDropDownData = data


    })
  }

  // fetch all data from service
  getAllParameterData() {
    this.clientTemplateDetails.sendAllTemplateData().subscribe(data => {
      this.allClientTemplateData = data
      this.ineligibleReasonData = this.allClientTemplateData.parameter.data.ineligible_reasons

      this.patchValues(this.ineligibleReasonData)
    })

  }

  openConsiderCrossAgeBucketsDialog() {
    const dialogRef = this.dialog.open(MultiCrossAgeBucketsGridComponent, {
      disableClose: true,
      width: '850px',
     // height: '400px',
      data: {data: this.basicParameterId}
    });
  }
  startinvoiceaging(val){

      if (val == "Due Date" || val == "After Due Date") {
       
        this.termdayHidden = false
      }
      else {
        this.termdayHidden = true
      }
    
}

  // invoce aging start on change function 
  invoiceagingstart(event) {

    if (event.target.value == "Invoice Date") {
      this.ineligibleReasonForm.controls['aging_starts_from_inv_date'].setValue(true)
    }
    else {
      this.ineligibleReasonForm.controls['aging_starts_from_inv_date'].setValue(false)
    }

    // if due date

    if (event.target.value == "Due Date") {
      this.ineligibleReasonForm.controls['age_by_due_dt'].setValue(true)
    }
    else {
      this.ineligibleReasonForm.controls['age_by_due_dt'].setValue(false)
    }

    // for after condition

    if (event.target.value == "After Invoice Date" || event.target.value == "After Due Date") {
      this.ineligibleReasonForm.controls['aging_starts_after_invoice_or_due_date'].setValue(true)
    }
    else {
      this.ineligibleReasonForm.controls['aging_starts_after_invoice_or_due_date'].setValue(false)
    }

    // for enabling term loan

    if (event.target.value == "Due Date" || event.target.value == "After Due Date") {
  
      this.termdayHidden = false
    }
    else {
      this.termdayHidden = true
    }
  }

  /**************** all select onchange functions *************/

  mannualyclientineligbl(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['is_manual_ineligible_amt_by_client'].setValue(true);
      this.manualHidden = false;
    }
    else {
      this.ineligibleReasonForm.controls['is_manual_ineligible_amt_by_client'].setValue(false);
      this.manualHidden = true;
    }
  }

  initialMannualclientineligbl(val){
    if (val == true) {
      this.manualHidden = false;
    }
    else if(val == false) {
      this.manualHidden = true;
    }
  }

  crossagebyprojct(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['cross_aging_by_project'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['cross_aging_by_project'].setValue(false);
    }
  }
  allowpastdue(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['allow_pastdue_over_balance'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['allow_pastdue_over_balance'].setValue(false);
    }
  }
  includenegetive(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['include_negative_ineligibles'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['include_negative_ineligibles'].setValue(false);
    }
  }
  calcaging(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['calculate_aging'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['calculate_aging'].setValue(false);
    }
  }

  movefurther(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['current_bucket_is_0_or_less'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['current_bucket_is_0_or_less'].setValue(false);
    }
  }
  aprequired(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['ap_required_flag'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['ap_required_flag'].setValue(false);
    }
  }
  displayinventory(event) {
    if (event.target.value == "true") {
      this.ineligibleReasonForm.controls['display_inventory_ineligibles'].setValue(true);
    }
    else {
      this.ineligibleReasonForm.controls['display_inventory_ineligibles'].setValue(false);
    }
  }

  calculatedon(event){
    if(event.target.value == "I"){
      $('#crossAgeBucket').hide()
    }
    else if(event.target.value == "A"){
      $('#crossAgeBucket').show()
    }
  }
  // past due amount change function
  pastDueAmountChangeFn(event){
    
    if(event.target.value == "default"){
      this.ineligibleReasonForm.controls['include_credits_in_past_age_due'].setValue(false);
      this.ineligibleReasonForm.controls['only_positive_past_due'].setValue(false);
    }
    else if(event.target.value == "include credits"){
      this.ineligibleReasonForm.controls['include_credits_in_past_age_due'].setValue(true);
      this.ineligibleReasonForm.controls['only_positive_past_due'].setValue(false);
    }
    else if(event.target.value == "only positive"){
      this.ineligibleReasonForm.controls['include_credits_in_past_age_due'].setValue(true);
      this.ineligibleReasonForm.controls['only_positive_past_due'].setValue(true);
    }
  }

  // Age credit amout change function
  ageCreditAmountFn(event){
   
    if(event.target.value == "default"){
      this.ineligibleReasonForm.controls['aged_credit_by_balance'].setValue(false);
      this.ineligibleReasonForm.controls['net_credit_ineligible'].setValue(false);
      this.ineligibleReasonForm.controls['include_negative_balance_in_credits'].setValue(false);
    }
    else if(event.target.value == "net credit alone"){
      this.ineligibleReasonForm.controls['aged_credit_by_balance'].setValue(false);
      this.ineligibleReasonForm.controls['net_credit_ineligible'].setValue(true);
      this.ineligibleReasonForm.controls['include_negative_balance_in_credits'].setValue(false);

    }
    else if(event.target.value == "by balance"){
      this.ineligibleReasonForm.controls['aged_credit_by_balance'].setValue(true);
      this.ineligibleReasonForm.controls['net_credit_ineligible'].setValue(false);
      this.ineligibleReasonForm.controls['include_negative_balance_in_credits'].setValue(false);

    }
    else if(event.target.value == "net credit with age credit"){
      this.ineligibleReasonForm.controls['aged_credit_by_balance'].setValue(false);
      this.ineligibleReasonForm.controls['net_credit_ineligible'].setValue(true);
      this.ineligibleReasonForm.controls['include_negative_balance_in_credits'].setValue(true);

    }
  }

  /****************/

  // binding data to Form
  patchValues(data) {

    if(data.past_due_and_aged_credits.ineligible_past_due_flag === null){
      data.past_due_and_aged_credits.ineligible_past_due_flag = "default"
    }
    if(data.concentarion.ineligible_amt_base_on === null){
      data.concentarion.ineligible_amt_base_on = ""
    }

    if(data.concentarion.other_ineligible_amt_base_on === null){
      data.concentarion.other_ineligible_amt_base_on = ""
    }

    if(data.concentarion.inventory_ineligible_amt_base_on === null){
      data.concentarion.inventory_ineligible_amt_base_on = ""
    }

    this.ineligibleReasonForm.patchValue({

      concentration_pct: data.concentarion.concentration_pct,
      concentration_on: data.concentarion.concentration_on,
      concentration_denominator: data.concentarion.concentration_denominator,
      conc_pct_type: data.concentarion.conc_pct_type,
      is_manual_ineligible_amt_by_client: data.concentarion.is_manual_ineligible_amt_by_client,
      ineligible_amt_base_on: data.concentarion.ineligible_amt_base_on,
      inventory_ineligible_amt_base_on: data.concentarion.inventory_ineligible_amt_base_on,
      other_ineligible_amt_base_on: data.concentarion.other_ineligible_amt_base_on,
      cross_aging_pct: data.cross_aging.cross_aging_pct,
      cross_aging_by_project: data.cross_aging.cross_aging_by_project,
      pastdue_type: data.cross_aging.pastdue_type,
      crossage_formula: data.cross_aging.crossage_formula,
      ar_aging_days: data.past_due_and_aged_credits.ar_aging_days,
      allow_pastdue_over_balance: data.past_due_and_aged_credits.allow_pastdue_over_balance,
      ineligible_past_due_flag: data.past_due_and_aged_credits.ineligible_past_due_flag,
      ineligible_aged_credit_flag: data.past_due_and_aged_credits.ineligible_aged_credit_flag,
      aged_credit_ineligible: data.past_due_and_aged_credits.aged_credit_ineligible,
      include_negative_ineligibles: data.other_ineligible_parameters.include_negative_ineligibles,
      calculate_aging: data.other_ineligible_parameters.calculate_aging,
      invoice_agings_start_on: data.other_ineligible_parameters.invoice_agings_start_on,
      eligible_period_term_days: data.other_ineligible_parameters.eligible_period_term_days,
      aging_starts_from_inv_date: data.other_ineligible_parameters.aging_starts_from_inv_date,
      current_bucket_is_0_or_less: data.other_ineligible_parameters.current_bucket_is_0_or_less,
      over_invoice_days: data.other_ineligible_parameters.over_invoice_days,
      ineligible_calculate_by: data.other_ineligible_parameters.ineligible_calculate_by,
      clone_manual_ineligibles: data.other_ineligible_parameters.clone_manual_ineligibles,
      ignore_negative_inventory_available: data.exclude_parameters.ignore_negative_inventory_available,
      ignore_negative_other_available: data.exclude_parameters.ignore_negative_other_available,
      ap_required_flag: data.exclude_parameters.ap_required_flag,
      ar_exclude_on: data.exclude_parameters.ar_exclude_on,
      aged_credit_by_balance: data.past_due_and_aged_credits.aged_credit_by_balance,
      net_credit_ineligible: data.past_due_and_aged_credits.net_credit_ineligible,
      include_negative_balance_in_credits: data.past_due_and_aged_credits.include_negative_balance_in_credits,
      include_credits_in_past_age_due: data.past_due_and_aged_credits.include_credits_in_past_age_due,
      only_positive_past_due: data.past_due_and_aged_credits.only_positive_past_due
      // display_inventory_ineligibles: data.inventory_ineligible_parameters.display_inventory_ineligibles,
    })

    this.crossagelinkenableordisable(data.cross_aging.pastdue_type);
    this.startinvoiceaging(data.other_ineligible_parameters.invoice_agings_start_on);
    this.initialMannualclientineligbl(data.concentarion.is_manual_ineligible_amt_by_client);
  }

  // onstart link show or hide
  crossagelinkenableordisable(val){
    if(val == "I" && this.templateViewType!="view" ){
      $('#crossAgeBucket').hide()
    }
    else if(val == "A" && this.templateViewType!="view" ){
      $('#crossAgeBucket').show()
    }
  }
}
