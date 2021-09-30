import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { Helper } from '@cyncCommon/utils/helper';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserTourService {
  public envconfig: any;
  public lenderId: string;
  public tourHost: string;

  constructor(
    private config: AppConfig,
    private httpclient: HttpClient,
    private helper: Helper,
    private cookieService: CookieService
  ) {
    let fd = window.origin;
    let dn = fd.split("//")[1].split(":")[0];
    let lenderName = dn.split(".")[0];
    this.lenderId = this.config.getConfig('lenderId');
    this.tourHost = this.config.getConfig('host_tour_apps');
    console.log("Lender Name::", lenderName);
    console.log("Tour host:", this.tourHost);
  }
  
  getService(url: string): Observable<any> {
    const httpOptions = {
      headers: this.requestHeadersWithAuth()
    };
    let endpoint = this.tourHost + url;
    return this.httpclient.get(endpoint, httpOptions);
  }

  delService(url: string): Observable<any> {
    const httpOptions = {
      headers: this.requestHeadersWithAuth()
    };
    let endpoint = this.tourHost + url;
    return this.httpclient.delete(endpoint, httpOptions);

  }


  putService(url: string, payload_body: any): Observable<any> {
    const httpOptions = {
      headers: this.requestHeadersWithAuth()
    };
    let endpoint = this.tourHost + url;
    return this.httpclient.put(endpoint, payload_body, httpOptions);

  }

  postService(url: string, payload_body: any): Observable<any> {
    const httpOptions = {
      headers: this.requestHeadersWithAuth()
    };
    let endpoint = this.tourHost + url;
    return this.httpclient.post(endpoint, payload_body, httpOptions);
  }

  // S3 upload URL
  async uploadService(url, formdata) {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type':'multipart/form-data',
        'Access-Control-Allow-Origin': '*'
     },
      body: formdata
    }).then(response =>{
      if(response.status === 400){
        return {"message": "Bad Request"};
      } else {
        return response;
      }
    }).then(result => { return result });
  }

  // S3 get Secrete Path return 
  async putS3url(url: string, fileInfo: any) {
   // this.tourHost="http://localhost:4000/api/v1/";
    let endpoint = this.tourHost + url;
    return await fetch(endpoint, {
      method: 'PUT',
      headers: this.fetchHeader(),
      body: JSON.stringify(fileInfo)
    }).then(response => response.json())
      .then(result => result);

  }

  // Header Section for common 
  /*
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin'
  */
  requestHeaders(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return httpHeader;
  }

  requestHeadersWithAuth(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.getBearerToken(),
      'lenderId': this.config.getConfig('lenderId')
    });
    return httpHeader;
  }

  fetchHeader(): any {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.getBearerToken(),
      'lenderId': this.config.getConfig('lenderId')
    };
    return headers;
  }

  requestHeaderFileUpload(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': this.getBearerToken(),
      'lenderId': this.config.getConfig('lenderId')
    });
    return httpHeader;
  }
  getBearerToken(): string {
    if (this.config.MI_ON_LOCAL_SERVER()) {
      return 'Bearer ' + this.helper.getMyLocalToken();
    }
    return 'Bearer ' + this.cookieService.get('cync_authorization')
  }

}
