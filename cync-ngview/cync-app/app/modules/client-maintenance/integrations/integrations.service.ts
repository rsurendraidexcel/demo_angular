import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {

  constructor(private cyncHttpService: CyncHttpService) {

   }

     // get template details (index)
  gettemplatedetails(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

      // get template borrower details (index)
      getBorrowerQb(url: string): Observable<any> {
        return this.cyncHttpService.get(url);
      }
       
       disconnectQuickBookBorrower(url: string, model: any): Observable<any> {
        return this.cyncHttpService.post(url, model);
      }
      connectQuickBookBorrower(url: string): Observable<any> {
        return this.cyncHttpService.get(url);
      }
}
