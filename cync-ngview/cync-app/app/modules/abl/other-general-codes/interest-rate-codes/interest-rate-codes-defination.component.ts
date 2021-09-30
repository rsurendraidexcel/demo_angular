import { Component, OnInit } from '@angular/core'
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { AppConfig } from '@app/app.config';
import { Router } from "@angular/router";
import { interestRateCodesModel, InterestRateCodes, InterestRateCodesPostModel, interestDetailsModel, InterestDetails } from './interest-rate-codes.model';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'interest-rate-codes-definition-comp',
  templateUrl: './interest-rate-codes-defination.component.html'
})

export class InterestRateCodesDefitionComponent implements OnInit {

  tempResult: any;
  lenderId: string;
  interestRateCodeAction: string = 'Add';
  interestRateCodeForm: FormGroup;
  interestRateCodeId: any;
  isDisable: boolean = false;
  interestRateCodeDtls: any;
  requestModel: any;
  interestRateCodeDefinition: InterestRateCodesPostModel = new InterestRateCodesPostModel();
  interestDetails: interestDetailsModel = new interestDetailsModel();
  message: Message;
  isSelectedLoanType: boolean = true;
  isSelectedCode: boolean = true;
  isSelectedName: boolean = true;
  isSelectedRateDate: boolean = true;
  isSelectedRateValue: boolean = true;
  isSelectedCurrencyType: boolean = true;
  loan_type: string;
  rate_code: string;
  rate_name: string;
  tempObj: any;
  date1: string;
  id: string;
  deleteModel: any;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  disabled: boolean = true;
  constructor(private _router: Router,
    private _service: CustomHttpService,
    private config: AppConfig,
    private route: ActivatedRoute,
    private _location: Location,
    private formvalidationService: FormvalidationService,
    private fb: FormBuilder,
    private _message: MessageServices) {
    this.lenderId = this.config.getConfig('lenderId');
    this.interestRateCodeForm = this.fb.group({
      loan_type: new FormControl('', Validators.compose([Validators.required])),
      rate_code: new FormControl('', Validators.compose([Validators.required])),
      rate_name: new FormControl('', Validators.compose([Validators.required])),
      rate_description: new FormControl('', Validators.compose([])),
      rate_divisor: new FormControl('', Validators.compose([])),
      rate_precision: new FormControl('', Validators.compose([])),
      addresses: this.fb.array([
        this.initAddress(),
      ])
    });
  }
  initAddress() {
    return this.fb.group({
      rate_date: [''],
      rate_value: [''],
      currency_type: [null]
    });
  }
  addAddress() {
    const control = <FormArray>this.interestRateCodeForm.controls['addresses'];
    const addrCtrl = this.initAddress();
    control.push(addrCtrl);
  }

  ngOnInit() {
    this._service.setHeight();
    this._message.showLoader(true);
    this.interestRateCodeForm.controls.loan_type.setValue(null);
    this.route.params.subscribe(params => {
      this.interestRateCodeId = params['id'];
      if (this.interestRateCodeId !== undefined && this.interestRateCodeId !== 'add') {
        this.disabled = false;
        this.isDisable = true;
        this.interestRateCodeAction = 'Edit'
        this._service.getCall("loan_charge_codes/interest_rate_codes/" + this.interestRateCodeId).then(i => {
          this.interestRateCodeDtls = this._service.bindData(i);
          this.interestRateCodeForm.controls['loan_type'].setValue(this.interestRateCodeDtls.loan_type);
          this.interestRateCodeForm.controls['rate_code'].setValue(this.interestRateCodeDtls.rate_code);
          this.interestRateCodeForm.controls['rate_name'].setValue(this.interestRateCodeDtls.rate_name);
          this.interestRateCodeForm.controls['rate_description'].setValue(this.interestRateCodeDtls.rate_description);
          this.interestRateCodeForm.controls['rate_divisor'].setValue(this.interestRateCodeDtls.rate_divisor);
          this.interestRateCodeForm.controls['rate_precision'].setValue(this.interestRateCodeDtls.rate_precision);
        })
        this._service.getCall("loan_charge_codes/interest_rate_codes/" + this.interestRateCodeId + "/interest_rates").then(i => {
          this.interestDetails = this._service.bindData(i);
          for (let i = 0; i < this.interestDetails.interest_rates.length; i++) {

            this.interestRateCodeForm.controls.addresses['controls'][i].rate_date = new Date(this.interestDetails.interest_rates[i].rate_date);
            this.interestRateCodeForm.controls.addresses['controls'][i].rate_value = this.interestDetails.interest_rates[i].rate_value;
            this.interestRateCodeForm.controls.addresses['controls'][i].currency_type = 'USD';
            if (i < this.interestDetails.interest_rates.length - 1) {
              this.addAddress();
            }
          }
        });
      }
      else {
        this._message.showLoader(false);
      }
    });
  }

