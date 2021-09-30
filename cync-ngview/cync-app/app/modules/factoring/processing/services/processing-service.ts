import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helper } from '@cyncCommon/utils/helper';
import { Observable, Subject } from 'rxjs';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { AppConfig } from '@app/app.config';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProcessingService {
  private lambda_host: string;
  public reFresh= new Subject();
  constructor(
     private http: HttpClient,
     private config: AppConfig,  
     private helper: Helper,
     private cookieService: CookieService) {

    this.lambda_host=this.config.getConfig('host_factoring_node_api');
    console.log('host::',  this.lambda_host);
  }

  getService(url: string): Observable<any> {
    let endPointURL =this.lambda_host + url;
    return this.http.get<any>(endPointURL, { headers: this.requestHeaders() });
  }

  postService(url: string,body:any): Observable<any> {
    let endPointURL =this.lambda_host + url;
    return this.http.post<any>(endPointURL,body, { headers: this.requestHeaders() });
  }

  getInterestStatement(url: any ): Observable<any> {
   let endPointURL = this.lambda_host + url;
    return this.http.get<any>(endPointURL, { headers: this.requestHeaders() });
  }

  getTransactionTypeService(url:string): Observable<any> {  
    let endPointURL = this.lambda_host + url;
    return this.http.get<any>(endPointURL, { headers: this.requestHeaders() });
  }
   createAdjustmentService(url: string, model:any){
    let endPointURL = this.lambda_host + url;
    return this.http.post(endPointURL, model, { headers: this.requestHeaders() });
   }
  
   //Objervable Refresh
   setRefresh(data: any){
    this.reFresh.next(data);
   }
  getRefresh(){
    return this.reFresh.asObservable();
  }
  
  //Utility Method  
  requestHeaders(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.getBearerToken(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
      'lenderId': this.config.getConfig('lenderId')
    });
    return httpHeader;
  }
  //getToken
  getBearerToken(): string {
    if (this.config.MI_ON_LOCAL_SERVER()) {
      return 'Bearer ' + this.helper.getMyLocalToken();
    }
    return 'Bearer ' + this.cookieService.get('cync_authorization');
  }


}
