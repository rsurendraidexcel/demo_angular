import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { InterestRateCodesModel, InterestRatesModel, InterestRateCodes, InterestDetails, InterestRateRequestBody, LoanModel, InterestRateCodesRequestBody, CalendarYearModel } from '../model/interest-rate-codes.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';

@Injectable()
export class InterestRateCodesService {

    constructor(private _cyncHttpService: CyncHttpService,
        private _apiMapper: APIMapper,
        private _helper: Helper,
        private _commonApiHelper: CommonAPIs) { }

    /**
    * Get a list of  interest rate codes records
    * @param url 
    */
    getInterestRateCodes(url: string): Observable<InterestRateCodesModel[]> {
        return this._cyncHttpService.get(url).map(data => {
            let response = JSON.parse(data._body);
            return response;
        });
    }

    /**
    * Get a list of  interest rates records
    * @param url 
    */
    getInterestRates(url: string): Observable<InterestRatesModel[]> {
        return this._cyncHttpService.get(url).map(data => {
            let response = JSON.parse(data._body);
            return response;
        });
    }

    /**
    * Get Single Interest rate code record using interest rate code id
    * @param url 
    */
    getInterestRatesCodeWithId(url: string): Observable<InterestRateCodes> {
        return this._cyncHttpService.get(url).map(data => {
            let response = JSON.parse(data._body);
            return response;
        });
    }

    /**
    * Get Single Interest rate record using interest rate id
    * @param url 
    */
    getInterestRatesWithId(url: string): Observable<InterestDetails> {
        return this._cyncHttpService.get(url).map(data => this.customizeInterestRatesCodeDetails(JSON.parse(data._body)));

    }

    /**
     * 
     * @param apiResponse 
     */
    private customizeInterestRatesCodeDetails(apiResponse: any): InterestDetails {
        apiResponse.rate_date = this._helper.convertStringToDate(apiResponse.rate_date);
        return <InterestDetails>apiResponse;
    }

    /**
    * Save new Interest rate
    * @param url 
    * @param model 
    */
    saveInterestRates(url: string, model: InterestRateRequestBody): Observable<any> {
        return this._cyncHttpService.post(url, model);
    }

