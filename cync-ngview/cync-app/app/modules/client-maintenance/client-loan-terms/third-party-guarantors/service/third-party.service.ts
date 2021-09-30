import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { ThirdPartyModel,UpdateRequestBody } from '../model/third-party.model'
import { Helper } from '@cyncCommon/utils/helper'

/**
* @class ThirdPartyService
* 
*/
@Injectable()
export class ThirdPartyService {
  constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper, ) { }


  /**
  *  get records from api
  * 
  */
  getDetails(url: string): Observable<ThirdPartyModel> { 
    return this._cyncHttpService.get(url).map(data =><ThirdPartyModel>JSON.parse(data._body));
  }

  /**
  *  post records to api
  * 
  */
  saveThirdParty(endpoint: string, model: UpdateRequestBody): Observable<any> {
    return this._cyncHttpService.post(endpoint, model);    
  }

  /**
  *  patch records to api
  * 
  */
  updateThirdParty(endpoint: string, model: UpdateRequestBody) : Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);   
  }
  
}