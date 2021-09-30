import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

/**
 * This is client selection service , we will add the selected clientid to it
 */
@Injectable()
export class ClientSelectionService {
    private _clientId = new Subject<string>();

    public clientSelected = this._clientId.asObservable();

    /**
     * This method gets called when client Id is selected
     * @param clientId 
     */
    public add(clientId: string) {
        this._clientId.next(clientId);
    }
}