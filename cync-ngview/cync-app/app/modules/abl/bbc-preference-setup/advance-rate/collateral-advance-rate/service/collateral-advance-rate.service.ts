import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import {
    ListDivisions,
    Division,
    ListCollateralAdvanceRate,
    CollateralAdvanceRates,
    AddOrUpdateAdvanceRateDivisionRequest,
    AddOrUpdateAdvacneRateDivision
} from '../model/collateral-advance-rate.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';

@Injectable()
export class CollateralAdvanceRateService {

    constructor(private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper,
        private _commonApiHelper: CommonAPIs) {
    }

    /**
    * Method to get all Advance Rate Division grid data
    * @param url 
    */
    getGridData1(url: string): Observable<ListDivisions> {
        return this._cyncHttpService.get(url).map(data => {
            return (<ListDivisions>JSON.parse(data._body));
        });
    }

    /**
     * Method to get a record for Advance Rate Division
     * @param url 
     */
    getAdvanceRateDivisionRecord(url: string): Observable<Division> {
        return this._cyncHttpService.get(url).map(data => {
            let response = JSON.parse(data._body);
            return response;
        });
    }

    /**
    * Save new Advance Rate Division
    * @param url 
    * @param model 
    */
    saveAdvacnceRateDivision(url: string, model: AddOrUpdateAdvanceRateDivisionRequest): Observable<any> {
        return this._cyncHttpService.post(url, model);
    }

    /**
    * Update exising Advance Rate Division
    * @param url 
    * @param model 
    */
    updateAdvacnceRateDivision(url: string, model: AddOrUpdateAdvanceRateDivisionRequest): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }

    /**
    * Method to get the Menu Permissions
    */
    getMenuPermission(): Observable<UserPermission[]> {
        let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
        return this._commonApiHelper.getUserPermission(CyncConstants.COLLATERAL_MENU_PERMISSION_NAME, userRoleId);
    }

    /**
    * Method to get only the add permission
    * @param permissionsArray 
    */
    getAddPermission(permissionsArray: any[]): boolean {
        return this._helper.getAddPermission(permissionsArray);
    }

    /**
    * Method to get only the edit permission
    * @param permissionsArray 
    */
    getEditPermission(permissionsArray: any[]): boolean {
        return this._helper.getEditPermission(permissionsArray);
    }

    /**
    * Method to get only the delete permission
    * @param permissionsArray 
    */
    getDeletePermissions(permissionsArray: any[]): boolean {
        return this._helper.getDeletePermission(permissionsArray);
    }

    /**
    * Method to replace the API query param with values
    * @param url 
    */
    replaceQueryParams(url: string, pageNum: number, rowCount: number): string {
        url = this._helper.replaceEndpointQueryParameters(url,
            CyncConstants.SORT_BY_PARAM_VALUE,
            CyncConstants.DESC_ORDER);
        url = this._helper.replaceEndpointQueryParameters(url,
            CyncConstants.ORDER_BY_PARAM_VALUE,
            CyncConstants.ORDER_BY_UPDATED_AT);

        return this.replacePaginationQueryParams(url, pageNum, rowCount);
    }

    /**
    * Replace API Pagination query params
    * @param url 
    * @param pageNum 
    * @param rowCount 
    */
    replacePaginationQueryParams(url: string, pageNum: number, rowCount: number): string {
        url = this._helper.replaceEndpointQueryParameters(url,
            CyncConstants.PAGE_PARAM_VALUE,
            pageNum);
        url = this._helper.replaceEndpointQueryParameters(url,
            CyncConstants.ROWS_PARAM_VALUE,
            rowCount);
        return url;
    }

    /**
    * Method to get the Message for confirmation popoup,
    * message should contain the selected record names
    * @param selectedRecords 
    * @param recordNameKey 
    */
    getConfirmationPopupMessage(selectedRecords: any[], recordNameKey: string): string {
        if (selectedRecords.length == 1) {
            return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.IR_SINGLE_MSG);
        }
        return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.IR_MULTIPLE_MSG);
    }

    /**
     * Method to replace the constant word in the message with selected record names 
     * @param selectedRecords 
     * @param recordNameKey 
     * @param msg 
     */
    replaceRecordNames(selectedRecords: any[], recordNameKey: string, msg: string) {
        return msg.replace(CyncConstants.SELECTED_RECORD_NAMES, this._helper.getRecordNamesOrRecordIds(selectedRecords, recordNameKey));
    }

    /**
     * Method to delete the selected records
     * @param selectedRecords 
     * @param recordNameKey 
     * @param url 
     */
    deleteCollateralDivision(selectedRecords: any[], recordNameKey: string, url: string): Observable<any> {
        return this._cyncHttpService.delete(this._helper.replaceEndpointQueryParameters(url,
            CyncConstants.SELECTED_RECORD_IDS,
            this._helper.getRecordNamesOrRecordIds(selectedRecords, recordNameKey))
        );
    }

    /**
     * Method to show the success message
     * @param successMsg 
     */
    showSuccessMessage(successMsg: string) {
        this._helper.showApiMessages(successMsg, CyncConstants.SUCCESS_CSS);
    }

    /**
     * Method to export grid data
     * @param queryParams 
     * @param url 
     */
    exportData(queryParams: string, url: string): Observable<Blob> {
        return this._cyncHttpService.getExportCall(url, queryParams);
    }
}       