import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { Helper } from "@cyncCommon/utils/helper";
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { BehaviorSubject } from 'rxjs';
import { data } from 'jquery';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanEnquiryService {

    private totalRowCount = new BehaviorSubject({ displayRowCount: 0, totalRowCount: 0 });
    getTotalRowCount = this.totalRowCount.asObservable();

    constructor(
        private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper,
        private http: HttpClient
    ) { }

    /**
    * Set AG-Grid Status bar total count value
    * @param data 
    */
    setTotalRowCount(data: any) {
        this.totalRowCount.next(data);
    }

    /**
    * Method to get a list of Loan Enquiry Data
    * @param url
    */
    getLoanEnquiryDataList(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }

    /**
   * Method to get borrower first transaction date
   * @param url
   */
    getBorrowerTransactionDate(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }

    /**
    * Get Check Image Url
    * @param url 
    */
    getCheckImageUrl(url: string): any {
        return this._cyncHttpService.getService('CASH_APP', url).map(data => JSON.parse(data._body));
    }

    /**
    * Get grid config
    * @param url 
    */
    public getGridConfig(url): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => JSON.parse(data._body));
    }

    /**
    * Save grid config
    * @param url 
    * @param body 
    */
    public saveGridConfig(url, body) {
        let formData: FormData = new FormData();
        formData.append('grid_config', JSON.stringify(body));
        return this._cyncHttpService.putWithOption('MCL', url, formData);
    }

    /**
    * Get Bearer Token value
    */
    getBearerToken() {
        return this._cyncHttpService.getBearerToken();
    }

    /**
    * Get API Base URL
    * @param host 
    */
    getAPIBaseUrl(host: string): any {
        return this._cyncHttpService.getAPIFinanceBaseUrl(host);
    }

    /**
       * Method to get user history of bulk export
       * @param url
       */
    getBulkExportHistory(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }

       /**
       * Method to get user place request of bulk export
       * @param url
       */
      getBulkExportRequest(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }

        /**
       * Method to get download link of bulk export
       * @param url
       */
      getBulkExportDownloadApi(url: string, id: any): Observable<any> {
        return this._cyncHttpService.postService('MCL', url, id);
    }

}
