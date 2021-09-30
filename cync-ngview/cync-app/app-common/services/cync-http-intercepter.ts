import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CustomErrorService } from '@cyncCommon/component/custom-error/custom-error.service';
import { Helper } from '@cyncCommon/utils/helper';
import { AppConfig } from '@app/app.config';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';

@Injectable()
export class CyncHttpInterceptor implements HttpInterceptor {
  constructor(
    private apiMsgService: APIMessagesService,
    private message: MessageServices,
    private oopsService: CustomErrorService,
    private cookieService: CookieService,
    private helper: Helper,
    private config: AppConfig,
  ) {}
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newHeaders = httpRequest.headers;

    return next.handle(httpRequest)
    .pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('Interecepter response event trigger::');
        }
        return event;
    }),
    catchError((error: HttpErrorResponse) => {
            let errorMessage = error.error;
            /*
            if (error.error instanceof ErrorEvent) {
              errorMessage = `Errors:${error.error.message}`;
            } else {
              errorMessage = `Error Code : ${error.status} \n  Message: ${error.message}`;
            }*/
            this.message.showLoader(false);
            if (error.status === 401) {
               // window.location.href = '../../';
               this.apiMsgService.add(new APIMessage('danger', `API Athorization Issue: ${error.url}`));
            }else if (error.status === 0){
              this.oopsService.failedRequests++;
              this.oopsService.setOopsMessage(CyncConstants.NETWORK_ERROR_TITLE, CyncConstants.NETWORK_ERROR_MESSAGE, true, true);
            }else if (error.status === 403){
              this.apiMsgService.add(new APIMessage('error', 'You are not authorized to perform this action'));

            }else if (error.status === 404){
              this.apiMsgService.add(new APIMessage('danger', 'Resource Not Found Please, Please check API'));
            }else if (error.status === 500){
              this.apiMsgService.add(new APIMessage('danger', 'System has encountered problem, please try again'));
            }else{
                    if (error.error != undefined && error.error.message != undefined && error.status !== 412) {
                        this.apiMsgService.add(new APIMessage('danger', error.error.message));
                    }   
            }      
            return throwError(errorMessage);
      })
    )

  }

}