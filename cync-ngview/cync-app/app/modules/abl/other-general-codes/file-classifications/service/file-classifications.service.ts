import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { FileClassification,UpdateRequestBody } from '../model/file-classifications.model'
import { Helper } from '@cyncCommon/utils/helper'

@Injectable()
export class FileClassificationsService {
  constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper, ) { }

  /**
    * Method to get the data
    * 
    */
  getDetails(url: string): Observable<FileClassification> { 
    return this._cyncHttpService.get(url).map(data =><FileClassification>JSON.parse(data._body));
  }
  /**
    * post or save the data
    * 
    */
  saveNew(endpoint: string, model: UpdateRequestBody): Observable<any> {
    return this._cyncHttpService.post(endpoint, model);    
  }
  /**
    * update or patch method
    * 
    */
  updateDetails(endpoint: string, model: UpdateRequestBody) : Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);   
  }
  
}