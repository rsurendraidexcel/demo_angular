import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Observable } from 'rxjs/Observable';
import { ABLAutoFileUploadsAPIResponse, ABLAutoFileUpload } from '../model/abl-file-uploads.model';

@Injectable()
export class ABLAutoFileUploadService {

    constructor(
        private _cyncHttpService: CyncHttpService,
        private _apiMapper: APIMapper) { }

    /**
     * This method will get the auto file upload details based on client selection, what he has selected already
     * @param borrowerId
     * @returns Observable<ABLAutoFileUploadsAPIResponse>
     */
    public getABLAutoFileUploads(borrowerId: string): Observable<ABLAutoFileUploadsAPIResponse> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_AUTO_FILE_UPLOAD];
        endPoint = endPoint.replace('{clientId}', borrowerId);
        return this._cyncHttpService.get(endPoint).map(data => (<ABLAutoFileUploadsAPIResponse>JSON.parse(data._body)));
    }

    /**
     * This method will delete row based on what user want to delete
     * @param borrower_id
     * @param id
     */
    public deleteClickedRow(borrower_id: number | string, id: number): Observable<any> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.DELETE_AUTO_FILE_UPLOAD];
        endPoint = endPoint.replace('{clientId}', borrower_id);
        endPoint = endPoint.replace('{id}', id);
        return this._cyncHttpService.delete(endPoint);
    }
}