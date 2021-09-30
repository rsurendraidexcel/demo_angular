import { Injectable } from '@angular/core';
import { CyncCustomHttpService } from '@cyncCommon/services/cync-custom-http-service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuickbookService {

  constructor( private cyncService: CyncCustomHttpService) { }

  importQbInvoices(url: string, model: any): Observable<any> {
    return this.cyncService.post(url, model);
  }
  getQbService(host: string,url:string):  Observable<any> {
    return this.cyncService.getService(host, url);
  }
}
