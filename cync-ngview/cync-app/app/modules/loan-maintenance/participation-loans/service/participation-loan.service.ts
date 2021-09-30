import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipationLoanService {

  constructor(private _cyncHttpService: CyncHttpService) { }


  /**
  * Method to get a list of Loan Categories List
  * @param url
  */
  getLoanCategoriesList(url: string): Observable<any> {
    return this._cyncHttpService.get(url).map(data => <any>JSON.parse(data._body));
  }

  /**
  * Method to get a list of Loan Enquiry Data
  * @param url
  */
  getMappedAndUnmappedLoanList(url: string): Observable<any> {
    return this._cyncHttpService.get(url).map(data => <any>JSON.parse(data._body)); 
   }

   mapLoanService(url:string,model:any){
     return this._cyncHttpService.patch(url,model);

   }

}
