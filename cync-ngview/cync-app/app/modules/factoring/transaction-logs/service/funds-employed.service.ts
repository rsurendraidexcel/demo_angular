import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class FundsEmployedService {

  constructor(private http: HttpClient,private _cyncHttpService: CyncHttpService,  private _helper: Helper) { }
  /**
 * Method to get a broker commission Data
 * @param url
 */
getFundsEmployedService(url: string): Observable<any> {
  return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url);
}

}
