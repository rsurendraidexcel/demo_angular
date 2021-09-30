import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { FactoringInterestSetupModel } from '../model/factoring-interest-setup';

@Injectable({
  providedIn: 'root'
})
export class FactoringInterestSetupService {
  awsLambdaHost: string;
  constructor(
    private cookieService: CookieService,
    private config: AppConfig, private http: HttpClient, private helper: Helper,) {
      this.awsLambdaHost = this.config.getConfig('host_factoring_node_api');
      console.log('host::',  this.awsLambdaHost);
  }

  /**
 * Method to get a  setup Data
 * @param url
 */
  
  getInterestNewSetUp(): Observable<any> {
    let url = `${this.awsLambdaHost}factoring/interest/factoring_interest_setups/new_setup`;
    return this.http.get(url, { headers: this.requestHeaders() });
  }
  getInterestSetupData(id: any): Observable<any> {
    let url = `${this.awsLambdaHost}factoring/interest/factoring_interest_setups/${id}`;
    return this.http.get(url, { headers: this.requestHeaders() });
  }

  postInterestSetup(url: string, model: any): Observable<any> {
    const httpOptions = { headers: this.requestHeaders() };
    return this.http.post(this.awsLambdaHost + url, model, httpOptions);
  }


//pop-up Adjustment 
getService(url): Observable<any> {
  let endpoint = `${this.awsLambdaHost}${url}`;
  return this.http.get(endpoint,  { headers: this.requestHeaders() });
}

postService(url: string, model: any): Observable<any> {
  const httpOptions = { headers: this.requestHeaders() };
  return this.http.post(this.awsLambdaHost + url, model, httpOptions);
}

deleteService(url:string): Observable<any> {
  let endpoint = `${this.awsLambdaHost}${url}`;
  return this.http.delete(endpoint, { headers: this.requestHeaders() });
}

updateService(url: string, model: any): Observable<any> {
  const httpOptions = { headers: this.requestHeaders() };
  return this.http.put(this.awsLambdaHost + url, model, httpOptions);
}

  //Utility Method  
  requestHeaders(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
      'Authorization': this.getBearerToken(),
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



  editSetupService(client_id):Observable<any>{
    const httpOptions = { headers: this.requestHeaders() };
    let url = `${this.awsLambdaHost}factoring/interest/factoring_interest_setups/can_edit/${client_id}`;
    return this.http.get(url, httpOptions);
  }

  updateInterestSetupService(model:any, id:string):Observable<any>{
    const httpOptions = { headers: this.requestHeaders() };
    let url = `${this.awsLambdaHost}factoring/interest/update_factoring_interest_setups/${id}`
    return this.http.put(url, model, httpOptions);
  }
}  