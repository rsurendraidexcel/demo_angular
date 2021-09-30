import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { TransferClientsRequestBody, ClientModel, UDFModel, UDFValueModel } from '../models/transfer-client-to-udf.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class TransferClientToUdfService {

    constructor(private _cyncHttpService: CyncHttpService, private _commonApiHelper: CommonAPIs) { }

    /**
    * Method to get a list of UDF names
    * @param url
    */
    getUDFList(url: string): Observable<UDFModel[]> {
        return this._cyncHttpService.get(url).map(data => {
            return JSON.parse(data._body);
        });
    }

    /**
    * Method to get a list of UDF values according to UDF-ID
    * @param url
    */
    getUDFValues(url: string): Observable<UDFValueModel[]> {
        return this._cyncHttpService.get(url).map(data => {
            return JSON.parse(data._body);
        });
    }

    /**
    * Method to get a list of client details according to UDF-ID and UDF-Value
    * @param url
    */
    getUDFClientDetails(url: string, type: string): Observable<ClientModel[]> {
        return this._cyncHttpService.get(url).map(data => this.customizeClientDetails(JSON.parse(data._body), type));
    }

    /**
   * this method will customize the api response that need in component to show on UI
   * @param apiResponse
   * @returns ClientModel
   */
    private customizeClientDetails(apiResponse: any, type: string): ClientModel[] {
        const spChar = (type === CyncConstants.TRANSFER_CLIENTS_UDF_To_STRING) ? '#' : '';
        apiResponse.clients.forEach(function (element) {
            element.id = element.id + spChar;
        });
        return <ClientModel[]>apiResponse;
    }

    /**
    * Update transfer clients
    * @param url
    * @param model
    */
    updateTransferClients(url: string, model: TransferClientsRequestBody): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }

    /**
    * Method to get the Menu Permissions
    * @param menuName
    */
    getMenuPermission(menuName: string): Observable<UserPermission[]> {
        const userRoleId = localStorage.getItem('cyncUserRoleId'); /*Logged In User*/
        return this._commonApiHelper.getUserPermission(menuName, userRoleId);
    }
}