    /**
    * Update exising Interest rate
    * @param url 
    * @param model 
    */
    updateInterestRate(url: string, model: InterestRateRequestBody): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }

    /**
    * Save new Interest rate code
    * @param url 
    * @param model 
    */
    saveInterestRateCodes(url: string, model: InterestRateCodesRequestBody): Observable<any> {
        return this._cyncHttpService.post(url, model);
    }

    /**
    * Update exising interest rate code
    * @param url 
    * @param model 
    */
    updateInterestRateCode(url: string, model: InterestRateCodesRequestBody): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }

    /**
    * Get delete confirm popup message window
    * @param selectedRecords 
    * @param recordNameKey 
    */
    getConfirmationPopupMessage(selectedRecords: any[], recordNameKey: string, type: string): string {
        if (type == CyncConstants.InterestRateCodeStaticKey) {
            if (selectedRecords.length == 1) {
                return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.IR_SINGLE_MSG);
            }
            return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.IR_MULTIPLE_MSG);
        } else if (type == CyncConstants.InterestRateStaticKey) {
            if (selectedRecords.length == 1) {
                return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.InterestRates_SINGLE_MSG);
            }
            return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.InterestRates_MULTIPLE_MSG);
        }
    }

    /**
    * Replace constant string name with selected records keys in delete message pop up window
    * @param selectedRecords 
    * @param recordNameKey 
    */
    replaceRecordNames(selectedRecords: any[], recordNameKey: string, msg: string) {
        return msg.replace(CyncConstants.SELECTED_RECORD_NAMES, this._helper.getRecordNamesOrRecordIds(selectedRecords, recordNameKey));
    }

    /**
    * Delete Interest Rate Codes
    * @param selectedRecords 
    * @param recordNameKey 
    */
    deleteInterestRateCodes(selectedRecords: any[], recordNameKey: string): Observable<any> {
        var selectedRowIDS = this._helper.getRecordNamesOrRecordIds(selectedRecords, recordNameKey);
        return this._cyncHttpService.delete(this._apiMapper.endpoints[CyncConstants.DELETE_INTERESTRATECODE] + "?ids=" + selectedRowIDS);
    }

    /**
    * Delete Interest Rates
    * @param selectedRecords 
    * @param recordNameKey 
    */
    deleteInterestRates(selectedRecords: any[], recordNameKey: string, id: string): Observable<any> {
        var selectedRowIDS = this._helper.getRecordNamesOrRecordIds(selectedRecords, recordNameKey);
        return this._cyncHttpService.delete(this._apiMapper.endpoints[CyncConstants.DELETE_INTERESTRATE].replace('{interestRateCodeId}', id) + "?ids=" + selectedRowIDS);
    }

    /**
    * Delete success message message
    * @param successMsg 
    */
    showSuccessMessage(successMsg: string) {
        this._helper.showApiMessages(successMsg, CyncConstants.SUCCESS_CSS);
    }

    /**
    * Get a list of  loan types
    * @param url 
    */
    getLoanTypes(url: string): Observable<LoanModel[]> {
        return this._cyncHttpService.get(url).map(data => {
            let response = JSON.parse(data._body);
            return response.loan_type;
        });
    }

    /**
    * Interest rate codes search method
    * @param event
    */
    interestRateCodesOnKey(event: any, module: any, gridModel: any) {

        this._helper.scrollTopDataTable(module.interestRateCodeDataTableElementId);
        if (event.target.value == '') {
            module.isCloseBoxInterestRateCodes = false;
            module.isSearchBoxInterestRateCodes = true;
        }
        else {
            module.isCloseBoxInterestRateCodes = true;
            module.isSearchBoxInterestRateCodes = false;
        }
        if (event.target.value == undefined) {
            event.target.value = '';
            module.isCloseBoxInterestRateCodes = false;
            module.isSearchBoxInterestRateCodes = true;
        }

        if (gridModel.searchViaAPI) {
            module.showCountInterestRateCodes = 1;
            module.searchTermInterestRateCodes = event.target.value;
            var endpoint = this._apiMapper.searchAPIs[gridModel.type] + module.searchTermInterestRateCodes + "&loan_type=" + module.loanType + '&page=' + module.showCountInterestRateCodes + '&rows=' + CyncConstants.getDefaultRowCount() + '&order_by=' + CyncConstants.DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY;
            this.getInterestRateCodes(endpoint).subscribe(results => {
                module.interestRateCodesResultSet = results[gridModel.responseKey];
                module.showTotalrecordsInterestRateCodes = results['recordTotal'];
            });
        }
    }

    /**
    * Interest rate search method
    * @param event
    */
    interestRatesOnKey(event: any, module: any, gridModel: any, interestRateCodeId: string) {

        this._helper.scrollTopDataTable(module.interestRateDataTableElementId);
        if (event.target.value == '') {
            module.isCloseBoxInterestRates = false;
            module.isSearchBoxInterestRates = true;
        }
        else {
            module.isCloseBoxInterestRates = true;
            module.isSearchBoxInterestRates = false;
        }
        if (event.target.value == undefined) {
            event.target.value = '';
            module.isCloseBoxInterestRates = false;
            module.isSearchBoxInterestRates = true;
        }

        if (gridModel.searchViaAPI) {
            module.searchTermInterestRates = event.target.value;
            module.showCountInterestRate = 1;
            var endpoint = this._apiMapper.searchAPIs[gridModel.type].replace('{interestRateCodeId}', interestRateCodeId) + module.searchTermInterestRates + '&page=' + module.showCountInterestRate + '&rows=' + CyncConstants.getDefaultRowCount() + '&order_by=' + CyncConstants.INTEREST_RATE_DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY;
            this.getInterestRates(endpoint).subscribe(rateResults => {
                module.interestRatesResultSet = rateResults[gridModel.responseKey];
                module.showTotalrecordsInterestRates = rateResults['recordTotal'];
            });
        }
    }

    /**
    * Interest rate code clear search box
    * @param module 
    */
    clearSearchBoxInterestRateCodes(module: any) {
        module.searchTermInterestRateCodes = '';
        module.isCloseBoxInterestRateCodes = false;
        module.recordCountInterestRateCodes = -1;
        module.showCountInterestRateCodes = 1;
        module.isSearchBoxInterestRateCodes = true;
    }

    /**
    * Interest rate clear search box
    * @param module 
    */
    clearSearchBoxInterestRate(module: any) {
        module.searchTermInterestRates = '';
        module.isCloseBoxInterestRates = false;
        module.recordCountInterestRates = -1;
        module.showCountInterestRate = 1;
        module.isSearchBoxInterestRates = true;
    }

    /**
    * Get user permission Object
    */
    getUserMenuPermissions(): Observable<UserPermission[]> {
        let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
        return this._commonApiHelper.getUserPermission(CyncConstants.INTEREST_RATE_CODES_MENU_NAME, userRoleId);
    }

    /**
    * Get add permission
    */
    getAddPermission(permissionsArray: any[]): boolean {
        return this._helper.getAddPermission(permissionsArray);
    }

    /**
    * Get edit permission
    */
    getEditPermission(permissionsArray: any[]): boolean {
        return this._helper.getEditPermission(permissionsArray);
    }

    /**
    * Get delete permission
    */
    getDeletePermissions(permissionsArray: any[]): boolean {
        return this._helper.getDeletePermission(permissionsArray);
    }

    /**
    * Export interest rates
    */
    exportData(url: string, filter: string): Observable<any> {
        return this._cyncHttpService.getExportCall(url, filter);
    }

    /**
    * Get calendar year range list
    * @param url 
    */
    getCalendarYearRange(url: string): Observable<CalendarYearModel> {
        return this._cyncHttpService.get(url).map(data => {
            return JSON.parse(data._body);
        });
    }
}
