import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QbArAgingSummaryService {

  constructor(private _cyncHttpService: CyncHttpService,
    private _apiMapper: APIMapper) { }

  quickBookPost(url: string, model: any): Observable<any> {
    return this._cyncHttpService.post(url, model);
  }
}
