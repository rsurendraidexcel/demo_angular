import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { ColumnListApiResponseModel, OpearatorListApiResponseModel, DropdownListApiResponseModel, Filters, FilterRules, FiltersModel } from "@app/shared/components/advance-search-popup/advance-search-popup.model";
import { Observable } from 'rxjs/Observable';

/**
 * This is to open advance search popups on entire application
 */
@Injectable()
export class AdvanceSearchPoupService {

    constructor(private _cyncHttpService: CyncHttpService) {
    }
/**
     * This method will get the column List
     * @param endPoint 
     */
    public getColumnList(endPoint: string): Observable<ColumnListApiResponseModel> {
        return this._cyncHttpService.get(endPoint)
        .map(data => <ColumnListApiResponseModel>JSON.parse(data._body));

    }

    /**
     * This method will get the operator List
     * @param endPoint 
     */
    public getOperatorList(endPoint: string): Observable<OpearatorListApiResponseModel> {
        return this._cyncHttpService.get(endPoint)
        .map(data => <OpearatorListApiResponseModel>JSON.parse(data._body));

    }

        /**
     * This method will get the dropdown List for the selected column
     * @param endPoint 
     */
    public getDropdownList(endPoint: string): Observable<DropdownListApiResponseModel> {
        return this._cyncHttpService.get(endPoint)
        .map(data => <DropdownListApiResponseModel>JSON.parse(data._body));

    }

    
    /**
     * 
     * This method to get the advance search Data
     * @param endpoint 
     */
    getAdvanceSearchData(url: string, model: FiltersModel): Observable<any> {
        return this._cyncHttpService.post(url, model);
    }
}