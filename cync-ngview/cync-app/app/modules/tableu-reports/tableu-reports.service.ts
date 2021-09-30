import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { Helper } from '@cyncCommon/utils/helper';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TableuReportsService {
  
  public envconfig: any;
  public lenderId: string;
  public siteName: string;
  public tableauHost: string;
  public tableauTiketTokenHost: string;
  public hostLambdaApi: string;
 // public api_authToken: string;

  constructor( 
    private config: AppConfig, 
    private httpclient: HttpClient,
    private helper: Helper,
    private cookieService: CookieService
    ) {
      let fd= window.origin;
      let dn=fd.split("//")[1].split(":")[0];
      let hostname=dn.split(".")[0];
      console.log("HostName:", hostname);
      this.lenderId = this.config.getConfig('lenderId');
      this.siteName =hostname;
      this.tableauHost = this.config.getConfig('host_tableau');
      this.tableauTiketTokenHost = this.config.getConfig('host_tableau_tiket_token');
      this.hostLambdaApi = this.config.getConfig('host_lambda_api');
      //this.api_authToken = this.config.getConfig('authorization_token');
     }

   getTableauToken(url: string): Observable<any> {
        const httpOptions = {
          headers: this.requestHeaders()
        };
	    	return this.httpclient.get(url, httpOptions);
   }

   getTableauTiketTokenHost(): String {
    return this.tableauTiketTokenHost;
   }
   
   getTableauHost():String{
     return this.tableauHost;
   }
   getSiteName(): String {
     return this.siteName;
   }
   getHostLambdaApi(): String {
     return this.hostLambdaApi;
   }

   getLosTikets(): Observable <any> {
     let url =`${this.tableauTiketTokenHost}/tabl/get_token`;
     // let url = `${this.tableauTiketTokenHost}/reporting/api/reporting/ticket?realm=${this.siteName}`;
      const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json',
        'Accept':'Application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
        'Authorization': this.getBearerToken(),
        'lenderid': this.siteName
        })
      };

     return this.httpclient.get(url,httpOptions);
   }

   getLamdaService(borrowerid:number ): Observable<any>{
    let urlpath = `${this.hostLambdaApi}/data-integration`;
    console.info('Lambda API URL:', urlpath);
    let payloadbody = {
         "lenderHost":  this.siteName,
         "borrowerid": borrowerid
    };
    let httpOptions = {
      headers: this.requestHeaders()
    };
      return this.httpclient.put(urlpath, payloadbody, httpOptions);
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
