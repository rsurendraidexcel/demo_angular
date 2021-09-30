import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportQuickbookInvoiceService {

  constructor(private _cyncHttpService: CyncHttpService) { }

  importquickBookInvoices(url: string, model: any): Promise<any> {
    return this._cyncHttpService.post(url, model).toPromise();
  }
  qbImporttoCync(url: string, model: any): Observable<any> {
    return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model).map(data => <any>JSON.parse(data._body));
  }

  getLastModifierDateTime(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => <any>JSON.parse(data._body));
  }
}
