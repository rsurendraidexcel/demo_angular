import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class CustomRatiosService {

  constructor(
    private httpService: CyncHttpService
  ) { }

  /**
  * This method saves the new Ratio
  * @param url
  * @param model
  */
  post(url: string, model: any): Observable<any> {
    return this.httpService.postService(CyncConstants.FINANCE_HOST, url, model);
  }

  /**
  * This method to update an existing Ratio
  * @param url
  * @param model
  */
 update(url: string, model: any): Observable<any> {
  return this.httpService.putService(CyncConstants.FINANCE_HOST, url, model);
}

  /**
* This method is to get the Ratio category list
* @param url
* @param model
*/
  getCategories(url: string): Observable<any> {
    return this.httpService.getService(CyncConstants.FINANCE_HOST, url).map(res => res.json());
  }

  /**
   * Service to Get the List of items under Financial Statement
   */
  getParameters(url: string): Observable<any> {
    return this.httpService.getService(CyncConstants.FINANCE_HOST, url).map(data => JSON.parse(data._body));
  }

  /**
    * Service to Get the List of custom formulas
    */
  getCustomFormulas(url: string): Observable<any> {
    return this.httpService.getService(CyncConstants.FINANCE_HOST, url).map(data => JSON.parse(data._body));
  }

  /**
     * Service Method to delete Custom Formula
     * @param url
     */
  deleteCustomFormula(url: string, param: any): Observable<any> {
    return this.httpService.deleteService(CyncConstants.FINANCE_HOST, url, param);
  }
}