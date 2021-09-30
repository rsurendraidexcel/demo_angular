import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { LoanSetupService } from '../../../loan-maintenance/loan-activity/loan-setup/service/loan-setup.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { FactoringInterestSetupModel } from './model/factoring-interest-setup';
import { FactoringInterestSetupService } from './service/factoring-interest-setup.service';
import { PopupInterestAdjustmentRateComponent } from './popup-interest-adjustment-rate/popup-interest-adjustment-rate.component';
import { Router } from '@angular/router';

interface RolesPermision {
  action: string;
  action_id: number;
  action_label: string;
  enabled: boolean;
  role_permission_id: number;
}
@Component({
  selector: 'app-factoring-interest-setup',
  templateUrl: './factoring-interest-setup.component.html',
  styleUrls: ['./factoring-interest-setup.component.scss']
})
export class FactoringInterestSetupComponent implements OnInit, AfterViewInit {
  factoringInterestSetupForm: FormGroup;
  fotoringInterestSetupData: FactoringInterestSetupModel;
  isDataLoaded: boolean;
  clientId: any;
  initialLoad: boolean;
  showError: boolean;
  showError1: boolean;

  // DropDown Array Veriable defination section
  interestRateCode: any;
  interestRateCodeDrowdown: any;
  selectedRateCode: any
  interestAccumulated: any;
  interestAccumulatedData: any;
  interestCompounding: any;
  interestCalculatedFor: any;
  interestFrequency: any;
  interestChargedOn: any;
  interestDeductedFromReserve: any;
  interestStartsFrom: any;
  errorMsg: string;
  userAndClient: any;
  isAdjustmentRate: boolean;

  isNewInterestSetup: boolean = false;
  interestSetupRolePermission: RolesPermision[];

