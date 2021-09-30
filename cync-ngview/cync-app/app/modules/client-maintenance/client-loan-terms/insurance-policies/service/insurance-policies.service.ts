import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { InsPoliciesModel, UpdateRequestBody } from '../model/insurance-policies.model'
import { Helper } from '@cyncCommon/utils/helper'

/**
* 
* @author - Lavish
*/
@Injectable()
export class InsPoliciesService {
  constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper, ) { }

  /**
  * 
  * @returns - GET API response
  */
  getIPDetails(url: string): Observable<InsPoliciesModel> {
    return this._cyncHttpService.get(url).map(data => <InsPoliciesModel>JSON.parse(data._body));
  }

  /**
  * 
  * @returns - POST API response
  */
  saveInsPolicies(endpoint: string, model: UpdateRequestBody): Observable<any> {
    return this._cyncHttpService.post(endpoint, model);
  }

  /**
  * 
  * @returns - PATCH API response
  */
  updateInsPolicies(endpoint: string, model: UpdateRequestBody): Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);
  }

}