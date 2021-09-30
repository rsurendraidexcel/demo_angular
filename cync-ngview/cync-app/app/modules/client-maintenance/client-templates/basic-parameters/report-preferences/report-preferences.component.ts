import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TreeviewItem } from 'ngx-treeview';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-report-preferences',
  templateUrl: './report-preferences.component.html',
  styleUrls: ['./report-preferences.component.scss']
})
export class ReportPreferencesComponent implements OnInit {

  @Output() formReady = new EventEmitter<FormGroup>();
  reportPreferences: FormGroup;
  reportPreferencesData: any;
  allClientTemplateData: any;
  allDropDownData: any;
  dropdownList: any;
  selectedItems = [];
  dropdownSettings = {};
  dropdownEnabled: boolean;
  items: TreeviewItem[];

  constructor(private fb: FormBuilder, private clientTemplateDetails: ClientTemplatesService) { }

  ngOnInit() {

    this.formFunction();
    // this.items = this.getCalculatedIR();
    this.getAllParameterData();
    this.dropdownPopulation()
    this.formReady.emit(this.reportPreferences);

    // reseting the form
    this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
      if (data == "reset") {
        this.patchValues(this.reportPreferencesData)
      }
    })

    // this.dropdownSettings = {
    //   hasAllCheckBox: true,
    //   hasFilter: false,
    //   hasCollapseExpand: false,
    //   decoupleChildFromParent: false,
    // };
  }


  formFunction() {

    this.reportPreferences = this.fb.group({
      inventory_reliance_based_on: null,
      inventory_reliance_calcaulated_cap_by: null,
      borrower_base_based_on: null,
      borrower_base_calcaulated_cap_by: null
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
      this.reportPreferencesData = this.allClientTemplateData.parameter.data.report_preferences
      this.patchValues(this.reportPreferencesData)
    })

  }

  // binding data to bbc others Form
  patchValues(data) {
    this.reportPreferences.patchValue({
      inventory_reliance_based_on: data.inventory_reliance_based_on,
      inventory_reliance_calcaulated_cap_by: null,
      borrower_base_based_on: data.borrower_base_based_on,
      borrower_base_calcaulated_cap_by: null
    })
  }

}
