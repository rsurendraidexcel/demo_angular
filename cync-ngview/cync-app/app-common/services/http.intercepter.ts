import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';
import { CustomErrorService } from '@cyncCommon/component/custom-error/custom-error.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
// operators
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import { Helper } from '@cyncCommon/utils/helper';


@Injectable()
export class HttpInterceptor extends Http {
    ignore_404: any;
    constructor(
        backend: XHRBackend,
        options: RequestOptions,
        public http: Http,
        private _apiMsgService: APIMessagesService,
        private _message: MessageServices,
        private _oopsService: CustomErrorService,
        private _helper: Helper
    ) {
        super(backend, options)
    }

    /**
     * this method get called for every type of request
     */
    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).map((res: Response) => {
            if (res.status == 200) {
                this._oopsService.resetFailedRequests();
            }
            return res;
        }).catch(err => this.handleError(err,url))
    }

    /**
     * to handle error when any of api call fails
     */
    public handleError = (error: Response, url: any) => {
        this._message.showLoader(false);
        if (error.status === 401) {
           this._apiMsgService.add(new APIMessage('danger', `API Authoriztion Issue ${error.url}`));
        }
        else if (error.status === 0) {
            this._oopsService.failedRequests++;
            this._oopsService.setOopsMessage(CyncConstants.NETWORK_ERROR_TITLE, CyncConstants.NETWORK_ERROR_MESSAGE, true, true);
        }
        else if (error.status === 403) {
            this._apiMsgService.add(new APIMessage('error', 'You are not authorized to perform this action'));
        } else if (error.status === 500) {
            this._apiMsgService.add(new APIMessage('danger', 'System has encountered problem, please try again'));
        }else if (error.status === 404 && (url.constructor.name === "Request" && url.headers._headers.has("ignore_404")) ) {
         //do nothing 
        }
       
         else {
            let errorResponse = error.json();
            if (errorResponse.error != undefined && errorResponse.error.message != undefined && error.status !== 412) {
                //if (this._helper.isGlobalErrorMsgsEnabled()) {
                    this._apiMsgService.add(new APIMessage('danger', errorResponse.error.message));// danger is the type of css class            
                //}
            }
        }
        // Do messaging and error handling here
        return Observable.throw(error);
    }

}