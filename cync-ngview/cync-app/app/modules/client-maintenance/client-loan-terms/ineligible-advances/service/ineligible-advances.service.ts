import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { IneligibleAdvancesModel } from '../model/ineligible-advances.model';
import { CyncConstants } from '@cyncCommon/utils/constants';


/**
 * service for getting the data from api
 */
@Injectable()
export class IneligibleAdvancesService {
  constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper,
    private _apiMapper: APIMapper) { }

  getIneligibleAdvancesData(url: string): Observable<IneligibleAdvancesModel> {
    return this._cyncHttpService.get(url).map(data => <IneligibleAdvancesModel>JSON.parse(data._body));

  }
}