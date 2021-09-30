// Promise Version
import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { AppConfig } from '../../app/app.config';
import { MessageServices } from '../component/message/message.component';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ResponseContentType } from '@angular/http';
import { Helper } from '@cyncCommon/utils/helper';
import { CustomErrorService } from '@cyncCommon/component/custom-error/custom-error.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class CustomHttpService {
	// URL to web api	
	serviceUrl: string;
	authToken: any;
	currentModule: any;
	cyncCookie: any;
	isSessionTimeout: boolean = false;

	constructor(private _router: Router,
		private _helper: Helper,
		private http: Http,
		private config: AppConfig,
		private _message: MessageServices,
		private _location: Location,
		private cookieService: CookieService,
		private _oopsService: CustomErrorService
	) {
		this.currentModule = this._router.url.split('/')[1];
		this.cyncCookie = this.cookieService.get('cync_authorization');
		if (this.cyncCookie) {
			this.authToken = 'Bearer ' + this.cyncCookie;
		} else {
			if (this.config.MI_ON_LOCAL_SERVER()) {
				this.authToken = 'Bearer ' + this._helper.getMyLocalToken();
			} else {
				window.location.href = '../../';
			}
		}

		if (this.currentModule == 'currency') {
			this.serviceUrl = this.config.getConfig('host');
		} else {
			this.serviceUrl = this.config.getConfig('host_ror');
		}
	}

	public getCall<T>(url: any): Promise<T> {
		this._message.showLoader(true);
		const headers: Headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', this.authToken);
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
		let options = new RequestOptions({ headers: headers });
		return this.http.get(this.serviceUrl + url, options)
			.toPromise()
			.then(i => <T>i.json())
			.catch(this.handleError.bind(this));
	}

	public getExportCall(url: any, params) {
		this._message.showLoader(true);
		const headers: Headers = new Headers();
		headers.append('Accept', 'application/vnd.ms-excel');
		headers.append('Content-Type', 'application/vnd.ms-excel');
		headers.append('authorization', this.authToken);
		let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob, search: params });
		//let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob  });
		var blob;
		return this.http.get(this.serviceUrl + url, options).map(response => {
			var blob = new Blob([response['_body']], { type: 'application/vnd.ms-excel' });
			return blob;
		})
	}

	public getCallQuertParams<T>(url: any, params): Promise<T> {
		this._message.showLoader(true);
		const headers: Headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');

		headers.append('Authorization', this.authToken);

		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
		let options = new RequestOptions({ headers: headers, search: params });
		return this.http.get(this.serviceUrl + url, options)
			.toPromise()
			.then(i => <T>i.json())
			.catch(this.handleError.bind(this));
	}

	public postCall<T>(request: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);

		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
		return this.http.post(this.serviceUrl + request.url, JSON.stringify(request.model), options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}

	public postCallpatch(request: any): Promise<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		return this.http.post(this.serviceUrl + request.url, request.model, options)
			.map((res: Response) => {
				return (res.headers.get("Location"));
			})
			.toPromise()
			.then()
			.catch(this.handleError.bind(this));
	}



	public postCallpatchror(request: any): Promise<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		return this.http.post(this.serviceUrl + request.url, request.model, options)
			.map((res: Response) => {
				return res;
			})
			.toPromise()
			.then()
			.catch(this.handleError.bind(this));
	}

	public postCallRor(request: any): Promise<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		return this.http.post(request.url, request.model, options)
			.map((res: Response) => {
				return (res.headers.get("Location"));
			})
			.toPromise()
			.then()
			.catch(this.handleError.bind(this));
	}

	public patchCallForFileUpload<T>(request: any): Promise<T> {
		let headers = new Headers();
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		let options = new RequestOptions({ headers: headers });
		return this.http.patch(this.serviceUrl + request.url, request.model, options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}


	public putCall<T>(request: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		//headers.append('authorization', this.authToken);
		headers.append('Accept', 'application/json');
		headers.append('Authorization', this.authToken);
		let options = new RequestOptions({ headers: headers });
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
		return this.http.put(this.serviceUrl + request.url, request.model, options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}

	public patchCall<T>(request: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		return this.http.patch(request.url, request.model, options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}

	public patchCallRor<T>(request: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		return this.http.patch(this.serviceUrl + request.url, request.model, options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}

	public patchCallWithoutModel<T>(request: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		headers.append('Authorization', this.authToken);

		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-origin');
		return this.http.patch(request.url, options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}

	public deleteCall<T>(request: any): Promise<T> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', this.authToken);
		headers.append('Accept', 'application/json');
		let options = new RequestOptions({ headers: headers });
		return this.http.delete(this.serviceUrl + request.url, options)
			.toPromise()
			.then(i => <T>this.extractData(i))
			.catch(this.handleError.bind(this));
	}

	private extractData(res: any) {

		if (res._body === null || res._body == "") {
			return res;
		}
		let body = res.json();
		return body || {};
	}

	public handleError(error: Response | any) {



		// if (errorDetails != undefined) {
		// console.log("is an Error",error.status);
		// }

		// In a real world app, we might use a remote logging infrastructure	
		//this._message.addSingle("Record save failed", 'error');

		// this condition is for 
		// if user is ideal for more than 30 mins , popups comes , if user enters 
		// invalid credentails or any other error other than 200.
		// below condition will get executed
		if (this.isSessionTimeout) {
			localStorage.clear();
			this.cookieService.delete('cync_authorization');
			sessionStorage.removeItem('lastAction');
			window.location.href = '../../';
		}
		else if (error.status === 0) {
			this._oopsService.failedRequests++;
			this._oopsService.setOopsMessage(CyncConstants.NETWORK_ERROR_TITLE, CyncConstants.NETWORK_ERROR_MESSAGE, true, true);
		}
		else if (error.status === 401) {
			// window.location.href = '../../';
		} else if (error.status === 403) {
			this._message.addSingle('You are not authorized to perform this action.', 'error');
		} else {
			var errorDetails = error.json();
			if (errorDetails == undefined) {
				this._message.addSingle('Something went wrong.', 'error');
			} else if (errorDetails.error == undefined) {
				this._message.addSingle('Something went wrong.', 'error');
			} else if (errorDetails.error.message !== undefined) {
				this._message.addSingle(errorDetails.error.message, 'error');
			} else {
				this._message.addSingle(errorDetails.error, 'error');
			}
			//console.log(errorDetails.error.message);
			//this._message.addSingle(errorDetails.error.message, 'error');
			let errMsg: string;
			if (error instanceof Response) {
				const body = error.json() || '';
				const err = body.error || JSON.stringify(body);
				errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
			} else {
				errMsg = error.message ? error.message : error.toString();
			}
			//console.error(errMsg);
			return Promise.reject(errMsg);
		}
	}

	bindData(data: any) {
		/**
			* @see CYNCPS-1850 https://idexcel.atlassian.net/browse/CYNCPS-1850
			* Resetting the failed requests to 0 upon receiving a successful response from Server. 
			*/
		this._oopsService.resetFailedRequests();
		this._message.showLoader(false);
		return data;
	}

	navigateToHome(data: any) {
		if (data != undefined) {
			if (data.status == 204) {
				this._message.addSingle("Record saved successfully.", "success");
				this._location.back();
			}
		} else {
			this._location.back();
		}
	}

	setSessinTimeout(flag: boolean) {
		this.isSessionTimeout = flag;
	}

	/**
     * Note: This method is deprecated and will be removed in the next major version.
     * Alternate method will be -> app.component.ts -> ResponsiveHeight method.
     */
	setHeight() {
		var appbody_cont = window.innerHeight;
		$(window).resize(function () {
			appbody_cont = window.innerHeight;
			if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 225) + 'px'; }
			if (document.getElementById("main_contents")) {
				if (document.getElementById('app-body-container').classList.contains("has-submenu")) {
					document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 49) + 'px';
				}

				else {
					document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px';
				}

			}

			if (document.getElementById("dialog")) { document.getElementById('dialog').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
		})
		if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 225) + 'px'; }

		if (document.getElementById("main_contents")) {
			if (document.getElementById('app-body-container').classList.contains("has-submenu")) {
				document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 49) + 'px';
			}

			else {
				document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px';
			}

		}

		setTimeout(function () {
			if (document.getElementById("dialog")) { document.getElementById('dialog').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
		}, 50);

	}



}
