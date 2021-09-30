import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Helper } from '@cyncCommon/utils/helper';
import { CashControlData, CashControlRequestBody, EditCashData } from '../../model/cash-control.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CashControlService } from '../../service/cash-control.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';

@Component({
  selector: 'app-cash-control-add',
  templateUrl: './cash-control-add.component.html',
  styleUrls: ['./cash-control-add.component.scss']
})
export class CashControlAddComponent implements OnInit {
  cashControlForm: FormGroup;
  currentAction: string;

  cashControlId: any;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  isValid: boolean = false;
  cashCrontrolData: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private helper: Helper,
    private cashControlService: CashControlService,
    private _apiMapper: APIMapper,

    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.cashControlId = params['id'];
    });

  }

  ngOnInit() {
    this.initFormValidator();

    if (this.cashControlId === "add") {
      this.currentAction = CyncConstants.GET_ADD_ACTION;

    } else {
      this.currentAction = CyncConstants.GET_EDIT_ACTION;
      this.getCashControlDetails();
    }

  }

  /**
   * initializing form validator
   */
  initFormValidator() {
    this.cashControlForm = this.fb.group({
      cash_control: ['', Validators.required],
      description: ['']
    });

  }

  /**
    * setValue in formdata
    */
  setCashControlForm() {
    this.cashControlForm.controls["cash_control"].setValue(`${this.cashCrontrolData.code}`);
    this.cashControlForm.controls["description"].setValue(`${this.cashCrontrolData.description}`);
  }

  /**
   * add New Save method
   */
  cashControlSubmit() {
    let message: string = 'Cash Controls Saved Successfully.';
    var requestBody = {
      "cash_control": {
        "cash_control": this.cashControlForm.get('cash_control').value,
        "description": this.cashControlForm.get('description').value,
      }
    };
    let url = this._apiMapper.endpoints[CyncConstants.ADD_CASH_CONTROL_LIST];

    if (this.cashControlForm.get('cash_control').value === '') {
      let message: string = 'Please Enter Cash Control';
      this.helper.showApiMessages(message, 'delete');
    } else {
      this.cashControlService.addCashControl(url, requestBody).subscribe(res => {
        this.helper.showApiMessages(message, 'success');
        this.navigateToControlListing();
      });
    }
  }

  /**
   * Edit cashControl Method
   */
  cashControlEdit() {
    let url = this._apiMapper.endpoints[CyncConstants.UPDATE_CASH_CONTROL_LIST].replace('{id}', this.cashControlId);

    let requestBody = {
      cash_control: {
        cash_control: this.cashControlForm.get('cash_control').value,
        description: this.cashControlForm.get('description').value

      }
    };
    this.cashControlService.updateCashControl(url, requestBody).subscribe(res => {
      let message: string = 'Cash Controls Updated Successfully.';
      this.helper.showApiMessages(message, 'success');
      this.navigateToControlListing();
    });

  }

  /**
  * This method will get data by passing cash control id
  */
  getCashControlDetails() {
    if (this.cashControlId !== undefined) {
      this.cashControlService.getCashControlDetail(this._apiMapper.endpoints[CyncConstants.UPDATE_CASH_CONTROL_LIST], this.cashControlId).subscribe(apiResponse => {

        this.cashCrontrolData = apiResponse as EditCashData;
        this.setCashControlForm();
      });
    }
  }

  /**
   * on click of save and new 
   */
  cashControlSaveNew() {
    let message: string = 'Cash Controls Saved Successfully.';
    var requestBody = {
      "cash_control": {
        "cash_control": this.cashControlForm.get('cash_control').value,
        "description": this.cashControlForm.get('description').value,
      }
    };
    let url = this._apiMapper.endpoints[CyncConstants.ADD_CASH_CONTROL_LIST];

    if (this.cashControlForm.get('cash_control').value === '') {
      let message: string = 'Please Enter Cash Control';
      this.helper.showApiMessages(message, 'delete');
    } else {
      this.cashControlService.addCashControl(url, requestBody).subscribe(res => {

        this.helper.showApiMessages(message, 'success');
      });
      this.navigateToAddCashControl();
    }
  }


  /**
   * This Method for cancel button functionality
   */
  navigateToControlListing() {
    this.router.navigateByUrl('otherGeneralCodes/cash-control');
  }


  /**
   * This Method for redirecting to add button
   */
  navigateToAddCashControl() {
    this.cashControlForm.reset();
    this.router.navigateByUrl('otherGeneralCodes/cash-control/add');
  }

  /**
  * Method to hightlight mandatory fileds if form validations fail
  * @param field 
  */
  displayCssField(field: string) {
    return this.helper.getFieldCss(field, this.cashControlForm);
  }

  /**
  * Get Form Control field
  * @param field 
  */
  getFormControl(field: string) {
    return this.cashControlForm.get(field);
  }

  /**
    * This Method is used to check if the current action is add
    */
  isCurrentActionAdd(): boolean {
    return this.helper.isCurrentActionAdd(this.currentAction);
  }

   /**
    * This Method is used to disable update button 
    */
  isFormValid(): boolean {    
    if(this.cashControlForm.pristine)
    {
      return true;
    }
    else {
      return false;
    }
  }
}
