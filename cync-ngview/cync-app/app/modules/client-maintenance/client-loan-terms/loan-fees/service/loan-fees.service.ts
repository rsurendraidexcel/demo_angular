import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { LoanFeeModel } from '../model/loan-fees.model';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class LoanFeeService {
  constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper,
    private _apiMapper: APIMapper) { }

  getLoanFeeData(url: string): Observable<LoanFeeModel> {
    return this._cyncHttpService.get(url).map(data => <LoanFeeModel>JSON.parse(data._body));

  }
}