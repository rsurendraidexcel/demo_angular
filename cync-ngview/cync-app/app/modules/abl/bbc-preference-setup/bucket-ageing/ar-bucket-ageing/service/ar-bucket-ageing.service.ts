import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { ARBucket,UpdateARRequestBody } from '../model/ar-bucket-ageing.model'

@Injectable()
export class ARBucketService {
  constructor(private _cyncHttpService: CyncHttpService) { }

  /**
  * get method
  *
  */
  getARDetails(url: string): Observable<ARBucket> { 
    return this._cyncHttpService.get(url).map(data =><ARBucket>JSON.parse(data._body));
  }

  /**
  * post method
  *
  */
  saveNewUser(endpoint: string, model: UpdateARRequestBody): Observable<any> {
    return this._cyncHttpService.post(endpoint, model);    
  }

  /**
  * patch method
  *
  */
  updateUserDetails(endpoint: string, model: UpdateARRequestBody) : Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);   
  }
  
}