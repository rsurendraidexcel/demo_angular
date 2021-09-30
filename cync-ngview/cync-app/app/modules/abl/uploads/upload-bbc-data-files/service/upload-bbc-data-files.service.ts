import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Observable } from 'rxjs/Observable';
import { ABLFileUploadsAPIResponse, BorrowerDivisionCodeResponse, DataReviewAPIResponse, ReApplyExchangeRate, ReprocessCollateralFrom } from '../model/upload-bbc-data-files.model';
import { HttpEvent } from '@angular/common/http';
import { UIBinding } from '../model/upload-bbc-data-files.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';

@Injectable()
export class UploadBBCDataFilesService {

    constructor(private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper,
        private _commonApiHelper: CommonAPIs) { }

    /**
     * Method to get the Menu Permissions
     */
    getMenuPermission(): Observable<UserPermission[]> {
        const userRoleId = localStorage.getItem('cyncUserRoleId'); /*Logged In User*/
        return this._commonApiHelper.getUserPermission(CyncConstants.ABL_FILE_UPLOAD_MENU_NAME, userRoleId);
    }

    /**
     * Method to get user have Permissions to undo data or not?
     * @param permissionsArray
     */
    getUndoPermission(permissionsArray: any[]): boolean {
        return this._helper.getPermissionBasedOnKey(permissionsArray, CyncConstants.UNDO_ACTION);
    }

    /**
     * Method to get user have Permissions to expand row or not?
     * @param permissionsArray
     */
    getExpandRowPermission(permissionsArray: any[]): boolean {
        return this._helper.getPermissionBasedOnKey(permissionsArray, CyncConstants.EXPAND_ROW);
    }

    /**
     * Method to get user have permissions to reprocess collateral or not?
     * @param permissionsArray 
     */
    getReprocessCollateralPermission(permissionsArray: any[]): boolean {
        return this._helper.getPermissionBasedOnKey(permissionsArray, CyncConstants.REPROCESS_COLLATERAL);
    }

    /**
     *
     * @param url
     */
    public getABLUploads(url: string): Observable<ABLFileUploadsAPIResponse> {
        return this._cyncHttpService.get(url).map(data => this.customizeUploadFiles(JSON.parse(data._body)));
    }

    /**
     *
     * @param apiResponse
     */
    private customizeUploadFiles(apiResponse: any): ABLFileUploadsAPIResponse {
        apiResponse['uploaded_file'].forEach(eachMapping => {
            eachMapping['uiBindings'] = new UIBinding();
            if(eachMapping['layouts'].length == 1){
                eachMapping['layoutID'] = eachMapping.mapping_id;
                eachMapping['layoutName'] = eachMapping['layouts'][0].layout_name;
                eachMapping['layoutFilePresent'] = eachMapping['layouts'][0].file_present;
            }else{
                eachMapping['layoutID'] = "";
                eachMapping['layoutName'] = "";
                eachMapping['layoutFilePresent'] = false;
            }
            eachMapping['imageBindings'] = new UIBinding();
            eachMapping['select_collateral_from_dropdown'] = eachMapping.select_collateral_from;
            eachMapping['select_collateral_from'] = null;
            if (eachMapping['default_select_collateral'] === null || eachMapping['default_select_collateral'] === '' || eachMapping['default_select_collateral'].toString().length === 0) {
                eachMapping['default_select_collateral'] = '';
            }
        });
        apiResponse['bbc_document'].forEach(eachMapping => {
            eachMapping['uiBindings'] = new UIBinding();
        });

        return <ABLFileUploadsAPIResponse>apiResponse;
    }

    /**
     * this method is to get borrower divisions
     * @param borrower_id
     */
    public getDivisionDropdownValues(borrower_id: number | string): Observable<BorrowerDivisionCodeResponse> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_DIVISIONS_DROPDOWN];
        endPoint = endPoint.replace('{clientId}', borrower_id);
        return this._cyncHttpService.get(endPoint).map(data => (<BorrowerDivisionCodeResponse>JSON.parse(data._body)));
    }

    /**
     *Method to get client details based on clientID 
     * @param url
     */
    public getBorrowerDetails(url: string): Observable<any> {
        return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
    }

    /**
     * this method is to upload file
     * @param formData
     */
    public uploadFile(formData: FormData): Observable<HttpEvent<{}>> {
        const endPoint = this._apiMapper.endpoints[CyncConstants.UPLOAD_BBC_DATA_FILES];
        return this._cyncHttpService.uploadFile(endPoint, formData);
    }

    /**
     * this method will get the data when row is getting expanded
     * @param borrower_id
     * @param mapping_id
     * @param data_type
     */
    public getDataReviewData(borrower_id: number | string, mapping_id: number, data_type: string): Observable<DataReviewAPIResponse> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_DATA_REVIEW_ON_ROW_EXPAND];
        endPoint = endPoint.replace('{clientId}', borrower_id);
        endPoint = endPoint.replace('{mapping_id}', mapping_id);
        //endPoint = endPoint.replace('{data_type}', data_type);
        endPoint = endPoint.replace('{data_type}', encodeURIComponent(data_type));
        return this._cyncHttpService.get(endPoint).map(data => this.customizeDataReview(JSON.parse(data._body)));
    }

    /**
     * this method will get called to customize apiresponse
     * @param apiResponse 
     */
    private customizeDataReview(apiResponse: any): DataReviewAPIResponse {
        apiResponse['data_review'].forEach(eachMapping => {
            if (eachMapping['default_select_collateral'] === null || eachMapping['default_select_collateral'] === '' || eachMapping['default_select_collateral'].toString().length === 0) {
                eachMapping['default_select_collateral'] = '';
            }
        });
        return <DataReviewAPIResponse>apiResponse;
    }

    /**
     * this method will undo the data review uploaded file
     * @param borrower_id
     * @param id
     */
    public undoExpendedRowDataFiles(borrower_id: number | string, id: number): Observable<any> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.UNDO_DATA_REVIEW_UPLOADED_FILE];
        endPoint = endPoint.replace('{clientId}', borrower_id);
        endPoint = endPoint.replace('{id}', id);
        return this._cyncHttpService.delete(endPoint);
    }

    /**
     * This method will get called to recalculate exchange rate
     * @param endPoint 
     * @param model 
     */
    public reApplyExchangeRate(endPoint: string, model: ReApplyExchangeRate): Observable<any> {
        return this._cyncHttpService.patch(endPoint, model);
    }

    /**
     * this method will get called to reprocess collateral from
     * @param endPoint 
     * @param model 
     */
    public reprocessCollateralFrom(endPoint: string, model: ReprocessCollateralFrom): Observable<any> {
        return this._cyncHttpService.patch(endPoint, model);
    }


    /**
    * Get status for multiple user logged for same client
    */
    public getSameClientLoginInfo(): Observable<any> {
        //let borrowerId = localStorage.getItem('selectedClient');
        let borrowerId = CyncConstants.getSelectedClient();
        let userId = localStorage.getItem('cyncUserId');
        let url = this._apiMapper.endpoints[CyncConstants.GET_MULTIPLE_USER_LOGIN_INFO].replace('{borrowerId}', borrowerId).replace('{userId}', userId);
        return this._cyncHttpService.get(url).map(data =>
            JSON.parse(data._body)
        );
    }

    /**
     * Get endpoint for preview pdf, txt, html etc
     * @param endPoint
     */
    public getPreviewModel(endPoint: string): Observable<any> {
        return this._cyncHttpService.get(endPoint).map(data =>
            JSON.parse(data._body)
        );
    }
}