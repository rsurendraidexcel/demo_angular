import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { Helper } from "@cyncCommon/utils/helper";
import { SelectDropDown } from "@app/shared/models/select-dropdown.model";
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class TermCodesService {

    constructor(
        private _cyncHttpService: CyncHttpService, 
        private _helper: Helper
    ) { }

    /**
    * Method to get a list of term codes
    * @param url
    */
    getTermCodesList(url: string): Observable<any> {
        return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => <any>JSON.parse(data._body));
    }

    /**
    * Method to get term code data by project-ID
    * @param url
    */
    getTermCodeByID(url: string): Observable<any> {
        return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => <any>JSON.parse(data._body));
    }

    /**
    * Create new term code
    * @param url 
    * @param model 
    */
    saveTermCode(url: string, model: any): Observable<any> {
        return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
    }

    /**
    * Update existing term code data
    * @param url 
    * @param model 
    */
    updateTermCode(url: string, model: any): Observable<any> {
        return this._cyncHttpService.patchService(CyncConstants.FACTORING_HOST, url, model);
    }

    /**
    * Delete term codes
    * @param url
    * @param param
    */
    deleteTermCodes(url: string, param: any): Observable<any> {
        return this._cyncHttpService.deleteService(CyncConstants.FACTORING_HOST, url, param);
    }
}