import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-sub-limits',
  templateUrl: './sub-limits.component.html',
  styleUrls: ['./sub-limits.component.scss']
})
export class SubLimitsComponent implements OnInit {
  allClientTemplateData: any;
  sublimitData: any;
  subLimitForm: FormGroup;
  allDropDownData: any;
  @Output() formReady = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder, private clientTemplateDetails: ClientTemplatesService) {

  }

  ngOnInit() {
    this.formFunction()
    this.dropdownPopulation();
    this.getAllParameterData();
    this.formReady.emit(this.subLimitForm);

    // reseting the form
    this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
      if (data == "reset") {
        this.patchValues(this.sublimitData)
      }
    })
  }

  //form initilize function
  formFunction() {
    this.subLimitForm = this.fb.group({
      receivable_sublimit: null,
      receivable_sublimit_based_on: null,
      receivable_sublimit_calculated_cap_by: null,
      receivable_sublimit_max_cap_pct: null,
      inventory_sublimit: null,
      inventory_sublimit_based_on: null,
      inventory_sublimit_calculated_cap_by: null,
      inventory_sublimit_max_cap_pct: null,
      other_sublimit: null,
      other_collateral_based_on: null,
      other_collateral_calculated_cap_by: null,
      other_collateral_max_cap_pct: null,

    });

  }

  dropdownPopulation() {
    this.clientTemplateDetails.shareDropDownDataFn().subscribe(data => {
      this.allDropDownData = data

    })
  }

  // fetch all data from service
  getAllParameterData() {
    this.clientTemplateDetails.sendAllTemplateData().subscribe(data => {
      this.allClientTemplateData = data
      this.sublimitData = this.allClientTemplateData.parameter.data.sub_limits
      this.patchValues(this.sublimitData)
    })

  }

  // binding data to bbc others Form
  patchValues(data) {

    this.subLimitForm.patchValue({
      receivable_sublimit: data.receivable_sublimit,
      receivable_sublimit_based_on: data.receivable_sublimit_based_on,
      receivable_sublimit_calculated_cap_by: data.receivable_sublimit_calculated_cap_by,
      receivable_sublimit_max_cap_pct: data.receivable_sublimit_max_cap_pct,
      inventory_sublimit: data.inventory_sublimit,
      inventory_sublimit_based_on: data.inventory_sublimit_based_on,
      inventory_sublimit_calculated_cap_by: data.inventory_sublimit_calculated_cap_by,
      inventory_sublimit_max_cap_pct: data.inventory_sublimit_max_cap_pct,
      other_sublimit: data.other_sublimit,
      other_collateral_based_on: data.other_collateral_based_on,
      other_collateral_calculated_cap_by: data.other_collateral_calculated_cap_by,
      other_collateral_max_cap_pct: data.other_collateral_max_cap_pct,
    })
  }

}
