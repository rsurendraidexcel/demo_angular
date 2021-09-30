import { Component, OnInit, Renderer2, AfterViewInit, DoCheck } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Helper } from '@cyncCommon/utils/helper';
import { LoanAddNewComponent } from '../loan-add-new/loan-add-new.component';
import { InterestDetailComponent } from '../interest-detail/interest-detail.component';
import { LoanSetupService } from '../service/loan-setup.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import * as moment from 'moment-timezone';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Observable } from 'rxjs';
interface RolesPermision {
    action: string;
    action_id: number;
    action_label: string;
    enabled: boolean;
    role_permission_id: number;
}

@Component({
    selector: 'app-loan-setup',
    templateUrl: './loan-setup.component.html',
    styleUrls: ['./loan-setup.component.scss']
})
export class LoanSetupComponent implements OnInit, AfterViewInit, DoCheck {

    isbuttonActive: boolean;
    isbuttonCreateNew: boolean;
    isbuttonEdit: boolean;
    isUploadActive: boolean;
    isDeleteActive: boolean;
    editForm: boolean;
    isDocumentCloseActive: boolean;
    public loanTypes: any;
    public loanIds: any;
    clientId: any;
    public interestRateCodeDropDown: any;
    loanSetUpForm: FormGroup;
    ablLoanId: any;
    mclLoanId: any;
    loanTypeValue: any;
    hideabl: boolean;
    loanSetUpLoanId: any;
    linkHide: any;
    listFile = [];
    loanOriginationDate: any;
    loanSignedDate: any;
    loanMaturityDate: any;
    loanPaidOffDate: any;
    createNewNonAblId: any;

    loan_id: any;
    updateAblData: any;
    updateMclData: any;
    documentFile: any;
    updatedDocumentFile: any;
    deleteIndex: any;
    selectedFileIndex: any;
    editOn: boolean = false;
    hideAstrik: boolean = false;
    isLoanMapped: boolean = false;
    loanSetupRolePermission: RolesPermision[];
    customMappingFields: FormArray;
    custom_fields_attributes: any;
    customFieldsAttributeLov: any;
    listValue: any;
    
    //showABLUdfs: boolean = true;

    constructor(
        public helper: Helper,
        private loanSetupService: LoanSetupService,
        private render2: Renderer2,
        public dialog: MatDialog,
        private _apiMapper: APIMapper,
        private fb: FormBuilder,
        private message: MessageServices
    ) {
      
        this.isbuttonActive = false;
        this.isbuttonCreateNew = true;
        this.isbuttonEdit = true;
        this.isUploadActive = false;
        this.isDeleteActive = false;
        this.isDocumentCloseActive = false;
        this.linkHide = true;
        this.helper.getEditForm().subscribe((d) => this.editForm = d);
        this.getloanSetupRolesPermission();

    }

    ngOnInit() {

        $("#loanType").hide();
        $('#isUploadSection').hide();
        this.initFormValidator();
        this.helper.getClientID().subscribe((data) => {
            if (data != null && data != undefined) {
                this.clientId = data;
                this.getLoanTypesInfo(Number(data));
                this.getInterestRateCodeData(Number(data));
            } else {
                this.isbuttonCreateNew = false;
                this.isbuttonEdit = false;
            }
        });


        this.loanSetUpForm.disable();
        this.getCreateNewMclLoanId();
        // this.getAblLoanSetUpData();
    }
    ngAfterViewInit() {

    }
    ngDoCheck() {
        this.setDivScroll();

    }

