import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Helper } from '@cyncCommon/utils/helper';
import { CookieService } from 'ngx-cookie-service';
import { MenuBreadCrumbModel, CurrentSessionStateModel } from '../model/menu.model'
import { AppConfig } from '@app/app.config';
import { CyncCustomHttpService } from '@cyncCommon/services/cync-custom-http-service';

/**
 * @author : Saakshi, Surendra
 * This contains methods for api calls required fro navbar service
 */

@Injectable()
export class NavbarService {
    constructor(
        private _cyncHttpService: CyncHttpService,
        private helper: Helper,
        private config: AppConfig, 
        private httpClient:HttpClient,
        private cyncService: CyncCustomHttpService,
        private cookieService: CookieService
        ) {
    }
    /**
     * Method to call all_menus api
     * @param url 
     */
    getMenus(url: string): Observable<any> {
        return this.cyncService.get(url).pipe(map(res => res[0]));
    }

    /**
     * Method to get current state
     * @param url 
     */
    getCurrentState(url: string): Observable<CurrentSessionStateModel> {
        return this._cyncHttpService.get(url).map(data => JSON.parse(data._body).current_session_state
        );
    }

    /**
     * Method to get page display count based on system parameter setting
     * @param url 
     */
    getPageDisplayCount(url: string): Observable<any> {
        return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
    }

    postAction(url: string, model: any ): Observable<any> {
        return this._cyncHttpService.post(url,model).map(data => JSON.parse(data._body));
    }

    getService(url):Observable<any>{
       let httpOptions = {
           headers: this.requestHeaders()
        };
      return  this.httpClient.get(url, httpOptions);
    } 

    requestHeaders(): HttpHeaders {
        const httpHeader: HttpHeaders = new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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