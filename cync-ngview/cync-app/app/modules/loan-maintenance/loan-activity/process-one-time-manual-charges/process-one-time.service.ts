import { Injectable } from '@angular/core';
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessOneTimeService {

  constructor(
    private _cyncHttpService: CyncHttpService,

  ) { }

    /**
       * Method to get Loan id dropdown value for ABL
       * @param url
       */
      getAblLoandetails(url: string): Observable<any> {
        return this._cyncHttpService.get(url).map(data => <any>JSON.parse(data._body));
      }

       /**
       * Method to get Loan id dropdown value for non ABL
       * @param url
       */
      getNonAblLoandetails(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }

        /**
       * Method to get grid value for ABL
       * @param url
       */
      getAblGriddetails(url: string): Observable<any> {
        return this._cyncHttpService.get(url).map(data => <any>JSON.parse(data._body));
      }

       /**
       * Method to get grid value for non ABL
       * @param url
       */
      getNonAblGriddetails(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }

      /**
       * Method to get grid value for ABL
       * @param url
       */
      postAblGriddetails(url: string, model: any): Observable<any> {
        return this._cyncHttpService.post(url, model);
      }

      /**
       * Method to post grid value for non ABL
       * @param url
       */
      postNonAblGriddetails(url: string, model: any): Observable<any> {
        return this._cyncHttpService.postService('MCL', url, model);
    }

    getRolesandPermissions(url: string): Observable<any> {
      return this._cyncHttpService.get(url);
    }

}
