import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CookieService } from 'ngx-cookie-service';
import { Helper } from '@cyncCommon/utils/helper';

@Injectable()
export class CyncCustomHttpService {
  apiEndpoint: string;
  apiHostModule: string;
  constructor(
    private config: AppConfig, 
    private http: HttpClient,
    private helper: Helper, 
    private cookieService: CookieService
    ) {
        this.apiHostModule = this.getAPIBaseUrl();
        console.log("Default A URL=>", this.apiHostModule);
     }
  /**
   * API v1 Services Call
   * @param url
   *
   */
  get(url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.get(this.getAPIBaseUrl() + url, options);
  }
  patch(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.patch(this.getAPIBaseUrl() + url, model, options);
  }
  putFileUpload(url: string, fd: FormData): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.patch(this.getAPIBaseUrl() + url, fd, options);
  } 
  put(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.put(this.getAPIBaseUrl() + url, model, options);
  }

  putmclFileUpload(url: string, fd: FormData): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.patch(this.getAPIBaseUrl().replace('v1', 'mcl') + url, fd, options);
  }

  getService(host: string, url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.get(this.getAPIBaseUrl(host) + url, options);
  }
  
  /**
   * @param url
   * @param model
   */
  post(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.post(this.getAPIBaseUrl() + url, model, options);
  }
   /**
   * Delete Request
   * @param url
   */
  delete(url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    let endpoint = this.getAPIBaseUrl() + url;
    return this.http.delete(endpoint, options);
  }

 // =================================V2 API Call ============================//
 // API v2 Call Section   
  getV2(url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.get(this.getAPIBaseUrl().replace('v1', 'v2') + url, options);
  }

  getmcl(url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.get(this.getAPIBaseUrl().replace('v1', 'mcl') + url, options);
  }
  /**
   *
   * @param url
   * @param model
   */
  patchV2(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.patch(this.getAPIBaseUrl().replace('v1', 'v2') + url, model, options);
  }
  patchmcl(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.patch(this.getAPIBaseUrl().replace('v1', 'mcl') + url, model, options);
  }

   /**
   *
   * @param url
   * @param model
   */
  postmcl(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.post(this.getAPIBaseUrl().replace('v1', 'mcl') + url, model, options);
  }

    /**
   *
   * @param url
   * @param fd
   */
    postmclformdata(url: string, fd: FormData): Observable<any> {
      let options = { headers: this.requestHeaders() };
      return this.http.post(this.getAPIBaseUrl().replace('v1', 'mcl') + url, fd, options);
    }

   /**
   * This is put method  accepting the url and  body
   * @param url 
   * @param model 
   */
  putmcl(url: string, model: any): Observable<any> {
    let options = { headers: this.requestHeaders() };
    return this.http.put(this.getAPIBaseUrl().replace('v1', 'mcl')  + url, model, options);
  }

  deleteV2(url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    let endpoint = this.getAPIBaseUrl().replace('v1', 'v2') + url;
    return this.http.delete(endpoint, options);
  }

  deleteMcl(url: string): Observable<any> {
    let options = { headers: this.requestHeaders() };
    let endpoint = this.getAPIBaseUrl().replace('v1', 'mcl') + url;
    return this.http.delete(endpoint, options);
  }

//=============================================//
// Other Utility Method Section

requestHeaders(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getBearerToken(),
        'lenderId': this.config.getConfig('lenderId'),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin'
    });
    return httpHeader;
}

  getBearerToken(): string {
    if (this.config.MI_ON_LOCAL_SERVER()) {
      return 'Bearer ' + this.helper.getMyLocalToken();
    }
    return 'Bearer ' + this.cookieService.get('cync_authorization');
  }


  /**
   * This method is to get domain name based on setAPIHostModule
   */
  getAPIBaseUrl(host?: string): string {
    switch (host) {
      case CyncConstants.FACTORING_HOST:
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

}