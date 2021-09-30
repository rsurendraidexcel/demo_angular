import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { PersonalGuarantorsModel, UpdateRequestBody } from '../model/personal-guarantors.model'
import { Helper } from '@cyncCommon/utils/helper'

/**
* @class PersonalGuarantorsService
* 
*/
@Injectable()
export class PersonalGuarantorsService {
  constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper, ) { }

  /**
  *  get records from api
  * 
  */
  getDetails(url: string): Observable<PersonalGuarantorsModel> {
    return this._cyncHttpService.get(url).map(data => <PersonalGuarantorsModel>JSON.parse(data._body));
  }

  /**
  *  post records to api
  * 
  */
  savePersonalGuarantors(endpoint: string, model: UpdateRequestBody): Observable<any> {
    return this._cyncHttpService.post(endpoint, model);
  }

  /**
  *  patch records to api
  * 
  */
  updatePersonalGuarantors(endpoint: string, model: UpdateRequestBody): Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);
  }

}