    getloanSetupRolesPermission() {
        const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);
        const url = `roles/${userRoleId}/role_permissions/menu_specific_permissions?menu_name=loan_setup`;
        this.loanSetupService.getService(url).subscribe(resp => {
            let temRoleData = <RolesPermision[]>JSON.parse(resp._body);
            this.loanSetupRolePermission = temRoleData;
            console.log("Roles:", this.loanSetupRolePermission);
        });
    }

    checkRolsPermission(action: string): boolean {
        let result: boolean;
        if (this.loanSetupRolePermission !== undefined) {
            this.loanSetupRolePermission.forEach(el => {
                if (el.action_label === action) {
                    result = !el.enabled;
                }
            });
        }
        return result;
    }

    getCreateNewMclLoanId() {

        this.loanSetupService.getCreateNewMclLoanId().subscribe(data => {
            this.createNewNonAblId = data;
            this.getLoanTypesInfo(this.clientId);
            this.getInterestRateCodeData(this.clientId);
            this.mclLoanId = Number(this.createNewNonAblId.id);
            this.getMclLoanSetUpData(this.mclLoanId);
        });

    }

    initFormValidator() {
        this.isLoanMapped = false;
        this.loanSetUpForm = this.fb.group({
            loan_no: [''],
            loan_name: [''],
            loan_type: [''],
            credit_line_amt: [''],
            interest_rate_code_id: [''],
            rate_adjustment: [''],
            min_interest_rt: [''],
            max_interest_rt: [''],
            loan_signed_on_dt: [''],
            loan_origination_dt: [''],
            loan_maturity_dt: [''],
            loan_paid_off_dt: [''],
            active: true,
            documents: [''],
            add_to_bbc: true,
            is_loan_mapped: [''],
            ignore_cash_app_payments: [''],
            custom_fields: this.fb.array([])
        });
    }
    customFieldMapping() {
         this.customMappingFields = <FormArray>this.loanSetUpForm.controls.custom_fields;
        // console.log("before Custome udf mapping field::",  this.customMappingFields);
        if (this.custom_fields_attributes.length > 0 ) {
            // Clear All ForamArray Elements.
            this.delateAllFormArray(this.customMappingFields);

            this.custom_fields_attributes.forEach(elm => {
                if (elm.validation_type != 'LOV') {
                    (<FormArray>this.loanSetUpForm.controls.custom_fields).push(
                        this.fb.group({
                            udf_name: [elm.udf_name],
                            udf_value: [elm.udf_value],
                            validation_type: [elm.validation_type],
                            readonly_val: [elm.readonly_val],
                            id: [elm.id],
                            udf_id: [elm.udf_id],
                            attachable_type: [elm.attachable_type],
                            attachable_id: [elm.attachable_id],
                            loan_type: [elm.loan_type]
                        })
                    );
                }
                if (elm.validation_type === 'LOV') {
                    (<FormArray>this.loanSetUpForm.controls.custom_fields).push(
                        this.fb.group({
                            udf_name: [elm.udf_name],
                            udf_value: [elm.udf_value],
                            validation_type: [elm.validation_type],
                            readonly_val: [elm.readonly_val],
                            id: [elm.id],
                            udf_id: [elm.udf_id],
                            attachable_type: [elm.attachable_type],
                            attachable_id: [elm.attachable_id],
                            loan_type: [elm.loan_type]
                        })
                    );

                }
            });
        }
       // console.log("After Custome udf mapping field::",  this.customMappingFields);
        this.loanSetUpForm.get('custom_fields').disable();
    }

    // All DelatedArray FormArray
    delateAllFormArray(formArray: FormArray ){
         while (formArray.length !== 0) {
              formArray.removeAt(0);
            }
      }

    onFileSelect(event) {
        if (event.target.files.length > 0) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.listFile.push(event.target.files[i]);
            }

        } else {
            this.listFile.push(event.target.files[0]);
        }
    }
    removeFile(index: number) {
        this.listFile.splice(index, 1);
    }

    /**
    * get loan setup data if id is abl type
    * @param url 
    */
    getAblLoanSetUpData() {
        //let url2 = `borrowers/:borrower_id/loan_numbers`;
        const url = this._apiMapper.endpoints[CyncConstants.FETCH_LOAN_SETUP_ABL_ID_DATA].replace('{clientId}', this.clientId);
        this.loanSetupService.getAblLoanSetup(url).subscribe(resposList => {
            var data = <any>JSON.parse(resposList._body);
            // this.loanIds.map(resdata => {
            //     if (resdata.id === data.loan_number[0].id){
            //     return resdata.loan_no = data.loan_number[0].loan_no;
            //   }
            // });            
            this.loan_id = data.loan_number[0].id;
            this.custom_fields_attributes = data.loan_number[0].custom_fields_attributes ? data.loan_number[0].custom_fields_attributes : [];    
            //console.log("ABL API Custome Data", this.custom_fields_attributes);
            this.customFieldMapping();

            if (data.loan_number[0].documents.length > 0) {
                this.documentFile = data.loan_number[0].documents;
            } else {
                this.documentFile = [];
            }
            this.patchValues(data.loan_number[0]);
        });
    }

    patchValues(data: any) {
        this.hideabl = false;
        let loanTypeId = data.loan_type;
        let resp = this.loanTypes.filter((elm) =>  elm.loan_type === loanTypeId);
        this.isLoanMapped = false;

        this.loanSetUpForm.patchValue({
            loan_no: data.loan_no,
            loan_name: data.loan_name,
            loan_type: resp[0].id,
            credit_line_amt: this.helper.CurrencyCellRendererRoundOff(data.credit_line_amt),
            interest_rate_code_id: data.interest_rate_code_id === 0 || data.interest_rate_code_id === null ? 'null' : data.interest_rate_code_id,
            rate_adjustment: Number(data.rate_adjustment).toFixed(2),
            min_interest_rt: Number(data.min_interest_rt).toFixed(2),
            max_interest_rt: Number(data.max_interest_rt).toFixed(2),
            active: data.active,
            add_to_bbc: data.add_to_bbc,
            is_loan_mapped: data.is_loan_mapped,
            ignore_cash_app_payments: data.ignore_cash_app_payments,
           custom_fields: data.custom_fields_attributes
        });

        // DatePiker Bind
        this.loanSignedDate = data.loan_signed_on_dt === null ? '' : moment(data.loan_signed_on_dt).format("MM/DD/YYYY");
        this.loanOriginationDate = data.loan_origination_dt === null ? '' : moment(data.loan_origination_dt).format("MM/DD/YYYY");
        this.loanMaturityDate = data.loan_maturity_dt === null ? '' : moment(data.loan_maturity_dt).format("MM/DD/YYYY");
        this.loanPaidOffDate = data.loan_paid_off_dt === null ? '' : moment(data.loan_paid_off_dt).format("MM/DD/YYYY");

    }
    
    patchValuesnonabl(data) {
        this.hideabl = true;
        if (data.is_loan_mapped){
          if (this.editOn) {
            this.isLoanMapped = true;
          }else{
            this.isLoanMapped = false;
          }
        }else{
          this.isLoanMapped = false;
        }
        this.loanSetUpForm.patchValue({
            loan_no: data.loan_no,
            loan_name: data.loan_name,
            loan_type: data.loan_type,
            credit_line_amt: this.helper.CurrencyCellRendererRoundOff(data.credit_line_amt),
            interest_rate_code_id: data.interest_rate_code_id === 0 || data.interest_rate_code_id === null ? 'null' : data.interest_rate_code_id,
            rate_adjustment: Number(data.rate_adjustment).toFixed(2),
            min_interest_rt: Number(data.min_interest_rt).toFixed(2),
            max_interest_rt: Number(data.max_interest_rt).toFixed(2),
            active: data.active,
            add_to_bbc: data.add_to_bbc,
            is_loan_mapped: data.is_loan_mapped,
            ignore_cash_app_payments: data.ignore_cash_app_payments,
            custom_fields_mcl: data.custom_fields_attributes
        });
        // DatePiker Bind
        this.loanSignedDate = data.loan_signed_on_dt === null ? '' : moment(data.loan_signed_on_dt).format("MM/DD/YYYY");
        this.loanOriginationDate = data.loan_origination_dt === null ? '' : moment(data.loan_origination_dt).format("MM/DD/YYYY");
        this.loanMaturityDate = data.loan_maturity_dt === null ? '' : moment(data.loan_maturity_dt).format("MM/DD/YYYY");
        this.loanPaidOffDate = data.loan_paid_off_dt === null ? '' : moment(data.loan_paid_off_dt).format("MM/DD/YYYY");;
    }

    onChangeLoanIds(event:any) {
         var id = event.target.value;
         var ltype = $(event.target.selectedOptions).attr("data-category-type");  
         var resp = this.loanIds.filter((elm) => {
            return elm.id == event.target.value && elm.loan_type==ltype;
        });
        console.log("Filter LoandIds::", resp);
        this.loanTypeValue = resp[0].loan_type;
        this.loanSetUpLoanId = event.target.value;
        if (resp[0].loan_type === "ABL") {
            this.hideabl = true;
            this.hideAstrik = false;
            this.loanSetUpForm.controls['active'].disable();
            this.loanSetUpForm.controls['loan_type'].disable();
            this.loanSetUpForm.controls['add_to_bbc'].disable();
            this.isDeleteActive = false;
            this.isLoanMapped = false;
            this.getAblLoanSetUpData();
        }
        else {
            this.hideAstrik = true;
            this.hideabl = false;
            this.isDeleteActive = true;
            if (this.editOn) {
                this.loanSetUpForm.controls['active'].enable();
                this.loanSetUpForm.controls['loan_type'].enable();
                if (this.loanIds.filter((elm) =>  elm.id === Number(this.loan_id))[0].is_loan_mapped){
                    this.isLoanMapped = true;
                    this.loanSetUpForm.controls['add_to_bbc'].disable();
                }else{
                  this.isLoanMapped = false;
                  this.loanSetUpForm.controls['add_to_bbc'].enable();
                }
            }

            this.getMclLoanSetUpData(id);
        }
    }

    /**
    * get loan setup data if id is mcl type
    * @param url 
    */
    getMclLoanSetUpData(mclLoanid: any) {
        this.mclLoanId = mclLoanid;
        //let url2 = `loan_numbers/fetch_specific_non_abl_loan?borrower_id=269&loan_id=66`;
        const url = this._apiMapper.endpoints[CyncConstants.FETCH_LOAN_SETUP_MCL_ID_DATA].
            replace('{clientId}', this.clientId).replace('{mclLoanId}', this.mclLoanId);
        this.loanSetupService.getMclLoanSetup(url).subscribe(resposList => {
            var data = <any>JSON.parse(resposList._body);
            this.loanIds.map(resdata => {
                if (resdata.id === data.id){
                return resdata.loan_no = data.loan_no;
              }
            });
            
            if(data){
                this.custom_fields_attributes = data.custom_fields_attributes ? data.custom_fields_attributes : [];
                console.log("MCL API Custome Data::", this.custom_fields_attributes);
                this.customFieldMapping();
                if (data.documents.length > 0) {
                    this.documentFile = data.documents;
                } else {
                    this.documentFile = [];
                }
                this.patchValuesnonabl(data);
              }
        });

    }

       
    getLoanTypesInfo(id: number) {
        let url1 = `borrowers/${id}/loan_numbers`;
        let url2 = `non_abl_loan_types/get_all_non_abl_loan_types`;
        let url3 = `loan_numbers/all_loan_number?borrower_id=${id}`;

        this.loanSetupService.getloanTypes(url1, url2, url3).subscribe(resposList => {
            let loanNumber = resposList[0].loan_number;
            console.log("loanNumber", loanNumber);
            this.loanTypeValue = loanNumber[0].loan_type;
            this.loanSetUpLoanId = loanNumber[0].id;
            this.mclLoanId = loanNumber[0].id;
            let nonABLloanType = resposList[1].non_abl_loan_types;
            let loanNuberIdes = resposList[2];
            console.log("All API Data::", resposList);
            let temLonIdesTypes = [];
            let temLonType = [];
            // this.orderList(resposList,resposList[0].position);
            if (loanNumber[0].documents.length > 0) {
                this.documentFile = loanNumber[0].documents;
            } else {
                this.documentFile = [];
            }

            if (loanNumber.length == 1) {
                temLonIdesTypes.push({ id: loanNumber[0].id, loan_no: loanNumber[0].loan_no, loan_type: loanNumber[0].loan_type });
                temLonType.push({ id: loanNumber[0].id, loan_type: loanNumber[0].loan_type });
            }
          let selectedLoan;
          let ablPosition = resposList[0].position;
          if (ablPosition === 'last'){
            this.loanIds = loanNuberIdes.concat(temLonIdesTypes);
            this.loan_id = this.loanIds[0].id;
          if (resposList[2].length !=0){
            selectedLoan = resposList[2][0];
            this.loanTypeValue = resposList[2][0].loan_type;
          }else{
            selectedLoan = resposList[0].loan_number[0];
            this.loanTypeValue = resposList[0].loan_number[0].loan_type;
        }
          }else{
            this.loanIds = temLonIdesTypes.concat(loanNuberIdes);
            this.loan_id = this.loanIds[0].id;

            selectedLoan = resposList[0].loan_number[0];
            this.loanTypeValue = resposList[0].loan_number[0].loan_type;
          }

          
           
            this.loanTypes = temLonType.concat(nonABLloanType);
            console.log("DropDown-Array::", this.loanIds);
            if (this.createNewNonAblId !== undefined) {
                this.loan_id = Number(this.createNewNonAblId.id);
                this.mclLoanId = Number(this.createNewNonAblId.id);
                this.loanTypeValue = 1;
                if (this.createNewNonAblId.documents.length !== 0) {
                    this.documentFile = this.createNewNonAblId.documents;
                } else {
                    this.documentFile = [];
                }
                this.isDeleteActive = true;
                this.patchValuesnonabl(this.createNewNonAblId);
                this.createNewNonAblId = undefined;

            } else if (this.updateMclData !== undefined) {
                this.loan_id = this.updateMclData.id;
                this.mclLoanId = this.updateMclData.id;
              
            } else if (this.updateAblData){
                this.loan_id = resposList[0].id;
                this.getAblLoanSetUpData();
                this.loanTypeValue = resposList[0].loan_number[0].loan_type;
                this.updateAblData = null;
            }   
            else {
                if (ablPosition === 'last'){
                    if (resposList[2].length !=0){
                        this.getMclLoanSetUpData(selectedLoan.id);
                    }else{
                       this.getAblLoanSetUpData();
                    }
                }else{
                    this.getAblLoanSetUpData();
                     }
            }

        });
    }

    /**
     * method to get all the values of interest rate code dropdown
     */
    getInterestRateCodeData(id: number) {
        const url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_RATE_DROPDOWN_LIST].replace('{clientId}', id);
        this.loanSetupService.getInterestRateCode(url).subscribe(response => {
            let tempInterestRateCodeType = <any>JSON.parse(response._body);
            this.interestRateCodeDropDown = tempInterestRateCodeType.interest_rate_codes;
        });
    }

    openInterestDetailsDialog() {
        const dialogRef = this.dialog.open(InterestDetailComponent, {
            disableClose: true,
            height: '85vh',
            width: "873px",
            data: { loan_type: this.loanTypeValue, load_id: this.loan_id }
        });
    }

    setDivScroll(): void {
        const win = window;
        let [w, h] = this.helper.setInternalDivisionScroll();
        const pageLayout = document.getElementById("cync-page-layout");
        const selectDiv = document.getElementById("innerDiv-scroll");
        let wh = (h - 210);
        win.onresize = () => {
            this.render2.setStyle(pageLayout, 'height', `${wh}px`);
            this.render2.setStyle(selectDiv, 'height', `${wh - 85}px`);
        }
        this.render2.setStyle(pageLayout, 'height', `${wh}px`);
        this.render2.setStyle(selectDiv, 'height', `${wh - 85}px`);
    }

    onClickEdit() {
        this.editOn = true;
        $('#isUploadSection').show();
        this.isDocumentCloseActive = true;
        this.helper.setEditForm(true);

        this.linkHide = false;
        this.isbuttonCreateNew = false;
        this.isbuttonActive = true;
        this.isbuttonEdit = false;
        this.listFile = [];
        this.isUploadActive = true;

        if (this.loanTypeValue === 'ABL') {
            this.isLoanMapped = false;
            this.isDeleteActive = false;
            this.loanSetUpForm.controls['loan_type'].disable();
            this.loanSetUpForm.controls['rate_adjustment'].disable();
            this.loanSetUpForm.controls['active'].disable();
            this.loanSetUpForm.controls['loan_paid_off_dt'].disable();
            this.loanSetUpForm.controls['loan_no'].enable();
            this.loanSetUpForm.controls['loan_name'].enable();
            this.loanSetUpForm.controls['credit_line_amt'].enable();
            this.loanSetUpForm.controls['interest_rate_code_id'].enable();
            this.loanSetUpForm.controls['min_interest_rt'].enable();
            this.loanSetUpForm.controls['max_interest_rt'].enable();
            this.loanSetUpForm.controls['loan_signed_on_dt'].enable();
            this.loanSetUpForm.controls['loan_origination_dt'].enable();
            this.loanSetUpForm.controls['loan_maturity_dt'].enable();
            this.loanSetUpForm.controls['ignore_cash_app_payments'].enable();
            this.loanSetUpForm.controls['documents'].enable();
            this.enableDisableUdfValue();
        } else {

            this.isDeleteActive = true;
            this.loanSetUpForm.controls['rate_adjustment'].disable();
            this.loanSetUpForm.controls['loan_paid_off_dt'].disable();
            this.loanSetUpForm.controls['loan_no'].enable();
            this.loanSetUpForm.controls['loan_name'].enable();
            this.loanSetUpForm.controls['credit_line_amt'].enable();
            this.loanSetUpForm.controls['interest_rate_code_id'].enable();
            this.loanSetUpForm.controls['min_interest_rt'].enable();
            this.loanSetUpForm.controls['max_interest_rt'].enable();
            this.loanSetUpForm.controls['loan_signed_on_dt'].enable();
            this.loanSetUpForm.controls['loan_origination_dt'].enable();
            this.loanSetUpForm.controls['loan_maturity_dt'].enable();
            this.loanSetUpForm.controls['ignore_cash_app_payments'].enable();
            if (this.loanIds.filter((elm) =>  elm.id === Number(this.loan_id))[0].is_loan_mapped){
                this.isLoanMapped = true;
                this.loanSetUpForm.controls['add_to_bbc'].disable();
            }else{
              this.isLoanMapped = false;
              this.loanSetUpForm.controls['add_to_bbc'].enable();
            }
            this.loanSetUpForm.controls['active'].enable();
            this.loanSetUpForm.controls['loan_type'].enable();
            this.loanSetUpForm.controls['documents'].enable();
            this.enableDisableUdfValue();
        }

    }
    onClickCancel() {
        this.editOn = false;
        this.helper.setEditForm(false);
        const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to lose the changes?' }
        this.helper.openConfirmPopup(popupParams).subscribe(result => {
            if (result == true) {
                this.linkHide = true;
                $('#isUploadSection').hide();
                this.isDocumentCloseActive = false;
                this.isbuttonCreateNew = true;
                this.isbuttonEdit = true;
                this.isbuttonActive = false;
                this.loanSetUpForm.disable();
                this.helper.setEditForm(false);
                this.getLoanTypesInfo(this.clientId);
            }
        });
    }

    onClickCreateNew() {
        const dialogRef = this.dialog.open(LoanAddNewComponent, {
            height: '80vh',
            width: "90vw",
            maxWidth: '90vw',
            autoFocus: false,
            disableClose: true,
            data: { customFields: this.custom_fields_attributes, loan_type: this.loanTypeValue }
        });

    }

    onClickDelete() {
        const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to delete the loan?' }
        this.helper.openConfirmPopup(popupParams).subscribe(result => {
            if (result == true) {
                this.message.showLoader(true);
                let url = `loan_numbers/${this.loan_id}`;
                this.loanSetupService.deleteMclLoanDataService(url).subscribe(response => {
                    const message = 'Loan deleted successfully and triggered BBC recalculation';
                    this.helper.showApiMessages(message, 'success');
                    this.bbcRecalculateAction();
                    this.getLoanTypesInfo(this.clientId);
                    this.getInterestRateCodeData(this.clientId);
                    this.loanSetUpForm.disable();
                    $('#isUploadSection').hide();
                    this.isDocumentCloseActive = false;
                    this.isbuttonCreateNew = true;
                    this.isbuttonEdit = true;
                    this.isbuttonActive = false;
                    this.message.showLoader(false);

                }, (error) => {
                    let tempErrorResponse = JSON.parse(error._body);
                    this.message.cync_notify("error", `${tempErrorResponse.error}`, 3000);
                });
            }
        });
    }

    // After Delated mcl Loan  this method has to trigger
    bbcRecalculateAction() {
        let url = `borrowers/${this.clientId}/recalculate_bbc_after_loan_destroy`;
        this.loanSetupService.getbbcRecalculate(url).subscribe(respose => {
            console.log("BBC ReCalculate::", respose);
        });

    }
    // update abl loan post method
    updateAblLoanPostData(): FormData {
        const formData = new FormData();
        if (this.loanSetUpForm.get('add_to_bbc').value === true) {
            this.loanSetUpForm.controls['add_to_bbc'].setValue('1');
        }
        else {
            this.loanSetUpForm.controls['add_to_bbc'].setValue('0');
        }
        if (this.loanSetUpForm.get('ignore_cash_app_payments').value === true) {
            this.loanSetUpForm.controls['ignore_cash_app_payments'].setValue('1');
        }
        else {
            this.loanSetUpForm.controls['ignore_cash_app_payments'].setValue('0');
        }

        // Common FormdataObject Append value

        formData.append("loan_number[loan_no]", this.loanSetUpForm.get('loan_no').value);
        formData.append("loan_number[loan_name]", this.loanSetUpForm.get('loan_name').value);
        formData.append("loan_number[borrower_id]", this.clientId);
        formData.append("loan_number[menu_id]", '');

        let creditAmount = this.ungroupCommaNumber(this.loanSetUpForm.get('credit_line_amt').value);

        formData.append("loan_number[credit_line_amt]", Number(creditAmount).toFixed(2));
        formData.append("loan_number[interest_rate_code_id]", this.loanSetUpForm.get('interest_rate_code_id').value);
        formData.append("loan_number[min_interest_rt]", this.loanSetUpForm.get('min_interest_rt').value);
        formData.append("loan_number[max_interest_rt]", this.loanSetUpForm.get('max_interest_rt').value);
        formData.append("loan_number[loan_signed_on_dt]", this.loanSetUpForm.get('loan_signed_on_dt').value === '' ? '' : moment(this.loanSetUpForm.get('loan_signed_on_dt').value).format("MM/DD/YYYY"));
        formData.append("loan_number[loan_origination_dt]", this.loanSetUpForm.get('loan_origination_dt').value === '' ? '' : moment(this.loanSetUpForm.get('loan_origination_dt').value).format("MM/DD/YYYY"));
        formData.append("loan_number[loan_maturity_dt]", this.loanSetUpForm.get('loan_maturity_dt').value === '' ? '' : moment(this.loanSetUpForm.get('loan_maturity_dt').value).format("MM/DD/YYYY"));
        formData.append("loan_number[add_to_bbc]", this.loanSetUpForm.get('add_to_bbc').value);
        formData.append("loan_number[ignore_cash_app_payments]", this.loanSetUpForm.get('ignore_cash_app_payments').value);

        for (let k = 0; k < this.listFile.length; k++) {
            formData.append(`loan_number[document_files_attributes][file_${k}]`, this.listFile[k], this.listFile[k].name);
        }
        return formData;
    }

    onClickUpdate() {
        const formData = this.updateAblLoanPostData();
        if (this.loanTypeValue === 'ABL') {
            this.message.showLoader(true);
            formData.append("loan_number[loan_type]", 'undefined');
            formData.append("loan_number[non_abl_loan_type_id]", 'undefined');
            formData.append("loan_number[active]", this.loanSetUpForm.get('active').value);
            
            //Call Custome Attribute fromData
            this.customAttributeFormDataList(formData);
            let url = this._apiMapper.endpoints[CyncConstants.UPDATE_ABL_LOAN].replace('{clientId}', this.clientId).replace('{ablLoanId}', this.loanSetUpLoanId);
            this.loanSetupService.updateAblLoan(url, formData).subscribe(res => {
                var data = <any>JSON.parse(res._body);
                this.updateAblData = true;
                this.getLoanTypesInfo(this.clientId);
                this.getInterestRateCodeData(this.clientId);
                this.getMethods();
                // this.getAblLoanSetUpData();
                // this.loanSetUpForm.get('custom_fields').setValue([]);
            });

        }
        else {
            this.message.showLoader(true);
            formData.append("loan_number[loan_type]", this.loanSetUpForm.get('loan_type').value);
            formData.append("loan_number[active]", this.loanSetUpForm.get('active').value);
            formData.append("loan_number[non_abl_loan_type_id]", this.loanSetUpForm.get('loan_type').value);
            formData.delete('loan_number[ignore_cash_app_payments]');

              // Call Custome Attribute fromData
              this.customAttributeFormDataList(formData);

            let url = this._apiMapper.endpoints[CyncConstants.UPDATE_MCL_LOAN].
                replace('{clientId}', this.clientId).replace('{mclLoanId}', this.loan_id);
            this.loanSetupService.updateMclLoan(url, formData).subscribe(res => {
                var data = <any>JSON.parse(res._body);
                this.updateMclData = data;
                this.patchValuesnonabl(this.updateMclData);
                this.updateMclData = undefined;
                this.getMethods();
                this.getMclLoanSetUpData(this.loan_id);
                // this.loanIds.forEach(element => {
                //     if (element.id == this.loan_id) element.loan_no = data.loan_no;
                // });
            });
        }
    }

    getMethods() {
        this.loanSetUpForm.disable();
        this.isbuttonActive = false;
        this.isbuttonCreateNew = true;
        this.isbuttonEdit = true;
        this.isUploadActive = false;

        this.editOn = false;
        this.linkHide = true;
        this.helper.setEditForm(false);

        $('#isUploadSection').hide();
        this.isDocumentCloseActive = false;
        const message = 'Loan Updated Successfully';
        this.helper.showApiMessages(message, 'success');
        this.message.showLoader(false);
    }

    onClickDocumentFileDelete(index: number) {
        this.deleteIndex = index;
        if (this.loanTypeValue === 'ABL') {
            let url = `document_files/${this.documentFile[index].id}`;
            this.loanSetupService.deleteAblFileDocumentService(url).subscribe(response => {
                const message = 'File Deleted successfully';
                this.helper.showApiMessages(message, 'success');
                this.documentFile.splice(this.deleteIndex, 1);
            });

        } else {
            let url = `document_files/${this.documentFile[index].id}`;
            this.loanSetupService.deleteMclFileDocumentService(url).subscribe(response => {
                const message = 'File Deleted successfully';
                this.helper.showApiMessages(message, 'success');
                this.documentFile.splice(this.deleteIndex, 1);
            });
        }
    }

    ungroupCommaNumber(num: any): number {
        let result = num.split(",").join("");
        return Number(result);
    }

    // CustomAttribute FormData  Initialization
    customAttributeFormDataList(fd: FormData){ 
     if(this.custom_fields_attributes.length > 0 ){
       let listCustomAttribute = <any>[];
       (<FormArray>this.loanSetUpForm.controls.custom_fields).controls.forEach((el,index) => {
                    let eachControlData = {}; 
                if( el.get('validation_type').value !='LOV'){
                            eachControlData = {
                                "attachable_id": el.get('attachable_id').value,
                                "attachable_type": el.get('attachable_type').value,
                                "id": el.get('id').value,
                                "udf_id": el.get('udf_id').value,
                                "readonly_val": el.get('readonly_val').value,
                                "loan_type": el.get('loan_type').value,
                                "udf_name": el.get('udf_name').value,
                                "udf_value": el.get('udf_value').value,
                                "validation_type": el.get('validation_type').value
                            };
                        } else {
                            eachControlData = {
                                "attachable_id": el.get('attachable_id').value,
                                "attachable_type": el.get('attachable_type').value,
                                "id": el.get('id').value,
                                "udf_id": el.get('udf_id').value,
                                "readonly_val": el.get('readonly_val').value,
                                "loan_type": el.get('loan_type').value,
                                "udf_name": el.get('udf_name').value,
                                "udf_value": el.get('udf_value').value,
                                "validation_type": el.get('validation_type').value
                            };
                        }
                   listCustomAttribute.push(eachControlData);
                });

                fd.append("loan_number[custom_fields_attributes]",JSON.stringify(listCustomAttribute));
                //console.log("loan_number[custom_fields_attributes]", JSON.stringify(listCustomAttribute)); 
            }     

    }

//EnableDisable formData
 enableDisableUdfValue() {
        (<FormArray>this.loanSetUpForm.get('custom_fields')).controls.forEach((elm, index) => {
            if (elm.get('validation_type').value != "LOV") {
                if (elm.get('readonly_val').value===false) {
                    elm.get('udf_value').enable();
                }
            } else {
                if (elm.get('readonly_val').value===false) {
                    elm.get('udf_value').enable();
                }
            }
        }); 

      }
 
}
