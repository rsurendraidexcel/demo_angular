import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class WebHooksService {

  constructor(
    private _cyncHttpService: CyncHttpService
  ) { }

  getEventList(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.WEBHOOK_HOST, url).map(data => (JSON.parse(data._body)));
  }

  createWebhook(url: any , body : any): Observable<any> { 
    return this._cyncHttpService.postService(CyncConstants.WEBHOOK_HOST, url, body);
  }

  getWebhookList(url: string): Observable<any> {
    return this._cyncHttpService.getService(CyncConstants.WEBHOOK_HOST, url).map(data => (JSON.parse(data._body)));
  }

  deleteWebhook(url: any , body : any): Observable<any> { 
    return this._cyncHttpService.deleteService(CyncConstants.WEBHOOK_HOST, url, body);
  }
}