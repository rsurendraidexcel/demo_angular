import { Injectable } from "@angular/core"
import { Subject } from 'rxjs/Subject';
import { APIMessage } from './api-messages.model';

/**
 * This is api message service , we will add api messages into it
 */
@Injectable()
export class APIMessagesService {
    private _messages = new Subject<APIMessage>();

    public msgAdded = this._messages.asObservable();

    /**
     * 
     * @param msg 
     */
    public add(msg: APIMessage) {
        this._messages.next(msg);
    }
}