  saveData() {
    if (this.interestRateCodeForm.valid) {
      this._message.showLoader(true);
      const ineligibilityModel = {
        "interest_rate_code":
          {
            "loan_type": this.interestRateCodeForm.controls.loan_type.value,
            "rate_code": this.interestRateCodeForm.controls.rate_code.value,
            "rate_name": this.interestRateCodeForm.controls.rate_name.value,
            "rate_description": this.interestRateCodeForm.controls.rate_description.value,
            "rate_divisor": this.interestRateCodeForm.controls.rate_divisor.value,
            "rate_precision": this.interestRateCodeForm.controls.rate_precision.value
          }
      }
      if (this.isDisable) {
        //Update
        this.requestModel = { url: 'loan_charge_codes/interest_rate_codes/' + this.interestRateCodeId, model: ineligibilityModel }
        this._service.patchCallRor(this.requestModel).then(i => this.EditInterestRate(i, this.interestRateCodeForm.value.addresses, this.interestDetails.interest_rates)).then(i => this.navigateToHome());
      } else {
        //Add new 
        this.requestModel = { url: 'loan_charge_codes/interest_rate_codes', model: ineligibilityModel }
        this._service.postCallpatch(this.requestModel).then(i => this.saveInterestRate(i, this.interestRateCodeForm.value.addresses)).then(i => this.navigateToHome());
      }
    }
  }

  saveInterestRate(data: any, interestRateModel) {
    console.log(interestRateModel);
    if (!this.isDisable) {
      for (var i = 0; i < interestRateModel.length; i++) {
        this.date1 = new DatePipe('en-US').transform(interestRateModel[i].rate_date, 'MM/dd/yyyy');
        const interestRateModelObject = {
          "interest_rate": {
            "rate_date": this.date1,
            "rate_value": interestRateModel[i].rate_value
          }
        }
        var requestModel = { url: data + "/interest_rates", model: interestRateModelObject };
        this._service.postCallRor(requestModel);
      }

    }
  }

