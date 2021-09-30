import { Injectable } from '@angular/core';
import {AnimationStyleMetadata } from '@angular/animations';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { UserPermission } from '@app/shared/models/user-permissions.model'
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { CurrentSessionStateModel } from '@app/navbar/model/menu.model';
import { FinanceProjectStatus } from '@app/shared/models/finance-status.model';
import { FinancialStatementModel } from '@app/modules/financial/financial-statements/models/financial-statements.model';

@Injectable()
export class CommonAPIs {

    constructor(
        private _customHttpService: CyncHttpService, private _apiMapper: APIMapper) {
    }

    /**
     * this method will return the permission assiged to logged in user for provided menu name as parameter
     * @param menuName
     * @param userRoleId
     */
    getUserPermission(menuName: string, userRoleId: string): Observable<UserPermission[]> {
        return this._customHttpService.get(this._apiMapper.endpoints[CyncConstants.MENU_SPECIFIC_API].replace
            (CyncConstants.ROLE_ID_PARAM, userRoleId).replace(CyncConstants.MENU_PARAM, menuName)).map(data => {
                return JSON.parse(data._body);
            });
    }

    getCurrentUserState(): Observable<CurrentSessionStateModel> {
        return this._customHttpService.get(this._apiMapper.endpoints[CyncConstants.CURRENT_STATE]).map(data => JSON.parse(data._body).current_session_state
        );
    }

    getCurrentUserState2(): Observable<boolean> {
        return this._customHttpService.get(this._apiMapper.endpoints[CyncConstants.CURRENT_STATE]).map(data => this.checkClientSelection(JSON.parse(data._body)));

    }

    /**
     * Method to get Finance Project Status
     * @param projectId
     */
    getServiceProjectStatus(projectId : string) : Observable<FinanceProjectStatus> {
        let url = this._apiMapper.endpoints[CyncConstants.GET_FINANCE_STATUS_API].replace('{projectId}',projectId);
        return this._customHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => JSON.parse(data._body));
    }

    /**
     *
     * @param result
     */
    private checkClientSelection(result: any): boolean {
        let res = result.current_session_state;
        if ((res !== undefined && res.borrower_id !== undefined && res.borrower_id !== null && res.borrower_id !== 'Select Client') ||
            (localStorage.getItem('selectedClient') != null && localStorage.getItem('selectedClient') !== 'Select Client')) {
            CyncConstants.setSelectedClient(res.borrower_id || localStorage.getItem('selectedClient').toString());
            return true;
        }
    }

    /**
     * method to save darft version of financial stmt
     */
    public draftFinancialStmt( endpoint : string , requestBody : any) : Observable<any>{
        return this._customHttpService.postService(CyncConstants.FINANCE_HOST, endpoint, requestBody);
    }
    /*
    * Get status for multiple user logged for same client
    */
    getSameClientLoginInfo(): Observable<any> {
        let borrowerId = localStorage.getItem('selectedClient');
        let userId = localStorage.getItem('cyncUserId');
        let url = this._apiMapper.endpoints[CyncConstants.GET_MULTIPLE_USER_LOGIN_INFO].replace('{borrowerId}',borrowerId).replace('{userId}',userId);
        return this._customHttpService.get(url).map(data => 
            JSON.parse(data._body)
        );
    }
}