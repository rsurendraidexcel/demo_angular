import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Helper } from '@cyncCommon/utils/helper';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-client-assign-basic-parameter',
  templateUrl: './client-assign-basic-parameter.component.html',
  styleUrls: ['./client-assign-basic-parameter.component.scss']
})
export class ClientAssignBasicParameterComponent implements OnInit {

  
    @Output() formReady = new EventEmitter<FormGroup>();
    templateViewType: string;
    changedFormvalues: any = [];
    templateID: any;
    basicParameterId: any;
    mainBPform: FormGroup;
    partialDropdownData: any;
    baiscParameterDropDown: any;
    editClientTemplateBPData: any;
    initialValue: any;
    enabled: boolean;
    tabchangevalue: any;
    clientTemplateViewData: any;
    partialViewData: any;

  
    constructor(
      private helper_messege: Helper,
      private fb: FormBuilder,
      private clientTemplateDetails: ClientTemplatesService,
      private router: Router,
      private route: ActivatedRoute,
    ) {
  
      // // geting template id
      // this.route.params.subscribe(params => this.templateID = params.id);

      // geting template id
      this.route.params.subscribe(params => this.templateID = params.id);

      // geting basic parameter id
      this.clientTemplateDetails.getBasicParameterId().subscribe(data => {
        this.basicParameterId = data;
      })

      this.clientTemplateDetails.getLabelName().subscribe(data => {
        this.mainBPform.reset();
      })
  
      this.enabled = true;
  
    }
  
    ngOnInit() {
      this.clientTemplateDetails.getDropdownChangeData().subscribe(changedTemplateId => {
        if(changedTemplateId != "assigned")
        {
        this.getDefaultDropdownValues(changedTemplateId);
        } else {
          this.getDefaultDropdownValues(null);
        }
      });

      if(this.templateID != "assigned"){
        this.getTemplateViewDetails(this.templateID);
        
      }   
      if(this.templateID === "assigned"){
        this.getDefaultDropdownValues(null);
      }
      else{
        this.getDefaultDropdownValues(this.templateID);
      }

       // get confirm msg from parent to send data
       this.clientTemplateDetails.getConfirmMultiAsignDataFetch().subscribe(data => {
        if (data==="fetch") {
          this.clientTemplateDetails.setMultiClientBasicParameterData(this.mainBPform.value);
         this.postBPdata(this.mainBPform.value)
        }
       
      })

       // get confirm msg from parent to send data for blank template
       this.clientTemplateDetails.getMultiClientBasicParameterBlankData().subscribe(data => {
        if (data==="blank") {
          this.filterBlankPostData()
        }
       
      })

     
     

  
      this.mainBPform = this.fb.group({
      });
  
      this.formReady.emit(this.mainBPform);

    }

    	//Get client template parameter details //

	getTemplateViewDetails(id: any ) {
		this.clientTemplateViewData = this.clientTemplateDetails.gettemplateviewdetails('client_templates/' + id).subscribe(data => {
		  this.partialViewData = <any>JSON.parse(data._body);
		  this.clientTemplateViewData = this.partialViewData.data;
      // sharing all template data with child components
      this.basicParameterId = this.clientTemplateViewData.parameter.data.id
		  this.clientTemplateDetails.receiveTemplateData(this.clientTemplateViewData);
		})
	  }
  
    /**
     * initialied form 
     * @param name 
     * @param form 
     */
    formInitialized(name: string, form: FormGroup) {
      this.mainBPform.setControl(name, form);
      var main = this.mainBPform;
      this.initialValue = this.mainBPform;
      this.disableForm(main);
    }
  
    // basic parameter navigation tab function
    onClick(id: string) {
      let x = document.querySelector(id);
      if (x) {
        x.scrollIntoView();
      }
    }
  
    // basic parameter get all dropdown default values
    getDefaultDropdownValues(id: any) {
      var url_dropdown = "client_templates/" + id + "/get_basic_parameter_dropdowns";
      this.clientTemplateDetails.getAlldefaultdropDownValues(url_dropdown).subscribe(data => {
        this.baiscParameterDropDown = <any>JSON.parse(data._body);
        // this.baiscParameterDropDown = this.partialDropdownData.data;
        this.clientTemplateDetails.sendAllDropDownData(this.baiscParameterDropDown);
      });
    }
  
    // get template view type
    disableForm(form: any) {
  
      if (this.templateViewType == "view") {
        form.disable();
        $("#submitBasicParameter").prop('disabled', true);
        $("#resetBasicParameter").prop('disabled', true);
      }
  
    }
  