  EditInterestRate(data: any, editinterestRateModel, interestRateModel) {
    for (var i = 0; i < interestRateModel.length; i++) {
      if (editinterestRateModel[i].rate_date == "" || editinterestRateModel[i].rate_date == undefined || editinterestRateModel[i].rate_date == null) {
        this.isSelectedRateDate = false;
      }
      else {
        this.isSelectedRateDate = true;
      }

      if (editinterestRateModel[i].rate_value == "" || editinterestRateModel[i].rate_value == undefined || editinterestRateModel[i].rate_value == null) {
        this.isSelectedRateValue = false;
      }
      else {
        this.isSelectedRateValue = true;
      }


      if (this.isSelectedRateDate == false && this.isSelectedRateValue == false) {

      }
      else if (this.isSelectedRateDate == true && this.isSelectedRateValue == true) {
        this.date1 = new DatePipe('en-US').transform(editinterestRateModel[i].rate_date, 'MM/dd/yyyy');

        const interestRateModelObject = {
          "interest_rate": {
            "rate_date": this.date1,
            "rate_value": editinterestRateModel[i].rate_value
          }
        }
        var requestModel = { url: "loan_charge_codes/interest_rate_codes/" + this.interestRateCodeId + "/interest_rates/" + interestRateModel[i].id, model: interestRateModelObject };
        this._service.patchCallRor(requestModel);
      }
      else if (this.isSelectedRateDate == true && this.isSelectedRateValue == false) {
        this.date1 = new DatePipe('en-US').transform(editinterestRateModel[i].rate_date, 'MM/dd/yyyy');
        const interestRateModelObject = {
          "interest_rate": {
            "rate_date": this.date1,
            "rate_value": interestRateModel[i].rate_value
          }
        }
        var requestModel = { url: "loan_charge_codes/interest_rate_codes/" + this.interestRateCodeId + "/interest_rates/" + interestRateModel[i].id, model: interestRateModelObject };
        this._service.patchCallRor(requestModel);
      }
      else if (this.isSelectedRateDate == false && this.isSelectedRateValue == true) {
        this.date1 = new DatePipe('en-US').transform(interestRateModel[i].rate_date, 'MM/dd/yyyy');

        const interestRateModelObject = {
          "interest_rate": {
            "rate_date": this.date1,
            "rate_value": editinterestRateModel[i].rate_value
          }
        }
        var requestModel = { url: "loan_charge_codes/interest_rate_codes/" + this.interestRateCodeId + "/interest_rates/" + interestRateModel[i].id, model: interestRateModelObject };
        this._service.patchCallRor(requestModel);
      }
      else {
      }

    }

    if (editinterestRateModel.length > interestRateModel.length) {

      for (var j = interestRateModel.length; j <= editinterestRateModel.length; j++) {
        if (editinterestRateModel[j].rate_date == '' || editinterestRateModel[j].rate_value == '') {

        }
        else {
          this.date1 = new DatePipe('en-US').transform(editinterestRateModel[j].rate_date, 'MM/dd/yyyy');
          const interestRateModelObject = {
            "interest_rate": {
              "rate_date": this.date1,
              "rate_value": editinterestRateModel[j].rate_value
            }
          }
          var requestModel = { url: data.url + "/interest_rates", model: interestRateModelObject };
          this._service.postCallRor(requestModel).then(i => this.navigateToHome());
        }
      }
    }
  }
  navigateToHome() {

    this._location.back();
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");

  }

  navigateToHomeCancel() {
    this._location.back();
  }

