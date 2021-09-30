import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class FactoringFeeSetupService {

  feeSetup = new Subject<any>();
  feeSetup1 = new Subject<any>();
  editClicked = new Subject<any>();
  feeCalculationMethod = new Subject<any>();
  maximumFeeValue = new Subject<any>();
  feeId = new Subject<any>();
  feeName =  new Subject<any>();;

  constructor(private _cyncHttpService: CyncHttpService) { }

  /**   
   * Method to get fee setup id
   * @param url
   */
  updateFeeSetupDataService(url: string, model: any): Observable<any> {
    return this._cyncHttpService.putService(CyncConstants.FACTORING_HOST, url, model);

  }

  /**
 * Method to get a fee setup Data
 * @param url
 */
  getFeeSetupDataService(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);

  }

  // share  a fee setup Data
  getFeeTierData(): Observable<any> {
    return this.feeSetup.asObservable();
  }

  setFeeTierData(data: any) {
    this.feeSetup.next(data);
  }
  // share  a fee setup Data
  getFeeTierData1(): Observable<any> {
    return this.feeSetup1.asObservable();
  }

  setFeeTierData1(data: any) {
    this.feeSetup1.next(data);
  }

  // share  a fee setup Data
  getEditValue(): Observable<any> {
    return this.editClicked.asObservable();
  }

  setEditValue(data: any) {
    this.editClicked.next(data);
  }

  getFeeCalculationMethod(): Observable<any> {
    return this.feeCalculationMethod.asObservable();
  }
  setFeeCalculationMethod(data: any) {
    this.feeCalculationMethod.next(data);
  }
  getMaximumFeeValue(): Observable<any> {
    return this.maximumFeeValue.asObservable();
  }
  setMaximumFeeValue(data: any) {
    this.maximumFeeValue.next(data);
  }

  getAllFeeNamesService(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);

  }
  addNewFeeDataService(url: string, model: any): Observable<any> {
    return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
  }
  getSelectedFeeNameData(url: string) {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
  }
  getFeeId(): Observable<any> {
    return this.feeId.asObservable();
  }
  setFeeId(data: any) {
    this.feeId.next(data);
  }
  getHistoryDataService(url:string){
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
  }
  getFeeNames(): Observable<any> {
    return this.feeName.asObservable();
  }
  setFeeNames(data: any) {
    this.feeName.next(data);
  }
}
