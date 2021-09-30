import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions, Http, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/catch';
import { AppConfig } from '@app/app.config';
import { HttpInterceptor } from './http.intercepter';
import { CookieService } from 'ngx-cookie-service';
import { Helper } from '@cyncCommon/utils/helper';
import { ResponseContentType } from '@angular/http';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { formatDate } from 'ngx-bootstrap';

@Injectable()
export class CyncHttpService {

  apiEndpoint: string;
  apiHostModule: string;
  constructor(private config: AppConfig, private _http: HttpInterceptor,
    private _helper: Helper, private cookieService: CookieService, private _httpclient: HttpClient) {
    //this.apiEndpoint = this.config.getConfig('host_ror');
  }

  /**
   *
   * @param url
   *
   */
  get(url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.get(this.getAPIBaseUrl() + url, options);
  }

  getWithOpt(url: string, opt: any = {}): Observable<any> {
    let headers = this.getRequestHeaders();
    if(opt["headers"]){
      opt["headers"].forEach(function (h) {
        headers.append(h[0],h[1]);
      })
    }
    let options = new RequestOptions({ headers: headers });
    return this._http.get(this.getAPIBaseUrl() + url, options);
  }

  getV2(url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.get(this.getAPIBaseUrl().replace('v1', 'v2') + url, options);
  }

  getmcl(url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.get(this.getAPIBaseUrl().replace('v1', 'mcl') + url, options);
  }

  /**
   *
   * @param url
   *
   */
  getService(host: string, url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.get(this.getAPIFinanceBaseUrl(host) + url, options);
  }


  /**
   *
   * @param url
   * @param model
   */
  patch(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.patch(this.apiEndpoint + url, model, options);
    return this._http.patch(this.getAPIBaseUrl() + url, model, options);
  }

  patchV2(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.patch(this.apiEndpoint + url, model, options);
    return this._http.patch(this.getAPIBaseUrl().replace('v1', 'v2') + url, model, options);
  }

  patchmcl(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.patch(this.apiEndpoint + url, model, options);
    return this._http.patch(this.getAPIBaseUrl().replace('v1', 'mcl') + url, model, options);
  }

