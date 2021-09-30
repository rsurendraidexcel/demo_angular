import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ExceptionDetail, ExceptionListApiResponseModel, OperatorOrValueTypeListModel, LenderExceptionRequestBody } from '../model/exceptions.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';

@Injectable()
export class ExceptionService {

    constructor(private _cyncHttpService: CyncHttpService,
        private _apiMapper: APIMapper) { }

    /**
     * This method will get the exception List
     * @param endPoint 
     */
    public getExceptionList(endPoint: string): Observable<ExceptionListApiResponseModel> {
        return this._cyncHttpService.get(endPoint).map(data => this.customizeExceptionListAPIResponse(<ExceptionListApiResponseModel>JSON.parse(data._body)));

    }

    /**
     * 
     * @param apiResponse 
     */
    private customizeExceptionListAPIResponse(apiResponse: ExceptionListApiResponseModel): ExceptionListApiResponseModel {
        apiResponse.lender_exception.forEach(eachException =>{
            eachException.system_defined_str = "No";
            if (eachException.system_defined) {
                eachException.system_defined_str = "Yes";
            }
        })

        return <ExceptionListApiResponseModel>apiResponse;
    }



    /**
     * This method will get the exception detail based on exceptionId
     * @param pageNumber 
     */
    public getExceptionDetails(endPoint: string, exceptionId: string): Observable<ExceptionDetail> {
        endPoint = endPoint.replace("{id}", exceptionId);
        return this._cyncHttpService.get(endPoint).map(data => (<ExceptionDetail>JSON.parse(data._body)));
    }

    /**
     * This method to get end point based on exception dropdown
     * @return endPoint
     */
    getOperatorOrValueList(url: string): Observable<OperatorOrValueTypeListModel> {
        return this._cyncHttpService.get(url).map(data => <OperatorOrValueTypeListModel>JSON.parse(data._body));
    }

    /**
     * 
     * This method to add Exception Details
     * @param endpoint 
     */
    addlenderException(url: string, model: LenderExceptionRequestBody): Observable<any> {
        return this._cyncHttpService.post(url, model);
    }

    /**
     * 
     * This method to Update Exception Details
     * @param endpoint
     */
    updateLenderException(url: string, model: LenderExceptionRequestBody): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }

    /**
    * 
    * This method to Delete Exception Details
    * @param endpoint
    */
    deleteException(url: string): Observable<any> {
        return this._cyncHttpService.delete(url);
    }

    /**
        * 
        * This method to Export Exception Details
        * @param endpoint
        */
    exportException(url: string, filter: string): Observable<Blob> {
        return this._cyncHttpService.getExportCall(url, filter);
    }



}