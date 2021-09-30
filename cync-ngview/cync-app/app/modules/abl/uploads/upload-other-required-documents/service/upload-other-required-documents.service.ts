import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Observable } from 'rxjs/Observable';
import { ABLOtherRequiredDocAPIResponse, UIBinding } from '../model/upload-other-required-documents.model';
import { HttpEvent } from '@angular/common/http';

@Injectable()
export class ABLOtherFileUploadService {

    constructor(
        private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper) { }

    /**
     * This method will get the other file upload details based on client selection, what he has selected already
     * @param borrowerId
     * @returns Observable<ABLOtherRequiredDocAPIResponse>
     */
    public getOtherFileUploadDetails(borrowerId: string): Observable<ABLOtherRequiredDocAPIResponse> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_OTHER_FILE_UPLOADS];
        endPoint = endPoint.replace('{clientId}', borrowerId);
        return this._cyncHttpService.get(endPoint).map(data => this.customizeUploadFiles(JSON.parse(data._body)));
    }

    /**
     * This method will get used to customize apiResponse based on requirement
     * @param apiResponse
     */
    private customizeUploadFiles(apiResponse: any): ABLOtherRequiredDocAPIResponse {
        apiResponse['reporting_documents'].forEach(eachMapping => {
            eachMapping['uiBindings'] = new UIBinding();
        });
        return <ABLOtherRequiredDocAPIResponse>apiResponse;
    }

    /**
     * this method is to upload file
     * @param formData
     */
    public uploadFile(formData: FormData): Observable<HttpEvent<{}>> {
        const endPoint = this._apiMapper.endpoints[CyncConstants.UPLOAD_OTHER_REQUIRED_FILES];
        return this._cyncHttpService.uploadFile(endPoint, formData);
    }
}