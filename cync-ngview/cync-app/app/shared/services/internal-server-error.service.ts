import { Injectable } from "@angular/core"
import { Subject } from 'rxjs/Subject';

/**
 * This is to handle internal server error we get from any API
 */
@Injectable()
export class APIInternalServerErrorHandler {
    private errMsg = new Subject<string>();

    public serverErrorMsg = this.errMsg.asObservable();

    /**
     * This method gets called there is any error at server side and component has to do 
     * something on there pages
     * @param errorMsg 
     */
    public add(errorMsg: string) {
        this.errMsg.next(errorMsg);
    }
}