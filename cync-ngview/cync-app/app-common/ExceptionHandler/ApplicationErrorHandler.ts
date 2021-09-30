import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIInternalServerErrorHandler } from '@app/shared/services//internal-server-error.service';


@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {


  constructor(private injector: Injector,
    private message: MessageServices, private _apiBackedError: APIInternalServerErrorHandler) {
    super();
  }

  handleError(error: any): void {
    // this.message.addSingle("Error Occured in application", 'error');
    this.message.showLoader(false);
    console.log(error);
    if (error._body) {
      let errResposne = JSON.parse(error._body);
      this._apiBackedError.add(errResposne['error'].message);
    }
  }
}