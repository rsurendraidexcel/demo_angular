import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';

@Injectable({
  providedIn: 'root'
})
export class AssetsInventoryService {
  ineligibleDropdown = new Subject<any>();
  constructor(
    private _cyncHttpService: CyncHttpService,
    private _apiMapper: APIMapper
  ) { }


   /**
   * This Method is used to get all the list of Inventory Summaries dropdown
   */
  getInventorySummaries(url: string): Observable<any> {
   
    return this._cyncHttpService.get(url)
  }


   /**
   * This Method is used to get all the details of selected Inventories
   */
  getInventoryDetails(url: string): Observable<any> {
    
    return this._cyncHttpService.get(url)
  }

    /**
   * This Method is used to create new details Inventories
   */
  postCreateInventory(url: string, model: any): Observable<any> {
    
    return this._cyncHttpService.post(url, model);
  }

      /**
   * This Method is used to update new details Inventories
   */
  putCreateInventory(url: string, model: any): Observable<any> {
    
    return this._cyncHttpService.patch(url, model);
  }

      /**
   * This Method is used to update new details Inventories
   */
  DeleteInventory(url: string): Observable<any> {
    
    return this._cyncHttpService.delete(url);
  }

   /**
   * This Method is used to create new details Ineligible
   */
  postCreateIneligible(url: string, model: any): Observable<any> {
    
    return this._cyncHttpService.post(url, model);
  }

    /**
   * This Method is used to create new details Ineligible
   */
  postIneligible(url: string, model: any): Observable<any> {
    
    return this._cyncHttpService.put(url, model);
  }

      /**
   * This Method is used to update new details Inventories
   */
  DeleteIneligible(url: string): Observable<any> {
    
    return this._cyncHttpService.delete(url);
  }

    /**
   * To get remaining data on summary page
   */
  getRemaningData(url:string): Observable<any> {
    
    return this._cyncHttpService.get(url)
  }

      /**
   * get all ineligible summaries
   */
  getAllIneligibleSummaries(url:string): Observable<any> {
    
    return this._cyncHttpService.get(url)
  }


      /**
   * ineligibility_reasons for ineligibility create/edit drop down
   */
  getIneligibleReasonDropDown(url:string): Observable<any> {
    
    return this._cyncHttpService.get(url)
  }

  setineligibleDropdown(data: any){
    this.ineligibleDropdown.next(data);
  }

  getineligibleDropdown(): Observable<any> {
    return this.ineligibleDropdown.asObservable();
  }
}
