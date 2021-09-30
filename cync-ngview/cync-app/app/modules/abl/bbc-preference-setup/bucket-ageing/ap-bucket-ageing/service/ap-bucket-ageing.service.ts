import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { APBucket,UpdateAPRequestBody } from '../model/ap-bucket-ageing.model'

@Injectable()
export class APBucketService {
  constructor(private _cyncHttpService: CyncHttpService) { }


  /**
  * get method
  *
  */
  getAPDetails(url: string): Observable<APBucket> { 
    return this._cyncHttpService.get(url).map(data =><APBucket>JSON.parse(data._body));
  }

  /**
  * post method
  *
  */
  saveNewAP(endpoint: string, model: UpdateAPRequestBody): Observable<any> {
    return this._cyncHttpService.post(endpoint, model);    
  }

  /**
  * patch method
  *
  */
  updateAPDetails(endpoint: string, model: UpdateAPRequestBody) : Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);   
  }
  
}