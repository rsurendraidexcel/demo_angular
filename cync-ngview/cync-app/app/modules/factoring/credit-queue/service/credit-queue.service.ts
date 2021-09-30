import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { AllCreditQueue, ListCreditQueue, DebtorDropdown, ClientDropdown } from "../model/credit-queue.model";
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { Helper } from "@cyncCommon/utils/helper";
import { SelectDropDown } from "@app/shared/models/select-dropdown.model";
import { CyncConstants } from '@cyncCommon/utils/constants';

/**
 * @author:Shruti Karekal
 */
@Injectable()
export class CreditQueueService {
    constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper) { }
  

    /**
     * 
     * This method is used to get all the credit Queue Values
     */
    getCreditQueueDebtorValues(url: string): Observable<any> {
        return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => (<any>JSON.parse(data._body)));
    }


    /**
     * 
     * This method is used to get all the credit Queue Values
     */
    getCreditQueueValues(url: string): Observable<any> {
        return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => (<any>JSON.parse(data._body)));
    }

     /**
     * This method is used to get all filter credit Queue Values
     * @param url
     * @param model
     */
    getFilteredData(url: string, model: any): Observable<any> {
        return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model).map(data => (<AllCreditQueue>JSON.parse(data._body)));
    }

    /**
     * This method saves the new credit queue
     * @param url
     * @param model
     */
    createCreditQueue(url: string, model: any): Observable<any> {
        return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
    }

    /**
     * This method updates existing credit queue
     * @param url
     */
    updateCreditQueue(url: string, model: any): Observable<any> {
        return this._cyncHttpService.patchService(CyncConstants.FACTORING_HOST, url, model);
    }

        /**
     * This method saves the new credit queue
     * @param url
     * @param model
     */
    withdrawCreditQueue(url: string, model: any): Observable<any> {
        return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model).map(data => (<AllCreditQueue>JSON.parse(data._body)));
    }
}