import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import {
    ListIneligibilityReasonsResponse,
    IneligibilityReasons,
    AddOrUpdateIneligibilityReasons,
    AddOrUpdateIneligibilityReasonsRequest
} from '../models/ineligibility-reasons.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';

@Injectable()
export class IneligibilityReasonsService {

    constructor(private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper,
        private _commonApiHelper: CommonAPIs) {
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
    deleteInEligibilityReasons(selectedRecords: any[], recordNameKey: string, url: string): Observable<any> {
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
     * Method to get the Menu Permissions
     */
    getMenuPermission(): Observable<UserPermission[]> {
        let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
        return this._commonApiHelper.getUserPermission(CyncConstants.INELIGIBILITY_REASONS_MENU_NAME, userRoleId);
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
     * Method to get all the grid data
     * @param url 
     */
    getGridData(url: string): Observable<ListIneligibilityReasonsResponse> {
        return this._cyncHttpService.get(url).map(data => {
            return (<ListIneligibilityReasonsResponse>JSON.parse(data._body));
        });
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

        return this.replacePaginationQueryParams(url,pageNum,rowCount);

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
     * Method to add a record
     * @param url 
     * @param ineligibilityReasonRequestModel 
     */
    createRecord(url: string, ineligibilityReasonRequestModel: AddOrUpdateIneligibilityReasonsRequest): Observable<any> {
        return this._cyncHttpService.post(url, ineligibilityReasonRequestModel);
    }


    /**
     * Method to update a record
     * @param url 
     * @param ineligibilityReasonId 
     * @param ineligibilityReasonRequestModel 
     */
    updateRecord(url: string, ineligibilityReasonId: number, ineligibilityReasonRequestModel: AddOrUpdateIneligibilityReasonsRequest): Observable<any> {
        return this._cyncHttpService.patch(
            this._helper.replaceEndpointQueryParameters(url,
                CyncConstants.SELECTED_RECORD_ID,
                ineligibilityReasonId),
            ineligibilityReasonRequestModel);
    }

    /**
     * Method to get a record
     * @param url 
     * @param ineligibilityReasonId 
     */
    getRecord(url: string, ineligibilityReasonId: number): Observable<IneligibilityReasons> {
        return this._cyncHttpService.get(
            this._helper.replaceEndpointQueryParameters(url,
                CyncConstants.SELECTED_RECORD_ID,
                ineligibilityReasonId)).map(data =>
                    (<IneligibilityReasons>JSON.parse(data._body)));
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