import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-bbc-others',
  templateUrl: './bbc-others.component.html',
  styleUrls: ['./bbc-others.component.scss']
})
export class BBCOthersComponent implements OnInit {
  bbcOthers: FormGroup;
  allDropDownData: any;
  allClientTemplateData: any
  bbcOthersData: any;
  isProcessDisable: any;
  isMaintainArDisable: any;
  templateViewType:any;
  @Output() formReady = new EventEmitter<FormGroup>();
  constructor(private fb: FormBuilder, private clientTemplateDetails: ClientTemplatesService) {

    this.dropdownPopulation()
          // geting view type of template
          this.clientTemplateDetails.getTemplateViewType().subscribe(data => {
            if (data) {
              this.templateViewType = data;
            }
          })
  }

  ngOnInit() {
    this.formFunction()

    this.formReady.emit(this.bbcOthers);
    this.getAllParameterData()

    // reseting the form
    this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
      if (data == "reset") {
        this.patchValues(this.bbcOthersData)
      }
    })
  }

  //form initilize function
  formFunction() {
    this.bbcOthers = this.fb.group({
      concentration_report_threshold: null,
      invoice_max_amt: null,
      collateral_change_pct: null,
      send_audit_letter_in_days: null,
      default_invoice_status: null,
      combine_summ_det_ar_yn: null,
      accept_duplicate: null,
      maintain_current_ar: null,
      post_to_loan_activity: null,
      statement_balance_before_loan_balance: null,
      post_advance_to_loan_activity: null

    });
  }
  // get all default dropdown values from service
  dropdownPopulation() {
    this.clientTemplateDetails.shareDropDownDataFn().subscribe(data => {
      this.allDropDownData = data

    })
  }

  // fetch all data from service
  getAllParameterData() {
    this.clientTemplateDetails.sendAllTemplateData().subscribe(data => {
      this.allClientTemplateData = data
      this.bbcOthersData = this.allClientTemplateData.parameter.data.bbc_others
      this.patchValues(this.bbcOthersData)
    })

  }

  startprocessType(val){
  
    if (val == true) {
     this.isMaintainArDisable = true;
    }
    else {
      this.isMaintainArDisable = null;
    }

    if(this.templateViewType == "view"){
      this.isMaintainArDisable = true;
    }
  }

  startmaintainCurrent(val){
  
    if (val == true) {
      this.isProcessDisable = true;
     }
     else {
       this.isProcessDisable = null;
     }

     if(this.templateViewType == "view"){
      this.isProcessDisable = true;
    }
  }

  // process type on change function 
  processType(event) {

    if (event.target.checked == true) {
     this.isMaintainArDisable = true;
    }
    else {
      this.isMaintainArDisable = null;
    }
  }

  // maintain current AR function

  maintainCurrent(event){

    if (event.target.checked == true) {
      this.isProcessDisable = true;
     }
     else {
       this.isProcessDisable = null;
     }
  }

  // binding data to bbc others Form
  patchValues(data) {

    if(data.default_invoice_status === null){
      data.default_invoice_status = "W"
    }

    this.bbcOthers.patchValue({
      concentration_report_threshold: data.concentration_report_threshold,
      invoice_max_amt: data.invoice_max_amt,
      collateral_change_pct: data.collateral_change_pct,
      send_audit_letter_in_days: data.send_audit_letter_in_days,
      default_invoice_status: data.default_invoice_status,
      combine_summ_det_ar_yn: data.combine_summ_det_ar_yn,
      accept_duplicate: data.accept_duplicate,
      maintain_current_ar: data.maintain_current_ar,
      post_to_loan_activity: data.post_to_loan_activity,
      statement_balance_before_loan_balance: data.statement_balance_before_loan_balance,
      post_advance_to_loan_activity: data.post_advance_to_loan_activity
    })
    this.startprocessType(data.combine_summ_det_ar_yn)
    this.startmaintainCurrent(data.maintain_current_ar)
  }
}
