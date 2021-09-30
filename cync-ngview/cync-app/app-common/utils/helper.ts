import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PopupsComponent } from '@cyncCommon/component/popups/popups.component';
import { FormGroup } from '@angular/forms';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import * as moment from 'moment-timezone';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { ColumnDefinition } from '@cyncCommon/component/grid/grid.model';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class Helper {
    globalErrorMsg = true;
    tempScrollValue = 0;
    allMenuPermission: Map<string, string> = new Map<string, string>();
    menuPermissionArray: any;
    roleId: string;

    public selectedUserAndClient = new Subject();

    public editForm = new BehaviorSubject(false);
    public clientId = new BehaviorSubject(`${localStorage.getItem('selectedClient')}`);

    constructor(private dialogRef: MatDialog, private _apiMessageService: APIMessagesService, private _router: Router) {
    }

    public setClientID(clientId: string) {
        this.clientId.next(clientId);
    }
    public getClientID() {
        return this.clientId.asObservable();
    }
    public setEditForm(status: boolean){
        this.editForm.next(status);
    }
    public getEditForm() {
        return this.editForm.asObservable();
    }

    public setSelectedUserAndClient(userAndClient: any){
        this.selectedUserAndClient.next(userAndClient); 
    }
    public getSelectedUserAndClient() {
        return this.selectedUserAndClient.asObservable();
    }

    alertMessge(){
        const elm = document.createElement("div");
        elm.id="poupu-alert-confirm";
        elm.className="poupu-alert-confirm";
        elm.innerHTML = `<div class="popup-alert-box"> 
            <div class="title"> Warning </div>
            <div class="hrline"></div>
            <div class="alert-content">
            <br/>
            Changes made have not been saved yet. <br/>
            Please click on 'Save' or 'Cancel' in order to proceed.
            </div>
            <div class="alert-footer">
            <button onclick='document.getElementById("poupu-alert-confirm").remove();' class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn">OK</button>
            </div>
        </div>`;
        document.body.appendChild(elm);
    }  
     // Flash Message 
     showFlashMessage(message: string, title: string){
        const elm = document.createElement("div");
        elm.id="poupu-alert-confirm";
        elm.className="poupu-alert-confirm";
        elm.innerHTML = `<div class="popup-alert-box"> 
            <div class="title"> ${title} </div>
            <div class="hrline"></div>
            <div class="alert-content">
            <br/>
            ${message}
             <br/>
            </div>
            <div class="alert-footer">
            <button onclick='document.getElementById("poupu-alert-confirm").remove();' class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn">Cancel</button>
            </div>
        </div>`;
        document.body.appendChild(elm);
    } 
  
    /**
     * format date object into string
     * @param date
     */
    formatDate(date): string {
        let now = new Date(date);
        let offSet = -300;
        now.setTime(now.getTime() + offSet * 60 * 1000);
        let now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        let month = '' + (now_utc.getMonth() + 1);
        let day = '' + now_utc.getDate();
        let year = now_utc.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [month, day, year].join('/');
    }

    /**
     *
     * @param menuMap
     */
    public setMenuPermissions(menuMap: Map<string, string>) {
        this.allMenuPermission = menuMap;
    }

    /**
     *
     * @param menuName
     * @param actionType
     */
    checkPermissionForMenu(menuName: string, actionType: string): boolean {
        let menuPermissionArray: any[] = [];
        menuPermissionArray = JSON.parse(this.allMenuPermission.get(menuName));
        if (menuPermissionArray.length > 0) {
            for (let i = 0; i < menuPermissionArray.length; i++) {
                if (menuPermissionArray[i].action == actionType) {
                    return menuPermissionArray[i].enabled;
                }
            }
        }
    }

    /**
     * my local token to run angular application
     */
    getMyLocalToken(): string {
        return 'OXdLZzI1em83aEoya0xzamw0Vmt3Zmo2Vmc5NEc3bnFoVERjVXhhdTFYblJZaDkyNmgwelIra2V5bmFUNUNwY2RVN3pwSStsak5XeWNUNkFRak9zT0E9PS0tV2lFTFNUeWlOZTc2MWM1N1h3WVUyZz09--4ae34fdd51b1cd11f85c1c8cc4bb49cabc192c3b';
    }

    /**
     * this method will check if user has done focus on field but
     * has not entered anything
     * @param field
     * @param form
     */
    isFieldValid(field: string, form: FormGroup): boolean {
        return !form.get(field).valid && form.get(field).touched;
    }


    /**
     * this method will return the css to highlight the input filed if validation
     * fails
     * @param field
     * @param form
     */
    getFieldCss(field: string, form: FormGroup) {
        return {
            'input-highlight': this.isFieldValid(field, form)
        };
    }

    /**
     * this method will open the cofirm popup and return what user has clicked
     * either yes or no
     * @param title
     * @param message
     */
    openConfirmPopup(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isConfirmPopup = true;
        return dialogRef.afterClosed();
    }

    /**
     * this method will open popup when ABL file upload is successfull.
     * @param popupParams
     */
    openFileUploadSuccessPopup(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isFileUploadPopup = true;
        return dialogRef.afterClosed();
    }

    /**
    * this method will open popup when ABL file upload is successfull.
    * @param popupParams
    */
    openInformationPopup(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isInformationPopUp = true;
        return dialogRef.afterClosed();
    }

    /**
     * this method will open popup when ABL file upload is successfull.
     * @param popupParams
     */
    openCommentHistoryPopup(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isCommentHistoryPopup = true;
        return dialogRef.afterClosed();
    }

    /**
    * this method will open the cofirm popup for cashflow validation and return what user has clicked
    * either Modified or override
    * @param title
    * @param message
    */
    cashFlowPopup(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent, {
            disableClose: true,
            hasBackdrop: true // or false, depending on what you want
        });
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isCashFlowPopup = true;
        return dialogRef.afterClosed();
    }

    /**
     * this method will just open a alert message.
     * @param title
     * @param message
     */
    openAlertPoup(title: string, message: string) {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.isAlertMessage = true;
        return dialogRef.afterClosed();
    }
    /**
     * this method will open the cofirm popup and return what user has clicked
     * either yes or no
     * @param title
     * @param message
     */
    saveFacoringFeeSetupPop(popupParams: any): Observable<any> {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = popupParams.title;
        dialogRef.componentInstance.message = popupParams.message;
        dialogRef.componentInstance.isSaveFeeSetupPopup = true;
        return dialogRef.afterClosed();
    }

    /**
     *
     * @param file
     * @param expectedFileFormat
     */
    isFileExtensionValid(file: File, expectedFileFormat: string[]): boolean {
        let keepgoing = true;
        let uploaded_file_extn = file.name.split(".").pop();
        for (let i = 0; i < expectedFileFormat.length; i++) {
            if (!this.compareIgnoreCase(uploaded_file_extn, expectedFileFormat[i]) && !expectedFileFormat.includes(uploaded_file_extn)) {
                this.openAlertPoup('warning_msg', 'please select only ' + expectedFileFormat + ' file !');
                keepgoing = false;
                break;
            }
        }
        return keepgoing;
    }

    /**
     *
     * @param file
     * @param zipExtension
     */
    isFileHaveZIPExtension(file: File, zipExtension: string) {
        let uploaded_file_extn = file.name.split(".").pop();
        if (!this.compareIgnoreCase(uploaded_file_extn, zipExtension)) {
            this.openAlertPoup('warning_msg', 'please upload images in ' + zipExtension + ' format ');
            return false;
        }
        return true;
    }

    /**
     * Method to Convert a string to number
     * @param msg
     * @param type
     */
    showApiMessages(msg: string, type: string) {
        this._apiMessageService.add(new APIMessage(type, msg));
    }

    /**
     * On Init, call this method to adjust the UI
     */
    adjustUI() {
        $("#cync_app_dashboard").removeClass("loading-modal-initial");
        this.setHeight();
    }

    /**
     * Method to Convert Date to String[format: 'mm/dd/yyyy']
     * @param inputDate
     */
    convertDateToString(inputDate: Date): string {
        return moment(inputDate, CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone()).format(CyncConstants.DATE_FORMAT);
    }

    /**
     * Method to Convert Date to String[format: 'mm-dd-yyyy']
     * @param inputDate
     */
    convertDateToStringDifferentFormat(inputDate: Date): string {
        return moment(inputDate, CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone()).format(CyncConstants.REPORT_FILE_DATE_FORMAT);
    }

    /**
     * Method to Convert Date to String[format: 'mm/dd/yyyy']
     * @param inputDate
     */
    convertDateToStringWithoutTz(inputDate: Date): string {
        return moment(inputDate, CyncConstants.DATE_FORMAT).format(CyncConstants.DATE_FORMAT);
    }

    /**
     * Method to Convert String to Date
     * @param inputDateString
     */
    convertStringToDate(inputDateString: string): Date {
        let dateObj = moment(inputDateString, CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone());
        return moment(dateObj, CyncConstants.DATE_FORMAT).toDate();
    }

    /**
     * Method to Convert String to Date
     * @param inputDateString
     */
    convertStringToDateWithoutTz(inputDateString: string): Date {
        let dateObj = moment(inputDateString, CyncConstants.DATE_FORMAT);
        return moment(dateObj, CyncConstants.DATE_FORMAT).toDate();
    }

    /**
     * This method will return current date according to lender time zone
     */
    getCurrentDate(): Date {
        return moment().tz(CyncConstants.getLenderTimezone()).toDate();
    }

    /**
     * Note: This method is deprecated and will be removed in the next major version.
     * Alternate method will be -> app.component.ts -> ResponsiveHeight method.
     * On Init, call this method to set the page height
     */
    setHeight() {
        var appbody_cont = window.innerHeight;
        $(window).resize(function () {
            appbody_cont = window.innerHeight;
            if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
            if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
            if (document.getElementById("dialog")) { document.getElementById('dialog').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
        })
        if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
        if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }

        setTimeout(function () {
            if (document.getElementById("dialog")) { document.getElementById('dialog').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
        }, 50)
    }

    /**
     * Method to replace query parameters in a endpoint
     *  @param apiEndPoint* @param queryParam
     *  @param paramValue
     */
    replaceEndpointQueryParameters(apiEndPoint: string, queryParam: any, paramValue: any): string {
        apiEndPoint = apiEndPoint.replace(queryParam, paramValue);
        return apiEndPoint;
    }
    /**
     * Method to Convert a string to number*
     * @param inputString
     */
    convertStringToNumber(inputString: string): number {
        return parseInt(inputString);
    }


    /**
     * This method is used to compare two strings ignoring case
     * @param str1
     */
    compareIgnoreCase(str1: string, str2: string): boolean {
        let isEqual = false;
        if (str1 != undefined && str1 != null && str2 != null && str2 != undefined && str1.toLowerCase() == str2.toLowerCase()) {
            isEqual = true;
        }
        return isEqual;
    }

    /**
     * This method is used to identify if current action is add
     * @param currentAction
     */
    isCurrentActionAdd(currentAction: string): boolean {
        if (typeof currentAction !== 'string') {
            currentAction = JSON.stringify(currentAction);
        }
        return this.compareIgnoreCase(currentAction, CyncConstants.ADD_OPERATION);
    }

    /**
     * This method is used to identify if current action is edit
     * @param currentAction
     */
    isCurrentActionEdit(currentAction: string): boolean {
        return this.compareIgnoreCase(currentAction, CyncConstants.EDIT_OPERATION);
    }


    /**
     * Method to get all the selected record names
     * @param selectedRecordsArray
     * @param key
     */
    getRecordNamesOrRecordIds(selectedRecordsArray: any[], key: string): string {
        let tmpRecords: any[] = [];
        if (selectedRecordsArray.length > 0) {
            if (selectedRecordsArray.length == 1) {
                let keyName: string = selectedRecordsArray[0][key];
                //console.log(":::keyName---", keyName);
                return keyName;
            } else {
                selectedRecordsArray.forEach((data) => {
                    tmpRecords.push(data[key]);
                });
            }
        }

        if (tmpRecords.length > 0) {
            //console.log(":::all keyNames---", tmpRecords.join(','));
            return tmpRecords.join(',');
        }
        return CyncConstants.BLANK_STRING;
    }

    /**
     * Method to get the Permission object based on action type(like create,update,destroy) from permissions array
     * @param menuPermissionsArray
     * @param actionType
     */
    getPermissionObject(menuPermissionsArray: any[], actionType: string): UserPermission {
        if (menuPermissionsArray.length > 0) {
            for (let i = 0; i < menuPermissionsArray.length; i++) {
                if (menuPermissionsArray[i].action == actionType) {
                    return menuPermissionsArray[i];
                }
            }
        }
        return new UserPermission();
    }


    /**
     * Method to get Add permission from an array
     * @param menuPermissionsArray
     */
    getAddPermission(menuPermissionsArray: any[]): boolean {
        let permissionObj: UserPermission = this.getPermissionObject(menuPermissionsArray, CyncConstants.CREATE);
        let addPermission: boolean = false;
        if (permissionObj != undefined) {
            addPermission = permissionObj[CyncConstants.ENABLED_KEY];
            //console.log("::addPermission-----",addPermission);
        }
        return addPermission;
    }

    /**
     * Method to get Edit permissions from an array
     * @param menuPermissionsArray
     */
    getEditPermission(menuPermissionsArray: any[]): boolean {
        let permissionObj: UserPermission = this.getPermissionObject(menuPermissionsArray, CyncConstants.EDIT);
        let editPermission: boolean = false;
        if (permissionObj != undefined) {
            editPermission = permissionObj[CyncConstants.ENABLED_KEY];
            //console.log("::editPermission-----",editPermission);
        }
        return editPermission;
    }

    /**
     * Method to get permissions from an array based on request module key
     * @param menuPermissionsArray
     * @param permissionKeyName
     */
    getPermissionBasedOnKey(menuPermissionsArray: any[], permissionKeyName: string): boolean {
        let permissionObj: UserPermission = this.getPermissionObject(menuPermissionsArray, permissionKeyName);
        let permission: boolean = false;
        if (permissionObj != undefined) {
            permission = permissionObj[CyncConstants.ENABLED_KEY];
        }
        return permission;
    }

    /**
     * Metod to get Delete permissions from an array
     * @param menuPermissionsArray
     */
    getDeletePermission(menuPermissionsArray: any[]): boolean {
        let permissionObj: UserPermission = this.getPermissionObject(menuPermissionsArray, CyncConstants.DELETE);
        let deletePermission: boolean = false;
        if (permissionObj != undefined) {
            deletePermission = permissionObj[CyncConstants.ENABLED_KEY];
            //console.log("::deletePermission-----",deletePermission);
        }
        return deletePermission;
    }

    /**
    * Method to get Summary permission from an array
    * @param menuPermissionsArray
    */
    getSummaryPermission(menuPermissionsArray: any[]): boolean {
        let permissionObj: UserPermission = this.getPermissionObject(menuPermissionsArray, CyncConstants.SUMMARY);
        let summaryPermission: boolean = false;
        if (permissionObj != undefined) {
            summaryPermission = permissionObj[CyncConstants.ENABLED_KEY];
            //console.log("::summaryPermission-----",summaryPermission);
        }
        return summaryPermission;
    }

    /**
    * Method to get Transfer permission from an array
    * @param menuPermissionsArray
    */
    getTransferPermission(menuPermissionsArray: any[]): boolean {
        let permissionObj: UserPermission = this.getPermissionObject(menuPermissionsArray, CyncConstants.CREATE);
        let transferPermission: boolean = false;
        if (permissionObj != undefined) {
            transferPermission = permissionObj[CyncConstants.ENABLED_KEY];
            //console.log("::transferPermission-----",transferPermission);
        }
        return transferPermission;
    }

    /**
     * Method to get the Columns with checkbox value, which will be displayed
     * in the export popup
     * @param columns [grid column definition]
     */
    getExportColumns(columns: ColumnDefinition[]): ExportColumn[] {
        let exportColumns: ExportColumn[] = [];
        columns.forEach(colData => {
            let searchParam: string = CyncConstants.EXPORT_COLUMN_PARAM + colData.field;
            let colObj: ExportColumn = {
                columnName: colData.header,
                searchParam: searchParam,
                isChecked: true
            };
            exportColumns.push(colObj);
        });
        if (exportColumns.length > 0) {
            //console.log("::exportColumns---",exportColumns);
            return exportColumns;
        }
    }

    /**
     * Method to get the Columns with checkbox value, which will be displayed
     * in the export popup for finance module
     * @param columns [grid column definition]
     */
    getExportColumnsForFinance(columns: ColumnDefinition[]): ExportColumn[] {
        let exportColumns: ExportColumn[] = [];
        columns.forEach(colData => {
            let searchParam: string = colData.field;
            let colObj: ExportColumn = {
                columnName: colData.header,
                searchParam: searchParam,
                isChecked: true
            };
            exportColumns.push(colObj);
        });
        if (exportColumns.length > 0) {
            //console.log("::exportColumns---", exportColumns);
            return exportColumns;
        }
    }

    /**
     * Method to get the query params for export API
     * @param selectedRows
     * @param selectedColumns
     */
    getExportQueryParam(selectedRows: any[], selectedColumns: ExportColumn[]): string {
        let queryParam: string = CyncConstants.BLANK_STRING;
        let rowParam: string = this.getRowSearchParam(selectedRows);
        let colParam: string = this.getColumnSearchParam(selectedColumns);
        if (colParam.length > 0) {
            if (rowParam.length > 0) {
                queryParam = rowParam + '&' + colParam;
            } else {
                queryParam = colParam;
            }
        }
        if (queryParam.length > 0) {
            return queryParam;
        }
    }

    /**
     * Method to get column query params for export API
     * @param selectedColumns
     */
    getColumnSearchParam(selectedColumns: ExportColumn[]): string {
        let selectedColSearchParam = [];
        selectedColumns.forEach(colData => {
            if (colData.isChecked) {
                selectedColSearchParam.push(colData.searchParam);
            }
        });
        if (selectedColSearchParam.length > 0) {
            return selectedColSearchParam.join('&');
        }
        return CyncConstants.BLANK_STRING;
    }

    /**
     * Method to get row query params for export API 
     * @param selectedRows
     */
    getRowSearchParam(selectedRows: any[]): string {
        let selectedRowSearchParam = [];
        selectedRows.forEach(rowData => {
            let rowParam: string = CyncConstants.EXPORT_ROW_PARAM + rowData.id;
            selectedRowSearchParam.push(rowParam);
        });
        if (selectedRowSearchParam.length > 0) {
            return selectedRowSearchParam.join('&');
        }
        return CyncConstants.BLANK_STRING;
    }

    /**
     * Method to get the query params for export API financial module
     * @param selectedRows
     * @param selectedColumns
     */
    getExportQueryParamForFinance(selectedRows: any[], selectedColumns: ExportColumn[]): string {
        let queryParam: string = CyncConstants.BLANK_STRING;
        let rowParam: string = this.getRowSearchParamForFinance(selectedRows);
        let colParam: string = this.getColumnSearchParamForFinance(selectedColumns);
        if (colParam.length > 0) {
            if (rowParam.length > 0) {
                queryParam = rowParam + '&' + colParam;
            } else {
                queryParam = colParam;
            }
        }
        if (queryParam.length > 0) {
            return queryParam;
        }
    }

    /**
     * Method to get column query params for export API financial module
     * @param selectedColumns
     */
    getColumnSearchParamForFinance(selectedColumns: ExportColumn[]): string {
        let selectedColSearchParam = [];
        selectedColumns.forEach(colData => {
            if (colData.isChecked) {
                selectedColSearchParam.push(colData.searchParam);
            }
        });
        if (selectedColSearchParam.length > 0) {
            let selectedColSearchParams = selectedColSearchParam.join(',');
            return (CyncConstants.FINANCIAL_EXPORT_COLUMN_PARAM + selectedColSearchParams);
        }
        return CyncConstants.BLANK_STRING;
    }

    /**
     * Method to get row query params for export API financial module
     * @param selectedRows
     */
    getRowSearchParamForFinance(selectedRows: any[]): string {
        let selectedRowSearchParam = [];
        selectedRows.forEach(rowData => {
            let rowParam: string = rowData.id;
            selectedRowSearchParam.push(rowParam);
        });
        if (selectedRowSearchParam.length > 0) {
            let selectedRowSearchParams = selectedRowSearchParam.join(',');
            return (CyncConstants.FINANCIAL_EXPORT_ROW_PARAM + selectedRowSearchParams);
        }
        return CyncConstants.BLANK_STRING;
    }

    /**
	 * Download the exported records
	 * @param blob
	 * @param filename
	 */
    downloadFile(blob: Blob, filename: string) {
        let xlsFileName = filename + '.xls';
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //console.log('::download file 1');
            window.navigator.msSaveOrOpenBlob(blob, xlsFileName);
        } else {
            //console.log('::download file 2');
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.href = window.URL.createObjectURL(blob);
            link.download = xlsFileName;
            link.click();
        }
    }

    /**
     * client loan terms guarantors
     * Method to change router path based on dropdown value
     * @param selectedValue
     */
    onChangeGuarantorsDropdown(selectedValue: string) {
        if (selectedValue == 'Borrower') {
            this._router.navigateByUrl("/otherGeneralCodes/client-loan-terms/borrower-guarantors");
        }
        if (selectedValue == 'Personal') {
            this._router.navigateByUrl("/otherGeneralCodes/client-loan-terms/personal-guarantors");
        }
        if (selectedValue == 'Third Party') {
            this._router.navigateByUrl("/otherGeneralCodes/client-loan-terms/third-party-guarantors");
        }
        if (selectedValue == 'Insurance Policies') {
            this._router.navigateByUrl("/otherGeneralCodes/client-loan-terms/insurance-policies");
        }
        if (selectedValue == 'Guarantors') {
            this._router.navigateByUrl("/otherGeneralCodes/client-loan-terms/guarantors");
        }
    }

    /**
     * client loan terms guarantors
     * Method to adjust the grid height
     */
    setGuarantorsComponentHeight() {
        var appbody_cont = window.innerHeight;
        $(window).resize(function () {
            appbody_cont = window.innerHeight;
            if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
            if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 100) + 'px'; }
            //  if (document.getElementById("dialog")) { document.getElementById('dialog').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
        })
        if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
        if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 100) + 'px'; }

    }

    /**
     * Method to fix the datatable header on scroll event
     * @param dataTableElement
     * @param isAdvanceSearchAvailable
     */
    fixTableHeader(dataTableElement: any, isAdvanceSearchAvailable: boolean) {
        if ("webkitAppearance" in document.body.style && !isAdvanceSearchAvailable) {
            //  fix the header at the top in Google Chrome browser
            dataTableElement.querySelector("thead").style.webkitTransform = `translateY(${dataTableElement.scrollTop}px)`;
        }
        else {
            dataTableElement.querySelector("thead").style.webkitTransform = `unset`;
        }
    }

    /**
     * this method will place scroll to top in data table
     * @param elementId
     */
    scrollTopDataTable(elementId: string) {
        const target = document.getElementById(elementId);
        target.scrollTop = 0;
    }

    /**
     * Method to check if client id is selected or not
     */
    isClientSelected(): boolean {
        if (CyncConstants.getSelectedClient() == undefined || CyncConstants.getSelectedClient() == null || CyncConstants.getSelectedClient() == 'null' || CyncConstants.getSelectedClient() === CyncConstants.SELECT_CLIENT_PLACEHOLDER) {
            return false;
        }
        return true;
    }

    /**
     * @param whichElement
     * This method will check if user has scrolled to the bottom of the given element
     * @see CYNCPS-1853
     */
    isScollbarAtBottom(whichElement: string): boolean {
        /**
        * This is for multiple time api calling while doing scroll. 
        */
        let newTempScrollValue = new Date().getTime();
        if ((newTempScrollValue - this.tempScrollValue) < 50) {
            return false;
        }

        const element = document.getElementById(whichElement);
        const elementHeight = Math.trunc(element.scrollHeight);
        const innerHeight = Math.trunc(element.clientHeight);
        const scroll_top = (Math.trunc(element.scrollTop) + 10);

        if (scroll_top >= (elementHeight - innerHeight)) {
            this.tempScrollValue = new Date().getTime();
            return true;
        }
        return false;
    }

    /**
    * Global error variable value enable or disable.
    */
    isGlobalErrorMsgsEnabled() {
        return this.globalErrorMsg;
    }

    /**
    * set Global menuPermissionArray
    */
    setRolesAndPermissionArray(rolesMenuPermissionArray: any) {
        this.menuPermissionArray = rolesMenuPermissionArray;
    }

    /**
    * get Global menuPermissionArray
    */
    getRolesAndPermissionArray(): any {
        return this.menuPermissionArray;
    }

    /**
    * set Global menuPermissionId
    */
    setRolesAndPermissionId(roleId: string) {
        this.roleId = roleId;
    }

    /**
    * get Global menuPermissionId
    */
    getRolesAndPermissionId(): any {
        return this.roleId;
    }


    /**
    * formating string to number column with two decimal numbers
    * @param params 
    */
    public CurrencyCellRenderer(params: any) {
        var usdFormate = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        });
        let usdFormatedValue = usdFormate.format(params.value === undefined ? params : params.value);
        if (usdFormatedValue.indexOf('-') !== -1) {
            return "(" + usdFormatedValue.replace('-', '') + ")";
        } else {
            return usdFormatedValue;
        }
    }
    /**
      * formating number value with 2 decimal point
      * @param params 
      *
      */
    CurrencyCellRendererRoundOff(params: any) {
        var usdFormate = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        });
        let usdFormatedValue = '';
        if (params.value === undefined) {
            let v = parseFloat(params).toFixed(2);
            usdFormatedValue = usdFormate.format(Number(v));
        }else if(params.value === "" || params.value===null){
            let v = parseFloat("0").toFixed(2);
            usdFormatedValue = usdFormate.format(Number(v));
        }else {
            let v = parseFloat(params.value).toFixed(2);
            usdFormatedValue = usdFormate.format(Number(v));
        }

        if (usdFormatedValue.indexOf('-') !== -1) {
            return "(" + usdFormatedValue.replace('-', '') + ")";
        } else {
            return usdFormatedValue;
        }

    }
    
    //CurrencyFormate 6 decimal
    currencyFormateSixDecimal(params: any) {
        var usdFormate = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        });
        let usdFormatedValue = '';
        if (params.value === undefined) {
            let v = parseFloat(params).toFixed(2);
            usdFormatedValue = usdFormate.format(Number(v));
        }else if(params.value === "" || params.value===null){
            let v = parseFloat("0").toFixed(2);
            usdFormatedValue = usdFormate.format(Number(v));
        } else {
            let v = parseFloat(params.value).toFixed(2);
            usdFormatedValue = usdFormate.format(Number(v));
        }

        if (usdFormatedValue.indexOf('-') !== -1) {
            return "(" + usdFormatedValue.replace('-', '') + ")";
        } else {
            return usdFormatedValue;
        }

    }

    /**
    * formating string to number column with two decimal numbers for rollforward log balance column
    * @param params 
    */
    public CurrencyCellRendererRollForwardLog(params: any) {
        if (params.value === "") {
            return params.value;
        } else {
            var usdFormate = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2
            });
            let usdFormatedValue = usdFormate.format(params.value === undefined ? params : params.value);
            if (usdFormatedValue.indexOf('-') !== -1) {
                return "(" + usdFormatedValue.replace('-', '') + ")";
            } else {
                return usdFormatedValue;
            }
        }
    }
    /**
      * pop up for broker release
      * 
      */
    openBrokerReleasePopup(title: string, message: string) {
        const dialogRef = this.dialogRef.open(PopupsComponent);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.isReleaseBroker = true;
        return dialogRef.afterClosed();
    }

    setInternalDivisionScroll(): number[]  { 
    const cynWin = window;
    const cyncDoc = document;
    const cyncdocElem = cyncDoc.documentElement;
    const  cyncBody = cyncDoc.getElementsByTagName('body')[0];
    let x = cynWin.innerWidth || cyncdocElem.clientWidth || cyncBody.clientWidth;
    let y = cynWin.innerHeight|| cyncdocElem.clientHeight|| cyncBody.clientHeight;
    let result = [x,y];
    return result;
  }
}