import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-over-advance',
  templateUrl: './over-advance.component.html',
  styleUrls: ['./over-advance.component.scss']
})
export class OverAdvanceComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>();
  overAdvanceForm: FormGroup;
  allDropDownData: any;
  allClientTemplateData: any;
  overAdvanceData: any;
  constructor(
    private fb: FormBuilder,
    private clientTemplateDetails: ClientTemplatesService
    ) { }

  ngOnInit() {
    this.formFunction();
    this.dropdownPopulation();
    this.getAllParameterData();
    this.formReady.emit(this.overAdvanceForm);
    // reseting the form
    this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
      if (data == "reset") {
        this.patchValues(this.overAdvanceData)
      }
    })
  }
  //form initilize function
  formFunction() {
    this.overAdvanceForm = this.fb.group({
      allow_over_advance: null,
      over_advance_pct: null,
      fund_send_by: null
    });
  }

  // populate dropdown

  dropdownPopulation() {
    this.clientTemplateDetails.shareDropDownDataFn().subscribe(data => {
      this.allDropDownData = data;

    })
  }

  getAllParameterData() {
    this.clientTemplateDetails.sendAllTemplateData().subscribe(data => {
      this.allClientTemplateData = data;
      this.overAdvanceData = this.allClientTemplateData.parameter.data.over_advance;
      this.patchValues(this.overAdvanceData);
    })

  }

  allowoveradvance(event) {
    if (event.target.value == "true") {
      this.overAdvanceForm.controls['allow_over_advance'].setValue(true);
    }
    else {
      this.overAdvanceForm.controls['allow_over_advance'].setValue(false);
    }
  }

  // binding data to over advance Form
  patchValues(data) {
    this.overAdvanceForm.patchValue({
      allow_over_advance: data.allow_over_advance,
      over_advance_pct: data.over_advance_pct,
      fund_send_by: data.fund_send_by
    })
  }

}