  isAllowedToEdit: boolean = false;
  interestChargeEditable: boolean = false;
  rolesAndPermissionAvailability:boolean = false;

  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private _apiMapper: APIMapper,
    private loanSetupService: LoanSetupService,
    private _message: MessageServices,
    public dialog: MatDialog,
    private renderer2: Renderer2,
    private helper: Helper,
    private router: Router,
    private factoringInterestService: FactoringInterestSetupService) {

    this.helper.getClientID().subscribe((d) => {
      this.clientId = d;
      console.log("clientID::", this.clientId);
    });
    this.errorMsg = "";

    // Obervale for clients and userDetails
    this.userAndClient = CyncConstants.getUserInfo();
    this.helper.getSelectedUserAndClient().subscribe(data => {
      this.userAndClient = data;
      if (this.userAndClient === undefined) {
        this.router.navigateByUrl(window.origin + "/#/");
      } else {
        if (this.userAndClient.clientDetails.processng_type === "ABL") {
          window.location.href = window.origin;
        }
      }
    });

  }

  ngOnInit() {
    this.isAllowedToEdit = true;
    this.initializeInterestSetUpForm();
    this.getloanSetupRolesPermission();
    this.factoringInterestSetupForm.get('interest_to_be_charged').disable();

    this.helper.getClientID().subscribe((data) => {
      let cltid = data;
      this.isAllowedToEdit = true;
      this.initialLoad = true;
      this.interestSetupFormDisable();
      this.factoringInterestSetupForm.get("interest_charged_on").disable();

      if (cltid !== 'null') {
        this.clientId = parseInt(cltid);
        this.getFactoringInterestSetUpShowData();

        this.showError = false;
        this.showError1 = false;
        this._message.showLoader(true);
        this.summaryPermission();
        // this.createPermission();
      }
    });

  }

  ngAfterViewInit() {
    //  this.setScrollbar();
  }

  // @HostListener('window:resize')
  // setScrollbar() {
  //   const scrollElm = document.querySelector("#innerScrollbar");
  //   const h = $(document).height() - 260;
  //   this.renderer2.setStyle(scrollElm, 'height', h + 'px');
  //   this.renderer2.setStyle(scrollElm, 'margin-right', '4px');
  //   this.renderer2.setStyle(scrollElm, 'overflow-y', 'auto');
  // }
  getloanSetupRolesPermission() {
    const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);
    const url = `roles/${userRoleId}/role_permissions/menu_specific_permissions?menu_name=factoring_interest_setup`;
    this.loanSetupService.getService(url).subscribe(resp => {
      let temRoleData = <RolesPermision[]>JSON.parse(resp._body);
      this.interestSetupRolePermission = temRoleData;
      console.log("Roles:", this.interestSetupRolePermission);
    });
  }

  checkRolsPermission(action: string): boolean {
    let result: boolean;
    if (this.interestSetupRolePermission !== undefined) {
      this.interestSetupRolePermission.forEach(el => {
        if (el.action_label === action) {
          result = el.enabled;
        }
      });
    }
    return result;
  }

  validationRolesForCancel(): boolean {
    if (this.isNewInterestSetup === false && !this.checkRolsPermission('Create') === false) {
      return false;
    } else if (this.isNewInterestSetup === false) {
      return false;
    } else if (this.isAllowedToEdit === false) {
      return false;
    } else {
      return true;
    }

  }


  validationRoles(): boolean {
    // console.log("check role------------------",this.checkRolsPermission('Create'), this.isAllowedToEdit, this.isNewInterestSetup);
    if (this.factoringInterestSetupForm.pristine === false) {
      if (this.isNewInterestSetup === false && this.checkRolsPermission('Create') === false) {
        return false;
      } else if (this.isNewInterestSetup === true && this.checkRolsPermission('Create') === false) {
        return true;
      } else if (this.isNewInterestSetup === false && this.checkRolsPermission('Create') === true) {
        return false;
      } else if (this.isAllowedToEdit === false && this.checkRolsPermission('Create') === false) {
        return true;
      } else if (this.isAllowedToEdit === true && this.checkRolsPermission('Create') === false) {
        return false;
      } else if (this.isAllowedToEdit === false && this.checkRolsPermission('Create') === true) {
        return false;
      } else if (this.isAllowedToEdit === true && this.checkRolsPermission('Create') === true) {
        return true;
      }
    } else {
      return true;
    }
  }

  summaryPermission() {
    if (this.checkRolsPermission('Summary') === false) {
      window.location.href = window.origin + "/factoring/dashboard";
      console.info("route to dashboard");
    }
  }


  interestSetupFormDisable() {
    this.isAdjustmentRate = false;
    this.factoringInterestSetupForm.get('rate_code').disable();
    this.factoringInterestSetupForm.get('interest_deducted_from_reserve').disable();
    this.factoringInterestSetupForm.get("adjustment_rate").disable();
    this.factoringInterestSetupForm.get("minimum_interest_rate").disable();
    this.factoringInterestSetupForm.get("maximum_interest_rate").disable();
    this.factoringInterestSetupForm.get("interest_accumulated_to").disable();
    this.factoringInterestSetupForm.get("interest_calculated_for").disable();
    this.factoringInterestSetupForm.get("interest_frequency").disable();
    // this.factoringInterestSetupForm.get("interest_compounding").disable();
    this.factoringInterestSetupForm.get("interest_charged_on").disable();
    // this.factoringInterestSetupForm.get("interest_starts_from").disable();
    this.factoringInterestSetupForm.get("interest_starts_days").disable();
  }

  interestSetupFormEnable() {
    this.isAdjustmentRate = true;
    this.factoringInterestSetupForm.get('rate_code').enable();
    this.factoringInterestSetupForm.get('interest_deducted_from_reserve').enable();
    this.factoringInterestSetupForm.get("adjustment_rate").enable();
    this.factoringInterestSetupForm.get("minimum_interest_rate").enable();
    this.factoringInterestSetupForm.get("maximum_interest_rate").enable();
    this.factoringInterestSetupForm.get("interest_accumulated_to").enable();
    this.factoringInterestSetupForm.get("interest_calculated_for").enable();
    this.factoringInterestSetupForm.get("interest_frequency").enable();
    // this.factoringInterestSetupForm.get("interest_compounding").enable();
    this.factoringInterestSetupForm.get("interest_charged_on").enable();
    // this.factoringInterestSetupForm.get("interest_starts_from").enable();
    this.factoringInterestSetupForm.get("interest_starts_days").enable();

  }

  onIterestTobeChecked(event: any) {
    console.log("event", event.target.checked);
    if (event.target.checked) {
      this.initialLoad = false;
      this.interestSetupFormEnable();
      this.isAdjustmentRate = true;
    } else {
      this.interestSetupFormDisable();
      this.isAdjustmentRate = false;

    }
  }

  onCashReceiptCheck(event: any) {
    console.log("event", event.target.checked);
  }

  initializeInterestSetUpForm() {
    this.factoringInterestSetupForm = this.fb.group({
      rate_code: new FormControl('', [Validators.required]),
      interest_to_be_charged: [false],
      interest_rate_code_id: ['', Validators.required],
      adjustment_rate: ['', Validators.required],
      minimum_interest_rate: [''],
      maximum_interest_rate: [''],
      interest_accumulated_to: ['', Validators.required],
      // interest_compounding: ['', Validators.required],
      interest_calculated_for: ['', Validators.required],
      interest_frequency: ['', Validators.required],
      interest_charged_on: ['', Validators.required],
      // interest_starts_from: ['', Validators.required],
      interest_deducted_from_reserve: ['', Validators.required],
      interest_starts_days: ['', Validators.required],
      cash_receipt_float_days: [0]
    });
  }
  actionCancel(event: any) {
    this._message.showLoader(true);
    this.initialLoad = true;
    if (this.interestChargeEditable) {
      this.interestSetupFormDisable();
      this.isAllowedToEdit = true;
      // this.isNewInterestSetup = true;
      this.factoringInterestSetupForm.get('interest_to_be_charged').disable();
      // this.textboxValidation(event);
      this.getFactoringInterestSetUpShowData();
    } else {
      this.clearformBinding(this.fotoringInterestSetupData);
      this.interestSetupFormDisable();
      // this.textboxValidation(event);
      // this.isNewInterestSetup = true;
      this.factoringInterestSetupForm.get('interest_to_be_charged').disable();
      this.isAllowedToEdit = true;
      this.getFactoringInterestSetUpShowData();

    }
    let thisObj = this;
    setTimeout(() => {thisObj._message.showLoader(false);},5000);
  }

  //SaveAction methods
  saveActionInterestSetup() {
    let url_endpoint = "factoring/interest/factoring_interest_setups";
    let payloadBody = {
      "factoring_interest_setup": {
        "client_id": this.clientId,
        "interest_to_be_charged": this.factoringInterestSetupForm.get('interest_to_be_charged').value,
        "interest_rate_code_id": this.factoringInterestSetupForm.get('rate_code').value,
        "adjustment_rate": this.factoringInterestSetupForm.get('adjustment_rate').value,
        "minimum_interest_rate": this.factoringInterestSetupForm.get('minimum_interest_rate').value,
        "maximum_interest_rate": this.factoringInterestSetupForm.get('maximum_interest_rate').value,
        "interest_accumulated_to": this.factoringInterestSetupForm.get("interest_accumulated_to").value,
        // "interest_compounding": this.factoringInterestSetupForm.get("interest_compounding").value,
        "interest_calculated_for": this.factoringInterestSetupForm.get("interest_calculated_for").value,
        "interest_frequency": this.factoringInterestSetupForm.get("interest_frequency").value,
        "interest_charged_on": this.factoringInterestSetupForm.get("interest_charged_on").value,
        "interest_deducted_from_reserve": this.factoringInterestSetupForm.get("interest_deducted_from_reserve").value,
        "interest_deducted_from_reserve_days": null,
        "name": "Test1",
        "cash_receipt_float_Days": this.factoringInterestSetupForm.get("cash_receipt_float_days").value,
        // "interest_starts_from": this.factoringInterestSetupForm.get("interest_starts_from").value,
        "interest_starts_days": this.factoringInterestSetupForm.get("interest_starts_days").value
      }
    };
    //  this.factoringInterestSetupForm.controls.interest_starts_days.valid &&
    console.log("interesttobecharged", this.factoringInterestSetupForm.controls.interest_to_be_charged.value)
    if (this.factoringInterestSetupForm.controls.interest_to_be_charged.value === true) {

      if (this.factoringInterestSetupForm.controls.rate_code.valid &&
        this.factoringInterestSetupForm.controls.interest_calculated_for.valid &&
        this.factoringInterestSetupForm.controls.interest_frequency.valid &&
        this.factoringInterestSetupForm.controls.interest_charged_on.valid &&
        this.factoringInterestSetupForm.controls.interest_deducted_from_reserve.valid) {


        if (this.interestChargeEditable === true) {
          // update intrest set up

          this.factoringInterestService.updateInterestSetupService(payloadBody, this.clientId).subscribe(res => {
            console.log("updateinteres", res);
            this.helper.showApiMessages(res.success.message, 'success');
            this.getFactoringInterestSetUpShowData();
            this.interestSetupFormDisable();
            this.initialLoad=true;
          }, (error) => {
            this._message.cync_notify("error", `${error.error.message}`, 3000);
          });

        } else {
          // create intrest set up 
          this.factoringInterestService.postInterestSetup(url_endpoint, payloadBody).subscribe((response) => {
            console.log("Post Response::", response);
            if (response.status === 200) {
              this.helper.showApiMessages(response.success.message, 'success');
            }
            this.getFactoringInterestSetUpShowData();
            this.interestSetupFormDisable();
            this.initialLoad=true;
          }, (error) => {
            if (error.status === 403) {
              this.rolesAndPermissionAvailability  = true;
            } else {
              this._message.cync_notify("error", `${error.error.error.message}`, 3000);
            }
          });
        }

      } else {
        this._message.cync_notify("error", `Please Enter the required  field`, 3000);
      }
    }
    else {
      if (this.interestChargeEditable === true) {
        // update intrest set up

        this.factoringInterestService.updateInterestSetupService(payloadBody, this.clientId).subscribe(res => {
          console.log("updateinteres", res)
          this.helper.showApiMessages(res.success.message, 'success');
          this.getFactoringInterestSetUpShowData();
          this.interestSetupFormDisable();
          this.initialLoad = true;

        }, (error) => {
          this._message.cync_notify("error", `${error.error.message}`, 3000);
        });

      } else {
        // create intrest set up 
        this.factoringInterestService.postInterestSetup(url_endpoint, payloadBody).subscribe((response) => {
          console.log("Post Response::", response);
          if (response.status === 200) {
            this.helper.showApiMessages(response.success.message, 'success');
          }
          this.getFactoringInterestSetUpShowData();
          this.interestSetupFormDisable();
        }, (error) => {
          if (error.status === 403) {
            this.rolesAndPermissionAvailability  = true;
            // this.errorMessage_400 = error.error.message;
          } else {
            this._message.cync_notify("error", `${error.error.error.message}`, 3000);
          }
        });
      }
    }

  }



  onInterestRateCodeChange(event: any) {
    let selectedRate = this.interestRateCode.find(elm => elm.id === event.value);
    if (selectedRate) {
      this.interestSetupFormEnable();
    } else {
      this.interestSetupFormDisable();
    }
    console.log("selectedRateCode event::", selectedRate.id);
    this.factoringInterestSetupForm.get("rate_code").setValue(selectedRate.id);
  }

  onAdjustmentRate(event: any) {
    this.initialLoad = false;
    console.log("Adjustment Rate::", event.target.value);
    if (event.target.value >= -100 && event.target.value <= 100) {
      this.textboxValidation(event);
    } else {
      this.textboxValidation(event, "Please Enter greater than -100 and lesser than 100");
    }
  }

  onMinimumInterestRate(event: any) {
    this.initialLoad = false;
    console.log("Minimum Interest Rate::", event.target.value);
    if (event.target.value >= 0 && event.target.value <= 100) {
      this.textboxValidation(event);
    } else {
      this.textboxValidation(event, "Please, Enter Minimum Interest Rate less than 100");
    }
  }

  onMaximumInterestRate(event: any) {
    console.log("Maximum Interest Rate::", event.target.value);
    if (event.target.value >= 0 && event.target.value <= 100) {
      this.textboxValidation(event);
      this.initialLoad = false;
    } else {
      this.textboxValidation(event, "Please, Enter Maximum Interest Rate less than 100");
    }
  }

  onInterestAccumulated(event) {
    console.log("Interest Accumulated", event.target.value);
    this.factoringInterestSetupForm.get("interest_accumulated_to").setValue(event.target.value);
  }

  onInterestCompounding(event: any) {
    console.log("Interest Compounding::", event.target.value);
    this.factoringInterestSetupForm.get("interest_compounding").setValue(event.target.value);
  }

  onInterestCalculatedFor(event: any) {
    console.log("Interest Calculated For::", event.target.value);
    this.initialLoad = false;
    this.factoringInterestSetupForm.get("interest_calculated_for").setValue(event.target.value);
    this.showError1 = false;
  }

  onInterestFrequency(event: any) {
    console.log("Interest Frequency::", event.target.value);
    this.initialLoad = false;
    this.factoringInterestSetupForm.get("interest_frequency").setValue(event.target.value);

  }

  onInterestChargedOn(event: any) {
    console.log("Interest Charge On::", event.target.value);
    this.initialLoad = false;
    this.factoringInterestSetupForm.get("interest_charged_on").setValue(event.target.value);
  }

  onInterestDeductedFromReserve(event: any) {
    this.initialLoad = false;
    console.log("Interest Deducted From Reserve::", event.target.value);
    this.factoringInterestSetupForm.get("interest_deducted_from_reserve").setValue(event.target.value);

  }

  onInterestStartDays(event: any) {
    this.initialLoad = false;
    console.log("Interest starts days:", event.target.value);
    this.factoringInterestSetupForm.get("interest_starts_days").setValue(event.target.value);

  }
  onInterestStartsFrom(event: any) {
    this.initialLoad = false;
    console.log("Interest starts From:", event.target.value);
    this.factoringInterestSetupForm.get("interest_starts_from").setValue(event.target.value);

  }


  //Validation Common Method
  textboxValidation(event: any, message?: string) {
    const siblingElement = this.renderer2.nextSibling(event.target);
    if (message) {
      this.errorMsg = message;
      this.renderer2.addClass(event.target, 'validation-notify');
      this.renderer2.setStyle(siblingElement, 'display', 'block');
    } else {
      this.renderer2.removeStyle(siblingElement, 'display');
      this.renderer2.removeClass(event.target, 'validation-notify');
      this.errorMsg = "";
    }
  }


  // This method Call After getFactoringInterestSetUpShowData Fails only
  getInterestNewSetUpData() {
    this.factoringInterestService.getInterestNewSetUp().subscribe(data => {
      console.log("<====New Interest Setup API Data====>", data.factoring_interest_setup);
      this.fotoringInterestSetupData = data.factoring_interest_setup as FactoringInterestSetupModel;

      this.dropDownListDataBinding(this.fotoringInterestSetupData);
      this.defaultValueSBinding(this.fotoringInterestSetupData);
    });
  }

  // Interest show data Lading time Call
  getFactoringInterestSetUpShowData() {
    this.factoringInterestService.getInterestSetupData(this.clientId).subscribe(data => {
      //already Interest setup Data;
      this.isNewInterestSetup = false;
      this.fotoringInterestSetupData = data[0] as FactoringInterestSetupModel;
      this.dropDownListDataBinding(this.fotoringInterestSetupData);
      this.editInterestSetup();
    }, (error) => {
      if(error.status === 403){
        this.rolesAndPermissionAvailability = true;
      }
      // New Interest Setup Call will if show Data is not Available;
      this.isNewInterestSetup = true;
      this.getInterestNewSetUpData();
      //this._message.cync_notify("error", `${error.error.message}`, 3000);

    });
  }

  //All the Form Binding
  dropDownListDataBinding(interest_setup_data: FactoringInterestSetupModel) {
    console.log("<=====Binding Section====>", interest_setup_data);
    //if Interest setup is already created 
    if (this.isNewInterestSetup == false) {
      this.interestRateCode = interest_setup_data.interest_rate_code_id.values;
      this.interestRateCodeDrowdownFormat(this.interestRateCode);
      this.interestAccumulated = interest_setup_data.interest_accumulated_to.values;
      // this.interestCompounding = interest_setup_data.interest_compounding.values;
      this.interestCalculatedFor = interest_setup_data.interest_calculated_for.values;
      this.interestFrequency = interest_setup_data.interest_frequency.values;
      this.interestChargedOn = interest_setup_data.interest_charged_on.values;
      this.interestDeductedFromReserve = interest_setup_data.interest_deducted_from_reserve.values;
      //this.interestStartsFrom = interest_setup_data.interest_starts_from.values;
      this.setSelectedFieldBinding(interest_setup_data);
      this.factoringInterestSetupForm.get('interest_to_be_charged').disable();


    }

    //if New Interest Setup is new data not Requried selected value only list binding
    if (this.isNewInterestSetup == true) {
      this.interestRateCode = interest_setup_data.interest_rate_code;
      this.interestRateCodeDrowdownFormat(this.interestRateCode);
      this.interestAccumulated = interest_setup_data.interest_accumulated;
      // this.interestCompounding = interest_setup_data.interest_compounding;
      this.interestCalculatedFor = interest_setup_data.interest_calculated_for;
      this.interestFrequency = interest_setup_data.interest_frequency;
      this.interestChargedOn = interest_setup_data.interest_charged_on;
      this.interestDeductedFromReserve = interest_setup_data.interest_deducted_from_reserve;
      // this.interestStartsFrom = interest_setup_data.interest_starts_from;
      // this.setSelectedFieldBinding(interest_setup_data);

      // this.factoringInterestSetupForm.get('interest_to_be_charged').enable();
      this.clearformBinding(interest_setup_data);

    }
    //InpuText box value binding
    this.factoringInterestSetupForm.get('interest_to_be_charged').setValue(interest_setup_data.interest_to_be_charged);
    this.factoringInterestSetupForm.get('adjustment_rate').setValue(interest_setup_data.adjustment_rate);
    this.factoringInterestSetupForm.get('minimum_interest_rate').setValue(interest_setup_data.minimum_interest_rate);
    this.factoringInterestSetupForm.get('maximum_interest_rate').setValue(interest_setup_data.maximum_interest_rate);
    this.factoringInterestSetupForm.get('interest_starts_days').setValue(interest_setup_data.interest_charged_date);

    let thisObj = this;
    setTimeout(() => {thisObj._message.showLoader(false);},5000);
  }

  interestRateCodeDrowdownFormat(data: any) {
    let tempData = [];
    if (data.length > 1) {
      data.forEach(element => {
        tempData.push({ "value": element.id, "label": element.rate_name })
      });
      var x = tempData.sort(function (a, b) {
        var A = a.label.toLowerCase();
        var B = b.label.toLowerCase();
        if (A < B) {
          return -1;
        } else if (A > B) {
          return 1;
        }
        return 0;
      });
      this.interestRateCodeDrowdown = x;
    }
  }
  //Set the selected dropwdwon Data
  setSelectedFieldBinding(modeldata: any) {
    this.factoringInterestSetupForm.get('rate_code').setValue(modeldata.interest_rate_code_id.selected);
    this.factoringInterestSetupForm.get('interest_accumulated_to').setValue(modeldata.interest_accumulated_to.selected);
    // this.factoringInterestSetupForm.get('interest_compounding').setValue(modeldata.interest_compounding.selected);
    this.factoringInterestSetupForm.get('interest_calculated_for').setValue(modeldata.interest_calculated_for.selected);
    this.factoringInterestSetupForm.get('interest_frequency').setValue(modeldata.interest_frequency.selected);
    this.factoringInterestSetupForm.get('interest_charged_on').setValue(modeldata.interest_charged_on.selected);
    // this.factoringInterestSetupForm.get('interest_starts_from').setValue(modeldata.interest_starts_from.selected);
    // this.factoringInterestSetupForm.get('interest_starts_from').setValue(0);
    this.factoringInterestSetupForm.get('interest_deducted_from_reserve').setValue(modeldata.interest_deducted_from_reserve.selected);

  }

  clearformBinding(modeldata: any) {
    this.factoringInterestSetupForm.reset();
    this.factoringInterestSetupForm.get('rate_code').setValue('');
    this.factoringInterestSetupForm.get('interest_accumulated_to').setValue('');
    // this.factoringInterestSetupForm.get('interest_compounding').setValue('');
    this.factoringInterestSetupForm.get('interest_calculated_for').setValue('');
    this.factoringInterestSetupForm.get('interest_frequency').setValue('');
    this.factoringInterestSetupForm.get('interest_charged_on').setValue('');
    //this.factoringInterestSetupForm.get('interest_starts_from').setValue('');
    this.factoringInterestSetupForm.get('interest_deducted_from_reserve').setValue('');
    this.factoringInterestSetupForm.get('interest_to_be_charged').setValue('');
    //Textbox empty
    this.factoringInterestSetupForm.get('adjustment_rate').setValue('');
    this.factoringInterestSetupForm.get('minimum_interest_rate').setValue('');
    this.factoringInterestSetupForm.get('maximum_interest_rate').setValue('');
    this.factoringInterestSetupForm.get('interest_starts_days').setValue('');
  }


  popupFunction() {

    if (this.factoringInterestSetupForm.get('rate_code').value) {
      this.openPopUp();
    } else {
      this._message.cync_notify("error", `Please Select Interest Rate Code`, 3000);
    }
  }

  openPopUp() {
    let selectedRateCode = this.interestRateCode.find(elm => elm.id === this.factoringInterestSetupForm.get('rate_code').value);
    const dialogRef = this.dialog.open(PopupInterestAdjustmentRateComponent, {
      disableClose: true,
      width: '700px',
      maxWidth: '750px',
      height: 'auto',
      data: { client_id: this.clientId, selected_rate_code: selectedRateCode }
    });
  }


  defaultValueSBinding(setupData: any) {
    if (setupData.interest_frequency.length === 1) {
      this.factoringInterestSetupForm.get('interest_frequency').setValue(setupData.interest_frequency[0].value);
    }
    if (setupData.interest_charged_on.length === 1) {
      this.factoringInterestSetupForm.get('interest_charged_on').setValue(setupData.interest_charged_on[0].value);
    }
    if (setupData.interest_deducted_from_reserve.length === 1) {
      this.factoringInterestSetupForm.get('interest_deducted_from_reserve').setValue(setupData.interest_deducted_from_reserve[0].value);
    }
  }
  editInterestSetup() {

    this.factoringInterestService.editSetupService(this.clientId).subscribe((res) => {
      this.isAllowedToEdit = res.allow_edit;
      this.interestChargeEditable = res.allow_edit;
      this.validationRolesForCancel();

    });
    if (this.factoringInterestSetupForm.controls.interest_to_be_charged.value === true) {
      this.isAdjustmentRate = true;
    } else {
      this.isAdjustmentRate = false;

    }
  }

  updateInterestSetup() {
    this.factoringInterestSetupForm.enable();
    this.initialLoad = false;
    this.isAllowedToEdit=false;
    this.validationRolesForCancel();
    if (this.isNewInterestSetup == false) {
      this.isAdjustmentRate = true;
    }
    if (this.factoringInterestSetupForm.controls.interest_to_be_charged.value === true) {
      this.interestSetupFormEnable();
    } else {
      this.interestSetupFormDisable();
    }
  }
}