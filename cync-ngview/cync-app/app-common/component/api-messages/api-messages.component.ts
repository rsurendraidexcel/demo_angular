import { Component } from "@angular/core"
import { APIMessagesService } from './api-messages.service';
import { APIMessage } from './api-messages.model';

/**
 *
*/
@Component({
    selector: 'api-messages',
    templateUrl: './api-messages.html',
    styleUrls: ['./api-messages.scss']

})

/**
 * @author Ranveer Singh
 * this component is for message which will get by API
 */
export class APIMessagesComponent {
    public _msgs: APIMessage[];

    /**
     *
     */
    constructor(private _notifications: APIMessagesService) {
        this._msgs = new Array<APIMessage>();
        _notifications.msgAdded.subscribe(msg => {
            if (this._msgs != undefined && this._msgs.find(m =>
                ((m.message === msg.message) && (m.type === msg.type))) === undefined) {
                this._msgs.push(msg);
                setTimeout(() => { this.hide.bind(this)(msg) }, 3000);
            }
        });
    }

    /**
     *
     */
    private hide(msg) {
        let index = this._msgs.indexOf(msg);
        if (index >= 0) {
            this._msgs.splice(index, 1);
        }
    }
}