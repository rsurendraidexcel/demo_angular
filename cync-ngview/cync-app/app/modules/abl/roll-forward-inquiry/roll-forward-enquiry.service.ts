import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RollForwardEnquiryService {

  constructor(private _cyncHttpService: CyncHttpService) { }

  /**
* Method to get a broker commission Data
* @param url
*/
  getRollForwardEnquiryService(url: string): Observable<any> {
    return this._cyncHttpService.get(url);
  }
}
