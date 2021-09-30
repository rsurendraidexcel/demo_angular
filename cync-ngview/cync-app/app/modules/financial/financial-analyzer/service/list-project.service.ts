import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { AllListProject, ListProject, AddEditListProject, Dropdown } from '../model/list-project.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class ListProjectService {
    constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper) { }

    /***
    * This method is used to get all the ListProject
    */
    getAllListProject(url: string): Observable<AllListProject> {
       return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<AllListProject>JSON.parse(data._body)));
    }


    /***
    * This method is used to get all the ListProject
    */
    getAllFolderListProject(url: string): Observable<AllListProject> {
        return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<AllListProject>JSON.parse(data._body)));
    }

    /**
    * This method is for getting List Project By Id
    * @param url
    * @returns ListProject
    */
    getListProjectById(url: string): Observable<ListProject> {
        return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<ListProject>JSON.parse(data._body)));
    }

    /**
     * This method updates existing List Project
     * @param url
     */
    updateListProject(url: string, model: AddEditListProject): Observable<any> {
        return this._cyncHttpService.putService(CyncConstants.FINANCE_HOST, url, model);
    }

    /**
     * This method updates existing List Project
     * @param url
     */
    updateListProjectFA(url: string, model: AddEditListProject): Observable<any> {
        return this._cyncHttpService.patchService(CyncConstants.FINANCE_HOST, url, model);
    }

    /**
     * This method saves the new List Project
     * @param url
     * @param model
     */
    saveListProject(url: string, model: any): Observable<any> {
        return this._cyncHttpService.postService(CyncConstants.FINANCE_HOST, url, model);
    }


    /**
     * Service Method to delete List Project
     * @param url
     */
    deleteListProject(url: string, param: any): Observable<any> {
        return this._cyncHttpService.deleteService(CyncConstants.FINANCE_HOST, url, param);
    }

    /**
     * Method to export the List Project to an excel sheet
     * @param url
     * @param filter
     */
    exportListProject(url: string, filter: string): Observable<Blob> {
        return this._cyncHttpService.getFinancialExportCall(CyncConstants.FINANCE_HOST, url, filter);
    }

    /**
     * Call APIs for dropdown values
     * @param url
     */
    getDropDownValues(url: string, key: string): Observable<Dropdown[]> {
        return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => {
            return <Dropdown[]>JSON.parse(data._body);
        });
    }

    /**
     *Method to get client details based on clientID 
     * @param url
     */
    public getBorrowerDetails(url: string): Observable<any> {
        return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
    }
}