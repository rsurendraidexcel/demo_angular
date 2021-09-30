import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private cyncHttpService: CyncHttpService) { }

 /**
 * Method to get a list of invoice validation
 * @param url
 */
getInvoiceList(url: string): Observable<any> {
  return this.cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => <any>JSON.parse(data._body));
 }

 /**
 * Method to post a list of invoice validation
 * @param url
 */

 postInvoiceList(url: string, model: any): Observable<any> {
  return this.cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model).map(data => <any>JSON.parse(data._body));
 }

  /**
 * Method to put a list of invoice validation
 * @param url
 */

putInvoiceList(url: string, model: any): Observable<any> {
  return this.cyncHttpService.putService(CyncConstants.FACTORING_HOST, url, model).map(data => <any>JSON.parse(data._body));
 }

   /**
 * Method to delete a list of invoice validation
 * @param url
 */

deleteInvoiceList(url: string, id: any): Observable<any> {
  return this.cyncHttpService.deleteService(CyncConstants.FACTORING_HOST, url, id).map(data => <any>JSON.parse(data._body));
 }
}
