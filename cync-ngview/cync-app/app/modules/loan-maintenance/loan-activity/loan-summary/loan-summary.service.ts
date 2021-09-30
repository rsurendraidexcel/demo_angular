import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";

@Injectable()
export class LoanSummaryService {

    constructor(
        private _cyncHttpService: CyncHttpService,
    ) { }

    /**
    * Method to get a list of Loan Summary Data
    * @param url
    */
    getLoanSummaryDataList(url: string): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
    }
    /**
    * Get Loan Document Image Url
    * @param url 
    */
    getLoanDocumentImageUrl(url: string): any {
        return this._cyncHttpService.getService('MCL', url).map(data => JSON.parse(data._body));
    }

    /**
    * Get grid config
    * @param url 
    */
    public getGridConfig(url): Observable<any> {
        return this._cyncHttpService.getService('MCL', url).map(data => JSON.parse(data._body));
    }

    /**
    * Save grid config
    * @param url 
    * @param body 
    */
    public saveGridConfig(url, body) {
        let formData: FormData = new FormData();
        formData.append('grid_config', JSON.stringify(body));
        return this._cyncHttpService.putWithOption('MCL', url, formData);
    }
}
