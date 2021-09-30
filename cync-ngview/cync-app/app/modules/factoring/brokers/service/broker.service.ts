import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private selectedBrokerSubTotal = new Subject<any>();

  constructor(private _cyncHttpService: CyncHttpService,  private _helper: Helper) { }
  /**
 * Method to get a broker commission Data
 * @param url
 */
  getBrokerCommissionService(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
  }
  /**
   * This method reset broker commission data
   * @param url
   *
   */
  refreshGrid(url: string): Observable<any> {
    return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, '');
  }
  /**
* Method to get broker commission invoice details
* @param url
*/
  getBrokerCommissionInvoiceDetailsService(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
  }
  /**
* This method saves payable_invoice to broker commission
* @param url
* @param model
*/
  addToBrokerCommission(url: string, model): Observable<any> {
    return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
  }

  releaseBrokerService(url: string, model): Observable<any> {
    return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model)
  }
  /**
* Method to get list of brokers
* @param url
*/
  getBrokerListService(url: string) {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
  }

  /**
* This method to release broker commission
* @param url
* @param model
*/
releaseBrokerCommissionService(url: string, model): Observable<any> {
  return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
}

  setTotalInvoiceAmountPaid(subTotalBrokerFee: any) {
    this.selectedBrokerSubTotal.next(subTotalBrokerFee);
  }
  getTotalInvoiceAmountPaid() {
    return this.selectedBrokerSubTotal.asObservable();
  }

  /**
  * 
  * This method is used to get all the broker inquiry Values
  */
  getBrokerInquiryDetails(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
  }

  /**
* This method to release invoice report
* @param url
* @param model
*/
releaseInvoiceReportService(url: string, model): Observable<any> {
  return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
}

}
