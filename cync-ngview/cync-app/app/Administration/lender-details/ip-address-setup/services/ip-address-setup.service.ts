import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Observable } from 'rxjs/Observable';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ListIPAddressSetup, IPAddressSetup, Dropdown, IPTypeList, IPAddressRecord, IPAddressRequestOrResponse } from '@app/Administration/lender-details/ip-address-setup/models/ip-address-setup.model';

@Injectable()
export class IpAddressSetupService {

	constructor(
		private _cyncHttpService: CyncHttpService,
		private _helper: Helper,
		private _commonApiHelper: CommonAPIs) { }

	/**
	 * Method to Get the UDF Definition Grid data
	 * @param url
	 */
	getIpAddressSetupGridData(url: string): Observable<ListIPAddressSetup> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeJsonObject(<ListIPAddressSetup>JSON.parse(data._body)));
		});
	}

	/**
	 * Method to modify the grid data for displaying purpose
	 * @param ipResponse
	 */
	serializeJsonObject(ipResponse: ListIPAddressSetup): any {
		const ipList: IPAddressSetup[] = ipResponse.ip_whitelists;
		for (let i = 0; i < ipList.length; i++) {
			if (ipList[i].active) {
				ipList[i].status = CyncConstants.ACTIVE;
			} else {
				ipList[i].status = CyncConstants.INACTIVE;
			}
		}
		ipResponse.ip_whitelists = ipList;
		return ipResponse;
	}

	/**
	* Method to get the Menu Permissions
	* @param menuName
	*/
	getMenuPermission(menuName: string): Observable<UserPermission[]> {
		const userRoleId = localStorage.getItem('cyncUserRoleId'); /* Logged In User*/
		return this._commonApiHelper.getUserPermission(menuName, userRoleId);
	}

	/**
	 * Method to get the Message for confirmation popoup,
	 * message should contain the selected record names
	 * @param selectedRecords
	 * @param recordNameKey
	 */
	getConfirmationPopupMessage(selectedRecords: any[], recordNameKey: string): string {
		if (selectedRecords.length === 1) {
			return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.IR_SINGLE_MSG);
		}
		return this.replaceRecordNames(selectedRecords, recordNameKey, CyncConstants.IR_MULTIPLE_MSG);
	}

	/**
	 * Method to replace the constant word in the message with selected record names
	 * @param selectedRecords
	 * @param recordNameKey
	 * @param msg
	 */
	replaceRecordNames(selectedRecords: any[], recordNameKey: string, msg: string) {
		return msg.replace(CyncConstants.SELECTED_RECORD_NAMES, this._helper.getRecordNamesOrRecordIds(selectedRecords, recordNameKey));
	}

	/**
	 * Method to delete the selected records
	 * @param url
	 */
	deleteIpAddressSetup(url: string): Observable<any> {
		return this._cyncHttpService.delete(url);
	}

	/**
	 * Method to export grid data
	 * @param queryParams
	 * @param url
	 */
	exportData(queryParams: string, url: string): Observable<Blob> {
		return this._cyncHttpService.getExportCall(url, queryParams);
	}

	/**
	 * Method to get the IP Type Drop Down List
	 * @param url
	 */
	getIpTypeList(url: string): Observable<Dropdown[]> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeIpTypeListObject(<IPTypeList>JSON.parse(data._body)));
		});
	}

	serializeIpTypeListObject(ipTypeList: IPTypeList): Dropdown[] {
		return ipTypeList.ip_types;
	}

	/**
	 * Method to get the IP Address Setup Record Details based on the Record Id
	 * @param url
	 */
	getRecord(url: string): Observable<IPAddressRecord> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeIpAddressJsonObject(<IPAddressRequestOrResponse>JSON.parse(data._body)));
		});
	}

	serializeIpAddressJsonObject(response:IPAddressRequestOrResponse){
		return response.ip_whitelist;
	}

	/**
	 * Method to Update a IP Address Setup record
	 * @param url
	 * @param requestModel
	 */
	updateRecord(url: string, requestModel: IPAddressRequestOrResponse): Observable<any> {
		return this._cyncHttpService.patch(url, requestModel);
	}

	/**
	 * Method to Create a IP Address Setup record
	 * @param url
	 * @param requestModel
	 */
	createRecord(url: string, requestModel: IPAddressRequestOrResponse): Observable<any> {
		return this._cyncHttpService.post(url, requestModel);
	}

}
