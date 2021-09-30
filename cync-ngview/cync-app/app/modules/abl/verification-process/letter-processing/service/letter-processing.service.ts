import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LetterProcessingService {

    constructor(
        private _cyncHttpService: CyncHttpService,
        private _apiMapper: APIMapper) { }

    /**
     * This method will get the details based on client selection, what he has selected already
     * @param borrowerId
     */
    public getLetterProcessingRecords(borrowerId: string, letterType: string): Observable<any> {
        //let endPoint = this._apiMapper.endpoints[CyncConstants.LETTER_PROCESSING_LIST];
        //console.log("endPoint"+endPoint)
        let endPoint = 'borrowers/' + borrowerId + '/verification_letter_processes?letter_type=' + letterType;
        // endPoint = endPoint.replace('{clientId}', borrowerId);
        //endPoint = endPoint.replace('{letterType}', letterType);
        return this._cyncHttpService.get(endPoint).map(data => (<any>JSON.parse(data._body)));
    }


    /**
    * post or save the data
    * 
    */
    saveDetails(endpoint: string, model: any): Observable<any> {
        return this._cyncHttpService.post(endpoint, model);
    }

    /**
    * update or patch method
    * 
    */
    sendLetters(endpoint: string, model: any): Observable<any> {
        return this._cyncHttpService.putService("",endpoint, model);
    }

    /**
     * Method to export the Letters 
     * @param url
     * @param filter
     */
    exportLetters(url: string, model: any): Observable<Blob> {
        return this._cyncHttpService.postPdfExportCall( url, model);
    }

}