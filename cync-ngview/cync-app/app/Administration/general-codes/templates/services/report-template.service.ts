import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';

@Injectable()
export class ReportTemplateService {

    constructor(private _cyncHttpService: CyncHttpService
    ) { }

	/**
	* Get lender details
	* @param url
	*/
    getLenderDetails(url: string): Observable<any> {
        return this._cyncHttpService.get(url).map(data => {
            return JSON.parse(data._body);
        });
    }

    /**
	* Update lender details
	* @param url
	* @param model
	*/
    updateLenderDetails(url: string, model: any): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }
}