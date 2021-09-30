import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { Helper } from "@cyncCommon/utils/helper";
import { SelectDropDown } from "@app/shared/models/select-dropdown.model";
import { CyncConstants } from '@cyncCommon/utils/constants';


@Injectable({
  providedIn: 'root'
})
export class LetterNamesService {

  constructor(
    private _cyncHttpService: CyncHttpService,
    private _helper: Helper
  ) { }

  /**
  * Method to get a list of Letter Name
  * @param url
  */
  getDetails(url: string): Observable<any> {
    return this._cyncHttpService.get(url).map(data => <any>JSON.parse(data._body));
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
  updateDetails(endpoint: string, model: any): Observable<any> {
    return this._cyncHttpService.patch(endpoint, model);
  }

  // /**
  // * Method to get Letter Name data by project-ID
  // * @param url
  // */
  // getLetterNameByID(url: string): Observable<any> {
  //   return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, url).map(data => <any>JSON.parse(data._body));
  // }

  // /**
  // * Method to get the data
  // * 
  // */
  // getLetterNameByID(url: string): Observable<any> {
  //   return this._cyncHttpService.get(url).map(data => <any>JSON.parse(data._body));
  // }

  // /**
  // * Create new Letter Name
  // * @param url 
  // * @param model 
  // */
  // saveLetterName(url: string, model: any): Observable<any> {
  //   return this._cyncHttpService.postService(CyncConstants.FACTORING_HOST, url, model);
  // }

  // /**
  // * Update existing Letter Name data
  // * @param url 
  // * @param model 
  // */
  // updateLetterName(url: string, model: any): Observable<any> {
  //   return this._cyncHttpService.patchService(CyncConstants.FACTORING_HOST, url, model);
  // }

  /**
  * Delete Letter Name
  * @param url
  * @param param
  */
  deleteLetterName(url: string): Observable<any> {
    return this._cyncHttpService.delete(url);
  }
}
