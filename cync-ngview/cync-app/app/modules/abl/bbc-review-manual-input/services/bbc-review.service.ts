import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { RollforwardLogDetailsModel } from '../rollforward-logs-model/rollforward-log';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { InventoryRollforwardLogDetailsModel } from '../receivables-rollforward/inventory-rollforward-model/inventory-rollforward';

@Injectable({
  providedIn: 'root'
})
export class BbcReviewService {

  private rollForwardDivisionCollateralRowData = new BehaviorSubject('');
  private rollForwordLogsRowData = new BehaviorSubject('undefined');
  private eventAction = new BehaviorSubject('none');
  private eventActionInventory = new BehaviorSubject('none');
  private rollForwardDivisionCollateralInventory = new BehaviorSubject('none');
  constructor(
    private _cyncHttpService: CyncHttpService,
    private _apiMapper: APIMapper
  ) { }

  setRollForward(griddata: string) {
    this.rollForwardDivisionCollateralRowData.next(griddata);
  }

  getRollForward(): any {
    return this.rollForwardDivisionCollateralRowData.asObservable();
  }


  /**
   * This Method is used to get all the list of Division
   */
  getDivisionList(url: string): Observable<any> {
    return this._cyncHttpService.get(url)
  }


  /**
  * This Method is used to get all the data of grid
  */
  getinitializeData(url: string): Observable<any> {
    return this._cyncHttpService.get(url)
  }

  /**
 * This Method is used to get all the data of grid
 */
  getRollForwardGridData(url: string): Observable<any> {
    return this._cyncHttpService.get(url)
  }


  /**
   * This Method is used to get all the list of Division
   */
  getCollateralList(url: string): Observable<any> {
    return this._cyncHttpService.get(url)
  }


  /**
* Method to get RollForwardLog Data
* @param url
*/
  getRollForwardLogService(url: string): Observable<any> {
    return this._cyncHttpService.get(url);
  }
  /**
   * Method to get division data
   * @param url
   */
  getDivisionDataService(url: string): Observable<any> {
    return this._cyncHttpService.get(url);
  }
  /**
   * Method to get division data
   * @param url
   */
  createRollForwardLogData(url: string, model: RollforwardLogDetailsModel): Observable<any> {
    return this._cyncHttpService.post(url, model);
  }
  /**
   * Method to get division data
   * @param url
   */
  getcollateralDataService(url: string): Observable<any> {
    return this._cyncHttpService.get(url);
  }
  updateRollForwardLogData(url: string, model: any) {
    return this._cyncHttpService.put(url, model);
  }
  deleteRollForwardLogService(url: string) {
    return this._cyncHttpService.delete(url);
  }
	/**
   * To get Rollforward log data
   * 
   */
  getRollForwardLogDetails(): any {
    return this.rollForwordLogsRowData.asObservable();
  }
  setRollForwardLogDetails(griddata: any) {
    this.rollForwordLogsRowData.next(griddata);
  }


  /**
   *  getAction and setAction 
   */
  getAction(): any {
    return this.eventAction.asObservable();
  }
  setAction(action: string) {
    this.eventAction.next(action);
  }

   /**
   * This Method is used to get all the list of Division
   */
  getBbcStart(url: string): Observable<any> {
    return this._cyncHttpService.get(url)
  }
/**
 * Inventory RollForward
 */
getDivisionData(url: string): Observable<any>{
  return this._cyncHttpService.get(url);
}

getProductGroupData(url: string): Observable<any>{
  return this._cyncHttpService.get(url);
}
getCollateralData(url: string): Observable<any>{
  return this._cyncHttpService.get(url);
}
getInventoryRollForwardDataForDivisonAll(url: string): Observable<any>{
    return this._cyncHttpService.get(url);
}
rollForwardDataService(url: string): Observable<any>{
  return this._cyncHttpService.get(url);
}
creatteInventoryRollForwardLogService(url: string, model: InventoryRollforwardLogDetailsModel): Observable<any>{
  return this._cyncHttpService.post(url, model);
}
  /**
   *  getAction and setAction for inventory
   */
  getActionInventory(): any {
    return this.eventActionInventory.asObservable();
  }
  setActionInventory(action: string) {
    this.eventActionInventory.next(action);
  }
  
  setRollForwardInventory(griddata: string) {
    this.rollForwardDivisionCollateralInventory.next(griddata);
  }

  getRollForwardInventory(): any {
    return this.rollForwardDivisionCollateralInventory.asObservable();
  }
}
