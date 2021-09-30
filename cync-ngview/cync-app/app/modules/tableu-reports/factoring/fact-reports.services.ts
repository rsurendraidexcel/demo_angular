import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from '@app/app.config';
import { Helper } from '@cyncCommon/utils/helper';
import { CookieService } from 'ngx-cookie-service';
import { ReportConfig } from './model/report-config.model';

@Injectable({
  providedIn: 'root'
})
export class FactReportsService {

  public reportsData: ReportConfig;
  public siteName: string;
  public tableauHost: string;
  public tableauTiketTokenHost: string;

  constructor(
    private config: AppConfig,
    private httpclient: HttpClient,
    private helper: Helper,
    private cookieService: CookieService
  ) { 
    this.getHostInfo();
  }

  getHostInfo(){
      let fd= window.origin;
      let dn=fd.split("//")[1].split(":")[0];
      let hostname=dn.split(".")[0];
      console.log("HostName:", hostname);
      this.siteName =hostname;
      this.tableauHost = this.config.getConfig('host_tableau');
      this.tableauTiketTokenHost = this.config.getConfig('host_tableau_tiket_token');
  }

  getReportConfig(): Observable<ReportConfig> {
    let env = this.config.getEnvName();
    if(env==="local"){ env ="dev";} 
    let url=`./assets/environment/reports/config.reports_${env}.json`;
    return this.httpclient.get<ReportConfig>(url);
  }

  // Get lambda call
  getReportsLambdaCall(url: string, model: any): Observable <any> {
    let httpOptions = {
      headers: this.requestHeaders()
    };
    return this.httpclient.put(url, model, httpOptions);
  }

  getSiteName(): String {
    return this.siteName;
  }
  getTableauTiketTokenHost(): String {
    return this.tableauTiketTokenHost;
   }
   getTableauHost():String{
     return this.tableauHost;
   }

   getLosTikets(): Observable <any> {
    let url =`${this.tableauTiketTokenHost}/tabl/get_token`;
     const httpOptions = {
       headers: new HttpHeaders({
       'Content-Type': 'Application/json',
       'Accept':'Application/json',
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
       'Authorization': this.getBearerToken(),
       'lenderid':this.siteName
       })
     };

    return this.httpclient.get(url,httpOptions);
  }

  requestHeaders(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
    return headers;
  }

  requestHeadersWithAuth(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getBearerToken());
    headers.append('lenderId', this.config.getConfig('lenderId'));
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
    return headers;
  }

  getBearerToken(): string {
    if (this.config.MI_ON_LOCAL_SERVER()) {
      return 'Bearer ' + this.helper.getMyLocalToken();
    }
    return 'Bearer ' + this.cookieService.get('cync_authorization')
  }

}