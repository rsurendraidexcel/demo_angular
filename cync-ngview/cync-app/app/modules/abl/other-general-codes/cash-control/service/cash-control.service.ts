import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CashControlRequestBody, CashControlData, EditCashData } from '../model/cash-control.model';

@Injectable({
  providedIn: 'root'
})
export class CashControlService {

  constructor(private _cyncHttpService: CyncHttpService,
    private _apiMapper: APIMapper) { }

  getcashControl(url: string): Observable<any> {
    return this._cyncHttpService.get(url);
  }

  /**
 * 
 * This method to add cash control Details
 * @param endpoint 
 */
  addCashControl(url: string, model: any): Observable<any> {
    return this._cyncHttpService.post(url, model);
  }

  /**
   * 
   * This method to Update cash control Details
   * @param endpoint
   */
  updateCashControl(url: string, model: any): Observable<any> {
    return this._cyncHttpService.patch(url, model);
  }

  /**
   * This method have two parameter 
   * @param endPoint 
   * @param cashControlId
   */
  public getCashControlDetail(endPoint: string, cashControlId: string): Observable<EditCashData> {
    let url = endPoint.replace("{id}", cashControlId);
    return this._cyncHttpService.get(url).map(data => (<EditCashData>JSON.parse(data._body)));
  }

  /**
   * Delate Method have id params
   * @url
   */
  delateCashControl(url: any): Observable<any> {
    return this._cyncHttpService.delete(url);
  }

}
