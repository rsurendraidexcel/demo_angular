import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { AblClientTransactionDetail, ListAblClientTransactionApiResponse, ClientTransactionTotalDetail } from '../model/client-transaction.model';

@Injectable()
export class ClientTransactionService {

    constructor(private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper,
        private _commonApiHelper: CommonAPIs) {
    }

    /**
     * Method to get the Menu Permissions
     */
    getMenuPermission(): Observable<UserPermission[]> {
        let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
        return this._commonApiHelper.getUserPermission(CyncConstants.CLIENT_TRANSACTION_MENU_NAME, userRoleId);
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
     * @param pageNum
     * @param rowCount
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
     * Method to get all the grid data
     * @param url 
     */
    getGridData(url: string): Observable<ListAblClientTransactionApiResponse> {
        return this._cyncHttpService.get(url).map(data => {
            return (this.serializeJsonObject(<ListAblClientTransactionApiResponse>JSON.parse(data._body)));
        });
    }

    /**
     * Method to serialize apiResponse based on our requirement
     * @param apiResponse 
     */
    serializeJsonObject(apiResponse: ListAblClientTransactionApiResponse): ListAblClientTransactionApiResponse {
        let clientTransaction: AblClientTransactionDetail[] = apiResponse['client_transaction_summary'];
        clientTransaction.forEach(element => {
            let mangerName: string = element.manager;
            element.manager_name = mangerName.split(',');
        });
        apiResponse['client_transaction_summary'] = clientTransaction;
        return apiResponse;
    }

    /**
     * Method to get particular client detail based on id
     * @param url
     */
    getClientTransactionById(url: string): Observable<AblClientTransactionDetail> {
        return this._cyncHttpService.get(url).map(data => {
            return (<AblClientTransactionDetail>JSON.parse(data._body));
        });
    }

    /**
     * Method to get the client transaction total details
     * @param url
     */
    getClientTransactionData(url: string): Observable<ClientTransactionTotalDetail> {
        return this._cyncHttpService.get(url).map(data => {
            return (<ClientTransactionTotalDetail>JSON.parse(data._body));
        });
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