  addMoreRows() {

    if (this.interestRateCodeForm.controls.loan_type.value == undefined || this.interestRateCodeForm.controls.loan_type.value == null || this.interestRateCodeForm.controls.loan_type.value == '') {
      this.isSelectedLoanType = false;
    } else {
      this.isSelectedLoanType = true;
    }
    if (this.interestRateCodeForm.controls.rate_code.value == undefined || this.interestRateCodeForm.controls.rate_code.value == null || this.interestRateCodeForm.controls.rate_code.value == '') {
      this.isSelectedCode = false;
    } else {
      this.isSelectedCode = true;
    }
    if (this.interestRateCodeForm.controls.rate_name.value == undefined || this.interestRateCodeForm.controls.rate_name.value == null || this.interestRateCodeForm.controls.rate_name.value == '') {
      this.isSelectedName = false;
    } else {
      this.isSelectedName = true;
    }
    //Checking Interest rates required ` for the Add action
    if (this.interestRateCodeAction == "Add") {
      for (let i = 0; i < this.interestRateCodeForm.controls.addresses.value.length; i++) {

        if (this.interestRateCodeForm.controls.addresses.value[i].rate_date == undefined || this.interestRateCodeForm.controls.addresses.value[i].rate_date == null || this.interestRateCodeForm.controls.addresses.value[i].rate_date == '') {
          this.isSelectedRateDate = false;
        } else {
          this.isSelectedRateDate = true;
        }
        if (this.interestRateCodeForm.controls.addresses.value[i].rate_value == undefined || this.interestRateCodeForm.controls.addresses.value[i].rate_value == null || this.interestRateCodeForm.controls.addresses.value[i].rate_value == '') {
          this.isSelectedRateValue = false;
        } else {
          this.isSelectedRateValue = true;
        }
        /*  if(this.interestRateCodeForm.controls.addresses.value[i].currency_type == undefined || this.interestRateCodeForm.controls.addresses.value[i].currency_type == null || this.interestRateCodeForm.controls.addresses.value[i].currency_type == ''){   
             this.isSelectedCurrencyType = false;
          }else{
              this.isSelectedCurrencyType = true;
          }*/
      }
    }
    else {
      //Checking Interest rates required field for the Edit action
      for (let i = 0; i < this.interestRateCodeForm.controls.addresses.value.length; i++) {
        if (i == this.interestDetails.interest_rates.length - 1) {
          if (this.interestRateCodeForm.controls.addresses['controls'][i].rate_date == undefined || this.interestRateCodeForm.controls.addresses['controls'][i].rate_date == null || this.interestRateCodeForm.controls.addresses['controls'][i].rate_date == '') {
            this.isSelectedRateDate = false;
          } else {
            this.isSelectedRateDate = true;
          }
          if (this.interestRateCodeForm.controls.addresses['controls'][i].rate_value == undefined || this.interestRateCodeForm.controls.addresses['controls'][i].rate_value == null || this.interestRateCodeForm.controls.addresses['controls'][i].rate_value == '') {
            this.isSelectedRateValue = false;
          } else {
            this.isSelectedRateValue = true;
          }
          /*  if(this.interestRateCodeForm.controls.addresses['controls'][i].currency_type == undefined || this.interestRateCodeForm.controls.addresses['controls'][i].currency_type == null || this.interestRateCodeForm.controls.addresses['controls'][i].currency_type == ''){   
               this.isSelectedCurrencyType = false;
            }else{
                this.isSelectedCurrencyType = true;
            }*/

        }
        else {
          if (this.interestRateCodeForm.controls.addresses.value[i].rate_date == undefined || this.interestRateCodeForm.controls.addresses.value[i].rate_date == null || this.interestRateCodeForm.controls.addresses.value[i].rate_date == '') {
            this.isSelectedRateDate = false;
          } else {
            this.isSelectedRateDate = true;
          }
          if (this.interestRateCodeForm.controls.addresses.value[i].rate_value == undefined || this.interestRateCodeForm.controls.addresses.value[i].rate_value == null || this.interestRateCodeForm.controls.addresses.value[i].rate_value == '') {
            this.isSelectedRateValue = false;
          } else {
            this.isSelectedRateValue = true;
          }
     /*  if(this.interestRateCodeForm.controls.addresses.value[i].currency_type == undefined || this.interestRateCodeForm.controls.addresses.value[i].currency_type == null || this.interestRateCodeForm.controls.addresses.value[i].currency_type == ''){   
          this.isSelectedCurrencyType = false;
       }else{
           this.isSelectedCurrencyType = true;
       }
*/     }
      }
    }
    if (this.isSelectedLoanType == true && this.isSelectedCode == true && this.isSelectedName == true && this.isSelectedRateDate == true && this.isSelectedRateValue == true) {
      this.addAddress();
    }
  }
  //FOR Delete Rows
  removeRows(n: number) {
    if (this.interestRateCodeAction == "Add") {
      const control = <FormArray>this.interestRateCodeForm.controls['addresses'];
      control.removeAt(n);
    }
    else {
      this.deleteModel = this.interestDetails.interest_rates;
      for (var k = 0; k < this.interestDetails.interest_rates.length; k++) {
        if (k == n) {
          var requestModel = { url: "loan_charge_codes/interest_rate_codes/" + this.interestRateCodeId + "/interest_rates/" + this.deleteModel[n].id };
          this._service.deleteCall(requestModel);
          this.interestDetails.interest_rates.splice(k, 1);
        }
      }
      const control = <FormArray>this.interestRateCodeForm.controls['addresses'];
      control.removeAt(n);
    }
  }

  setDisableValues() {
    if (this.interestRateCodeForm.controls.loan_type.value == undefined ||
      this.interestRateCodeForm.controls.loan_type.value == '' ||
      this.interestRateCodeForm.controls.loan_type.value == null ||
      this.interestRateCodeForm.controls.rate_code.value == undefined ||
      this.interestRateCodeForm.controls.rate_code.value == '' ||
      this.interestRateCodeForm.controls.rate_name.value == undefined ||
      this.interestRateCodeForm.controls.rate_name.value == '') {
      this.disabled = true;

    } else {
      this.disabled = false;
    }
  }

  setRateNameValues() {

  }

  setRateCodeValues() {

  }
}

