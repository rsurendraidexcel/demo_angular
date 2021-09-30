import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ExceptionService } from '../service/exceptions.service';
import { Helper } from '@cyncCommon/utils/helper';
import { ExceptionDetail, LenderExceptionRequestBody, OperatorOrValueTypeListModel } from '../model/exceptions.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';

@Component({
    selector: 'manage-exception',
    templateUrl: './manage-exceptions.component.html'
})

/**
 * Exceptions For Other General Codes
 * @author Nagendra Kumar
 */
export class ManageExceptionsComponent {
    formDropDowns: OperatorOrValueTypeListModel;
    exceptionForm: FormGroup;
    operator: string = null;
    value_type: string = null;
    currentAction: string = CyncConstants.GET_ADD_ACTION;
    lenderExceptionId: any;
    currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
    saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
    cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button

    IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;

    /**
     * 
     * @param _exceptionService 
     * @param fb 
     * @param _helper 
     * @param route 
     * @param _apiMapper 
     * @param _router 
     * @param _messageService 
     */
    constructor(
        private _exceptionService: ExceptionService,
        private fb: FormBuilder,
        private _helper: Helper,
        private route: ActivatedRoute,
        private _apiMapper: APIMapper,
        private _router: Router,
        private _messageService: MessageServices
        ) {
    }

    /**
     * Init for component
     */
    ngOnInit() {
        this._helper.adjustUI();
        this.formDropDowns = new OperatorOrValueTypeListModel();
        this.initFormValidator();
        this.getOperatorDropDownOrValueType();
        this.getExceptionDetails();
    }

    /**
     * initializing form validator
     */
    initFormValidator() {
        this.exceptionForm = this.fb.group({
            display_label: new FormControl(null, Validators.compose([Validators.required])),//Exception Description
            description: new FormControl(null, Validators.compose([Validators.required])),//Exception Notes
            operator: new FormControl(null, ),//Exception Sign
            value_type: new FormControl(null, ),//Value Type
            exception_value: new FormControl(null),//Exception Value
            system_defined: new FormControl(false),//System
            add_to_all_clients: new FormControl(false, Validators.compose([])),//Auto All Clients
        });
    }

    /**
     * This method is used to get the Dropdown
     */
    getOperatorDropDownOrValueType() {
        this._exceptionService.getOperatorOrValueList(this._apiMapper.endpoints[CyncConstants.GETEXCEPTIONDROPDOWNORVALUETYPE]).subscribe(data => {
            this.formDropDowns = data;
        });
    }

    /**
    * This Method is used to check if the current action is add
    */
    isCurrentActionAdd(): boolean {
        return this._helper.isCurrentActionAdd(this.currentAction);
    }

    /**
     * This method will get data by passing exception id
     * @see https://s3.amazonaws.com/cync-raml/raml/admin_module.html#general_codes_lender_exceptions__id__get
     */
    getExceptionDetails() {
        this.route.params.subscribe(params => {
            this.lenderExceptionId = params['id'];
            if (this.lenderExceptionId !== undefined && !this._helper.isCurrentActionAdd(this.lenderExceptionId)) {
                this.currentAction = CyncConstants.GET_EDIT_ACTION;
                this._messageService.showLoader(true);
                this._exceptionService.getExceptionDetails(this._apiMapper.endpoints[CyncConstants.GET_EXCEPTION_DETAILS], this.lenderExceptionId).subscribe(apiResponse => {
                    this.exceptionForm.patchValue(apiResponse);
                    this._messageService.showLoader(false);
                    this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
                });
            } else {
                this.currentAction = CyncConstants.GET_ADD_ACTION;
            }
        });
    }

    /**
     * This method will save data by passing exception model 
     * @see https://s3.amazonaws.com/cync-raml/raml/admin_module.html#general_codes_lender_exceptions_post
     */
    saveExceptionDetail(model: ExceptionDetail, isValid: boolean, isNew: boolean, ) {
        let requestBody = new LenderExceptionRequestBody();
        requestBody.lender_exception = model;
        if (isValid) {
            if (this.isCurrentActionAdd()) {
                this.createLenderException(requestBody, isNew);
            } else {
                this.updateLenderException(requestBody)
            }
        }

    }

    /**
     * This method will add new exception , this will be a custom exception
     * @param model 
     * @param isValid 
     */
    createLenderException(requestBody: LenderExceptionRequestBody, isNew: boolean) {
        let message: string = 'Lender exception saved successfully.';
        //Only in case of save and new we need to show the loader because in other case the getdata method has loader
        this._messageService.showLoader(true);
        this._exceptionService.addlenderException(this._apiMapper.endpoints[CyncConstants.ADD_LENDER_EXCEPTION], requestBody).subscribe(res => {
            this._helper.showApiMessages(message, 'success');
            this._messageService.showLoader(false);
            if (!isNew) {
                this.navigateToExceptionListing();
            } else {
                this.exceptionForm.reset();
            }
        });
    }

    /**
     * This method will update the exception details for required exception id
     * @param model 
     */
    updateLenderException(requestBody: LenderExceptionRequestBody) {
        this._messageService.showLoader(true);
        this._exceptionService.updateLenderException(this._apiMapper.endpoints[CyncConstants.UPDATE_LENDER_EXCEPTION].replace('{id}', this.lenderExceptionId), requestBody).subscribe(res => {
            let message: string = 'Lender exception updated successfully.';
            this._helper.showApiMessages(message, 'success');
            this._messageService.showLoader(false);
            this.navigateToExceptionListing();
        });
    }

    /**
     * This Method for cancel button functionality
     */
    navigateToExceptionListing() {
        this._router.navigateByUrl('otherGeneralCodes/exceptions');
    }

    /**
   * Method to hightlight mandatory fileds if form validations fail
   * @param field 
   */
    displayCssField(field: string) {
        return this._helper.getFieldCss(field, this.exceptionForm);
    }

    /**
     * Get Form Control field
     * @param field 
     */
    getFormControl(field: string) {
        return this.exceptionForm.get(field);
    }

    isFormValid(): boolean {
        if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
            return !this.exceptionForm.valid;
        } else if (!this.isCurrentActionAdd() && CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
            // we have to disable form btn
            return !this.exceptionForm.valid || this.exceptionForm.pristine
        } else {
            // we dont have to disable btn
            return false;
        }
    }
}