  putFileUpload(url: string, fd: FormData): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeadersFormData() });
    return this._http.patch(this.getAPIBaseUrl() + url, fd, options);
  }
  putmclFileUpload(url: string, fd: FormData): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeadersFormData() });
    return this._http.patch(this.getAPIBaseUrl().replace('v1', 'mcl') + url, fd, options);
  }

  /**
 *
 * @param url
 * @param model
 */
  putService(host: string, url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.patch(this.apiEndpoint + url, model, options);
    return this._http.put(this.getAPIFinanceBaseUrl(host) + url, model, options);
  }

  /**
   *
   * @param url
   * @param model
   */
  post(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.post(this.apiEndpoint + url, model, options);
    return this._http.post(this.getAPIBaseUrl() + url, model, options);
  }

   /**
   *
   * @param url
   * @param model
   */
  postmcl(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.post(this.apiEndpoint + url, model, options);
    return this._http.post(this.getAPIBaseUrl().replace('v1', 'mcl') + url, model, options);
  }

    /**
   *
   * @param url
   * @param fd
   */
    postmclformdata(url: string, fd: FormData): Observable<any> {
      const options = new RequestOptions({ headers: this.getRequestHeadersFormData() });
      return this._http.post(this.getAPIBaseUrl().replace('v1', 'mcl') + url, fd, options);
    }

  /**
   * This is put method  accepting the url and  body
   * @param url 
   * @param model 
   */
  put(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.put(this.getAPIBaseUrl() + url, model, options);
  }

   /**
   * This is put method  accepting the url and  body
   * @param url 
   * @param model 
   */
  putmcl(url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.put(this.getAPIBaseUrl().replace('v1', 'mcl')  + url, model, options);
  }


  /**
  *
  * @param url
  * @param model
  */
  postService(host: string, url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    //return this._http.post(this.apiEndpoint + url, model, options);
    return this._http.post(this.getAPIFinanceBaseUrl(host) + url, model, options);
  }


  /**
  *
  * @param url
  * @param model
  */
  patchService(host: string, url: string, model: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    return this._http.patch(this.getAPIFinanceBaseUrl(host) + url, model, options);
  }



  /**
   * Delete Request
   * @param url
   */
  delete(url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    let endpoint = this.getAPIBaseUrl() + url;
    return this._http.delete(endpoint, options);
  }


  deleteV2(url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    let endpoint = this.getAPIBaseUrl().replace('v1', 'v2') + url;
    return this._http.delete(endpoint, options);
  }

  deleteMcl(url: string): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    let endpoint = this.getAPIBaseUrl().replace('v1', 'mcl') + url;
    return this._http.delete(endpoint, options);
  }


  /**
   * Delete Request
   * @param url
   */
  deleteService(host: string, url: string, param: any): Observable<any> {
    const options = new RequestOptions({ headers: this.getRequestHeaders(), body: param });
    return this._http.delete(this.getAPIFinanceBaseUrl(host) + url, options);
  }

  /**
   * This method will be used to download file
   * @param url
   * @param params
   */
  public exportData(url: any, params) {
    const options = new RequestOptions({ headers: this.getRequestHeaders() });
    var blob;
    return this._http.get(url, options).map(response => {
      var blob = new Blob([response['_body']], { type: 'application/vnd.ms-excel' });
      return blob;
    })
  }


  /**
   *
   */
  getRequestHeaders(): Headers {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
    return headers;
  }

  getRequestHeadersFormData(): Headers {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
    return headers;
  }

  /**
   *
   */
  getBearerToken(): string {
    if (this.config.MI_ON_LOCAL_SERVER()) {
      return 'Bearer ' + this._helper.getMyLocalToken();
    }
    return 'Bearer ' + this.cookieService.get('cync_authorization')
  }

  /**
   * This method to set ModuleName(ProductType) either ABL/Factoring
   * @param apiHostModule
   */
  setAPIHostModule(apiHostModule: string) {
    this.apiHostModule = apiHostModule;
  }

  /**
   * This method is to get domain name based on setAPIHostModule
   */
  getAPIBaseUrl(): string {
    switch (this.apiHostModule) {
      case "Factoring":
        return this.apiEndpoint = this.config.getConfig('host_factoring');
      case "ABL":
        return this.apiEndpoint = this.config.getConfig('host_abl');
      case "Client_Transaction_Abl":
        return this.apiEndpoint = this.config.getConfig('host_ror');
      case "Client_Transaction_Factoring":
        return this.apiEndpoint = this.config.getConfig('host_factoring');
      case "MCL":
        return this.apiEndpoint = this.config.getConfig('host_mcl');
      case "CASH_APP":
        return this.apiEndpoint = this.config.getConfig('host_cash_application');
      case "webhook":
        return this.apiEndpoint = this.config.getConfig('host_webhook');
      default:
        return this.apiEndpoint = this.config.getConfig('host_ror');
    }
  }


  /**
   * This method is to get domain name based on setAPIHostModule
   */
  getAPIFinanceBaseUrl(host: string): string {
    switch (host) {
      case "ABL":
        return this.apiEndpoint = this.config.getConfig('host_abl');
      case "Client_Transaction_Abl":
        return this.apiEndpoint = this.config.getConfig('host_ror');
      case "Client_Transaction_Factoring":
        return this.apiEndpoint = this.config.getConfig('host_factoring');
      case CyncConstants.FINANCE_HOST:
        return this.apiEndpoint = this.config.getConfig('host_finance');
      case CyncConstants.FACTORING_HOST:
        return this.apiEndpoint = this.config.getConfig('host_factoring');
      case "MCL":
        return this.apiEndpoint = this.config.getConfig('host_mcl');
      case "CASH_APP":
        return this.apiEndpoint = this.config.getConfig('host_cash_application');
      case "webhook":
        return this.apiEndpoint = this.config.getConfig('host_webhook');
      default:
        return this.apiEndpoint = this.config.getConfig('host_ror');
    }
  }

  /**
   * This method is to extract data based on column selection or row selection
   */
  getExportCall(url: any, params) {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/vnd.ms-excel');
    headers.append('Content-Type', 'application/vnd.ms-excel');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob, search: params });
    var blob;
    return this._http.get(this.getAPIBaseUrl() + url, options).map(response => {
      var blob = new Blob([response['_body']], { type: 'application/vnd.ms-excel' });
      return blob;
    })
  }

  /**
 * This method is to extract data based on column selection or row selection
 */
  getFinancialExportCall(host: string, url: any, params) {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/vnd.ms-excel');
    headers.append('Content-Type', 'application/vnd.ms-excel');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob, search: params });
    var blob;
    return this._http.get(this.getAPIFinanceBaseUrl(host) + url, options).map(response => {
      var blob = new Blob([response['_body']], { type: 'application/vnd.ms-excel' });
      return blob;
    })
  }


  /**
  * This method will be used to download financial statement template
  * @param host
  * @param url
  */
  public downloadFinanceTemplate(host: string, url: string) {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/vnd.ms-excel');
    headers.append('Content-Type', 'application/vnd.ms-excel');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));

    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    var blob;
    return this._http.get(this.getAPIFinanceBaseUrl(host) + url, options).map(response => {
      var blob = new Blob([response['_body']], { type: 'application/vnd.ms-excel' });
      return blob;
    })
  }

  /**
   * this method will upload file to server
   * @param url
   * @param formData
   */
  public uploadFile(url: string, formData: FormData): Observable<HttpEvent<{}>> {
    let headers = new HttpHeaders({
      'Authorization': this.getBearerToken(),
      'lenderId': this.config.getConfig('lenderId'),
      'Accept': 'application/json'
    });
    const req = new HttpRequest('POST', this.getAPIBaseUrl() + url, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: headers
    });
    return this._httpclient.request(req);
  }

  /**
   * this method will Update file to server
   * @param url
   * @param formData
   */
  public uploadFileUpdate(url: string, formData: FormData): Observable<HttpEvent<{}>> {
    let headers = new HttpHeaders({
      'Authorization': this.getBearerToken(),
      'lenderId': this.config.getConfig('lenderId'),
      'Accept': 'application/json'
    });
    const req = new HttpRequest('PUT', this.getAPIBaseUrl() + url, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: headers
    });
    return this._httpclient.request(req);
  }


  /**
  * this method will upload file to server for finance statement
  * @param url
  * @param formData
  */
  public uploadFileFinance(host: string, url: string, formData: FormData): Observable<any> {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    //headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
    const options = new RequestOptions({ headers: headers });
    return this._http.post(this.getAPIFinanceBaseUrl(host) + url, formData, options);
  }


  /**
* This method is to extract data based on column selection or row selection
*/
  postPdfExportCall(url: any, model: any) {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    var blob;
    return this._http.post(this.getAPIBaseUrl() + url, model, options).map(response => {
      var blob = new Blob([response['_body']], { type: 'application/pdf' });
      return blob;
    })
  }

  /**
   *
   * @param url
   * @param model
   */
  patchExportCall(url: string, model: any): Observable<any> {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    var blob;
    return this._http.patch(this.getAPIBaseUrl() + url, model, options).map(response => {
      var blob = new Blob([response['_body']], { type: 'application/vnd.ms-excel' });
      return blob;
    })
  }

  /**
  * Update grid config data
  * @param url 
  * @param data 
  */
  putWithOption(host: string, url: string, data: FormData): Observable<any> {
    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', this.getBearerToken());
    const options = new RequestOptions({ headers: headers });
    return this._http.put(this.getAPIFinanceBaseUrl(host) + url, data, options);
  }
}