    // post basic parameter data
    postBPdata(response: any) {
  
      if(response.overAdvance.fund_send_by === "null"){
        response.overAdvance.fund_send_by = null;
      }

      // if(response.rollForwards.inventory_post_to_rollforward === "true"){
      //   response.rollForwards.inventory_post_to_rollforward = true;
      // }
      // else{
      //   response.rollForwards.inventory_post_to_rollforward = false;
      // }
  
      // if(response.rollForwards.rollforward_to_adjust_collateral === "true"){
      //   response.rollForwards.rollforward_to_adjust_collateral = true;
      // }
      // else{
      //   response.rollForwards.rollforward_to_adjust_collateral = false;
      // }
      
  
      // if(response.rollForwards.inventory_rollforward_collateral_value === "true"){
      //   response.rollForwards.inventory_rollforward_collateral_value = true;
      // }
      // else{
      //   response.rollForwards.inventory_rollforward_collateral_value = false;
      // }
  
      // this.getDirtyValues(this.mainBPform);
      // this.changedFormvalues.pop();
      // // if(this.changedFormvalues.includes('combine_summ_det_ar_yn')){
      // // }
      // let Output = {};
      // function jsonConcat(o1, o2) {
      //   for (var key in o2) {
      //     o1[key] = o2[key];
      //   }
      //   return o1;
      // }
  
      // for (var i = 0; i < this.changedFormvalues.length; i++) {
      //   Output = jsonConcat(Output, this.changedFormvalues[i]);
      // }
  
  
      // response body creation for post
      let postBody = {
        "parameter": {
          "concentration_report_threshold": response.bbcOthers.concentration_report_threshold,
          "invoice_max_amt": parseInt(response.bbcOthers.invoice_max_amt),
          "collateral_change_pct": response.bbcOthers.collateral_change_pct,
          "send_audit_letter_in_days": response.bbcOthers.send_audit_letter_in_days,
          "default_invoice_status": response.bbcOthers.default_invoice_status,
          "combine_summ_det_ar_yn": response.bbcOthers.combine_summ_det_ar_yn,
          "accept_duplicate": response.bbcOthers.accept_duplicate,
          "maintain_current_ar": response.bbcOthers.maintain_current_ar,
          "post_to_loan_activity": response.bbcOthers.post_to_loan_activity,
          "statement_balance_before_loan_balance": response.bbcOthers.statement_balance_before_loan_balance,
          "post_advance_to_loan_activity": response.bbcOthers.post_advance_to_loan_activity,
          "division_or_all_in_rollforward": response.rollForwards.division_or_all_in_rollforward,
          "post_to_rollforward": response.rollForwards.post_to_rollforward,
          "rollforward_to_adjust_collateral": response.rollForwards.rollforward_to_adjust_collateral,
          "inventory_post_to_rollforward": response.rollForwards.inventory_post_to_rollforward,
          "inventory_rollforward_collateral_value": response.rollForwards.inventory_rollforward_collateral_value,
          "auto_calculate_nolv": response.inventoryParameter.auto_calculate_nolv,
          "lesser_of_pct_cost_or_nolv": response.inventoryParameter.lesser_of_pct_cost_or_nolv,
          "min_liq_cost": parseInt(response.inventoryParameter.min_liq_cost),
          "percentage_of_var_liq_cost": response.inventoryParameter.percentage_of_var_liq_cost,
          "liq_cost": response.inventoryParameter.liq_cost,
          "percentage_of_nolv": response.inventoryParameter.percentage_of_nolv,
          "percentage_of_cost": response.inventoryParameter.percentage_of_cost,
          "ar_or_inventory": response.inventoryParameter.ar_or_inventory,
          "inventory_with_sublimit": response.inventoryParameter.inventory_with_sublimit,
          "reserve_before_sublimit":response.inventoryParameter.reserve_before_sublimit,
          "loan_amt_pct": response.inventoryParameter.loan_amt_pct,
          "concentration_pct": response.ineligibaleReason.concentration_pct,
          "concentration_on": response.ineligibaleReason.concentration_on,
          "concentration_denominator": response.ineligibaleReason.concentration_denominator,
          "conc_pct_type": response.ineligibaleReason.conc_pct_type,
          "is_manual_ineligible_amt_by_client": response.ineligibaleReason.is_manual_ineligible_amt_by_client,
          "ineligible_amt_base_on": response.ineligibaleReason.ineligible_amt_base_on,
          "inventory_ineligible_amt_base_on": response.ineligibaleReason.inventory_ineligible_amt_base_on,
          "other_ineligible_amt_base_on": response.ineligibaleReason.other_ineligible_amt_base_on,
          "cross_aging_pct": response.ineligibaleReason.cross_aging_pct,
          "cross_aging_by_project": response.ineligibaleReason.cross_aging_by_project,
          "pastdue_type": response.ineligibaleReason.pastdue_type,
          "crossage_formula": response.ineligibaleReason.crossage_formula,
          "ar_aging_days": response.ineligibaleReason.ar_aging_days,
          "allow_pastdue_over_balance": response.ineligibaleReason.allow_pastdue_over_balance,
          "ineligible_past_due_flag": response.ineligibaleReason.ineligible_past_due_flag,
          "include_credits_in_past_age_due" : response.ineligibaleReason.include_credits_in_past_age_due,
          "only_positive_past_due" : response.ineligibaleReason.only_positive_past_due,
          "ineligible_aged_credit_flag": response.ineligibaleReason.ineligible_aged_credit_flag,
          "aged_credit_ineligible": response.ineligibaleReason.aged_credit_ineligible,
          "aged_credit_by_balance" : response.ineligibaleReason.aged_credit_by_balance,
          "net_credit_ineligible": response.ineligibaleReason.net_credit_ineligible,
          "include_negative_balance_in_credits" : response.ineligibaleReason.include_negative_balance_in_credits,
          "include_negative_ineligibles": response.ineligibaleReason.include_negative_ineligibles,
          "calculate_aging": response.ineligibaleReason.calculate_aging,
          "invoice_agings_start_on": response.ineligibaleReason.invoice_agings_start_on,
          "invoice_age_start_on": response.ineligibaleReason.invoice_age_start_on,
          "aging_starts_from_inv_date": response.ineligibaleReason.aging_starts_from_inv_date,
          "age_by_due_dt": response.ineligibaleReason.age_by_due_dt,
          "aging_starts_after_invoice_or_due_date": response.ineligibaleReason.aging_starts_after_invoice_or_due_date,
          "eligible_period_term_days": response.ineligibaleReason.eligible_period_term_days,
          "current_bucket_is_0_or_less": response.ineligibaleReason.current_bucket_is_0_or_less,
          "over_invoice_days": response.ineligibaleReason.over_invoice_days,
          "ineligible_calculate_by": response.ineligibaleReason.ineligible_calculate_by,
          "clone_manual_ineligibles": response.ineligibaleReason.clone_manual_ineligibles,
          "ignore_negative_inventory_available": response.ineligibaleReason.ignore_negative_inventory_available,
          "ignore_negative_other_available": response.ineligibaleReason.ignore_negative_other_available,
          "ap_required_flag": response.ineligibaleReason.ap_required_flag,
          "ar_exclude_on": response.ineligibaleReason.ar_exclude_on,
          // "display_inventory_ineligibles": response.ineligibaleReason.display_inventory_ineligibles,
          "allow_over_advance": response.overAdvance.allow_over_advance,
          "over_advance_pct": response.overAdvance.over_advance_pct,
          "fund_send_by": response.overAdvance.fund_send_by
  
        }
      }
  
      this.clientTemplateDetails.setMultiClientBasicParameterData(postBody);

    }
  
