import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FactoringFeeSetup } from '../../../model/factoring-fee-setup';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FactoringFeeSetupService } from '../../../service/factoring-fee-setup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'app-add-new-fee',
  templateUrl: './add-new-fee.component.html',
  styleUrls: ['./add-new-fee.component.scss']
})
export class AddNewFeeComponent implements OnInit {
  factoringFeeSetupForm: FormGroup;
  borrowerId: any;
  feeCalculatedonValue: any;
  feeCalculatedOn: any;
  feeCalculationMethodsOptions: any;
  feeCalculationMethodValue: any;
  feeNames:any;

  constructor(private fb: FormBuilder,
    private apiMapper: APIMapper,
    private helper: Helper,
    private feeSetupService: FactoringFeeSetupService,
    private message: MessageServices,
    public dialogRef: MatDialogRef<AddNewFeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.createRollForwardLogsForm();
    this.newFeeValidations();
  }
  createRollForwardLogsForm() {
    this.factoringFeeSetupForm = this.fb.group({
      name: ["", Validators.required],
      advance_rate: ['100.0'],
      fee_calculated_on_options: [],
      fee_calculation_methods_options: [],
      spread_percentage: [0, Validators.required],
      divisor: [360, Validators.required],
    });
  }
  newFeeValidations() {
    this.feeCalculatedOn = this.data.feeCalculatedOnOptions;
    this.feeCalculationMethodsOptions = this.data.feeCalculatedMethodOptions;
    console.log("feeCalculationMethodsOptions", this.feeCalculationMethodsOptions)
    this.factoringFeeSetupForm.get('fee_calculation_methods_options').setValue('per_day');
    this.feeCalculationMethodValue = "per_day"
    this.factoringFeeSetupForm.get('fee_calculation_methods_options').disable();
    this.factoringFeeSetupForm.get('fee_calculated_on_options').setValue('Face Value');
    this.feeCalculatedonValue = "Face Value"
    this.factoringFeeSetupForm.get('fee_calculated_on_options').disable();
    // this.factoringFeeSetupForm.get('fact_recourse_factoring').disable();
    // this.factoringFeeSetupForm.get('fact_recourse_days').disable();
    // this.factoringFeeSetupForm.get('fact_recourse_fee_pct').disable();
  }
  onSaveclick(model: any) {

    this.borrowerId = CyncConstants.getSelectedClient();
    console.log(" this.borrowerId", this.borrowerId)
    let requestBody = new FactoringFeeSetup();
    requestBody.fee_setup = model;
    requestBody.fee_setup.fee_calculated_on = "Face Value";
    requestBody.fee_setup.fee_calculation_method = "per_day";
    requestBody.fee_setup["source"] = "Receivables";
    const url = this.apiMapper.endpoints[CyncConstants.ADD_NEW_FEE].replace("{borrower_id}", this.borrowerId);
    this.feeSetupService.addNewFeeDataService(url, requestBody).subscribe((response) => {
      const message = "factoring fee set up was successfully created";
      this.helper.showApiMessages(message, "success");
      this.getAllFeeNames();
      this.dialogRef.close();
    },
    error => {
      this.message.showLoader(false);
      
    });

    
  }

  onCancelclick() {
    this.dialogRef.close();
  }
  getAllFeeNames(){
    const url = this.apiMapper.endpoints[
      CyncConstants.FEE_SETUP_FEE_NAMES
    ].replace("{borrower_id}", this.borrowerId);
    this.feeSetupService.getFeeSetupDataService(url).subscribe(response => {
      this.feeNames= <any>JSON.parse(response._body).fee_names;
      this.feeSetupService.setFeeNames(this.feeNames)
    });
  }
}
