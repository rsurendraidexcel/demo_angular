import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class FinancialStatementsService {

	constructor(private _cyncHttpService: CyncHttpService,
		private _commonApiHelper: CommonAPIs) { }

	/**
	* Get Financial statements data
	* @param url
	*/
	getFinancialStatements(url: string): Observable<any> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => {
			return JSON.parse(data._body);
		});
	}

	/**
	* Save New Financial Statements data
	* @param url
	* @param model
	*/
	saveFinancialStatements(url: string, model: any): Observable<any> {
		return this._cyncHttpService.postService(CyncConstants.FINANCE_HOST, url, model);
	}

	/**
	* Update Existing Financial statements data
	* @param url
	* @param model
	*/
	updateFinancialStatements(url: string, model: any): Observable<any> {
		return this._cyncHttpService.putService(CyncConstants.FINANCE_HOST, url, model);
	}

	/**
	* Upload file for financial statements
	* @param url
	* @param model
	*/
	uploadFile(url: string, formData: FormData): Observable<any> {
		return this._cyncHttpService.uploadFileFinance(CyncConstants.FINANCE_HOST, url, formData);
	}

	/**
	* Download Excel Template for financial statements
	* @param url
	*/
	downloadExcelTemplate(url: string): Observable<any> {
		return this._cyncHttpService.downloadFinanceTemplate(CyncConstants.FINANCE_HOST, url);
	}

	/**
	* Get Financial statement summary data
	* @param url
	*/
	getFinancialStatementSummary(url: string): Observable<any> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => {
			return JSON.parse(data._body);
		});
	}

	/**
	* This method is use to get project details according to project ID
	* @param url
	* @returns ListProject
	*/
	getProjectDetails(url: string): Observable<any> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => {
			return JSON.parse(data._body);
		});
	}
}