    getDirtyValues(form: any) {
      let dirtyValues = {};
  
      Object.keys(form.controls)
        .forEach(key => {
          let currentControl = form.controls[key];
  
          if (currentControl.dirty) {
            if (currentControl.controls)
              dirtyValues[key] = this.getDirtyValues(currentControl);
            else
              dirtyValues[key] = currentControl.value;
          }
  
        });
      this.changedFormvalues.push(dirtyValues);
    }

    filterBlankPostData(){
      this.getDirtyValues(this.mainBPform)

      this.changedFormvalues.pop();
      // if(this.changedFormvalues.includes('combine_summ_det_ar_yn')){
      // }
      let Output = {};
      function jsonConcat(o1, o2) {
        for (var key in o2) {
          o1[key] = o2[key];
        }
        return o1;
      }
  
      for (var i = 0; i < this.changedFormvalues.length; i++) {
        Output = jsonConcat(Output, this.changedFormvalues[i]);
      }
      this.clientTemplateDetails.setMultiClientBasicParameterBlankDataForPost(Output);
    }
  
    // reset basic parameter form
    onClickResetBPform() {
  
      const popupParam = { 'title': 'Confirmation', message: "Please save changes, or do you want to reset it ?", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          this.mainBPform.reset();
          this.clientTemplateDetails.setResetButtonForBP("reset");
        } else {
          return false;
        }
      })
  
    }
  
    // main level tab change condition check
    tabChangeFunction() {
      // geting tab change value
      this.clientTemplateDetails.getTabChangeValue().subscribe(data => {
        if (data) {
  
          if (data == "basic_parameter") {
  
            if (this.mainBPform.dirty) {
              this.clientTemplateDetails.setreturnTabChangeAnswer("stop");
              const popupParam = { 'title': 'Confirmation', 'message': 'Please save changes, or do you want to reset it ?', 'msgType': 'warning' };
              this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
                if (result) {
  
                  this.clientTemplateDetails.setreturnTabChangeAnswer("proceed");
                  this.mainBPform.reset()
                  this.clientTemplateDetails.setResetButtonForBP("reset");
  
                } else {
  
                  return false
                }
              });
  
            }
            else {
              this.clientTemplateDetails.setreturnTabChangeAnswer("proceed");
            }
          }
        }
      })
    }
  }
  

