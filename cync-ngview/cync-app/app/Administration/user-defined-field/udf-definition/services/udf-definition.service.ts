import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Observable } from 'rxjs/Observable';
import {
ListUDFDefinitionResponse,
UDFDefinition, FieldTypeList,
Dropdown,
ValidationTypeList,
UDFRequestOrReponse,
UDFDefinitionRecord } from '@app/Administration/user-defined-field/udf-definition/models/udf-definition.model';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class UdfDefinitionService {

	constructor(
		private _cyncHttpService: CyncHttpService,
		private _helper: Helper,
		private _commonApiHelper: CommonAPIs) { }

	/**
	 * Method to Get the UDF Definition Grid data
	 * @param url
	 */
	getUDFGridData(url: string): Observable<ListUDFDefinitionResponse> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeJsonObject(<ListUDFDefinitionResponse>JSON.parse(data._body)));
		});
	}

	/**
	 * Method to modify the grid data for displaying purpose
	 * @param udfResponse
	 */
	serializeJsonObject(udfResponse: ListUDFDefinitionResponse): ListUDFDefinitionResponse {
		const udfList: UDFDefinition[] = udfResponse.udfs;
		for (let i = 0; i < udfList.length; i++) {
			if (udfList[i].active) {
				udfList[i].status = CyncConstants.ACTIVE;
			} else {
				udfList[i].status = CyncConstants.INACTIVE;
			}
		}
		udfResponse.udfs = udfList;
		return udfResponse;
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
	deleteUDF(url: string): Observable<any> {
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
	 * Method to get the Field Type Dropdown values
	 * @param url
	 */
	getFieldTypeList(url: string): Observable<Dropdown[]> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeFieldTypeListObject(<FieldTypeList>JSON.parse(data._body)));
		});
	}

	/**
	 * Method to modify the Field Type response
	 * @param fieldTypeListResponse
	 */
	serializeFieldTypeListObject(fieldTypeListResponse: FieldTypeList): Dropdown[] {
		return fieldTypeListResponse.field_types;
	}

	/**
	 * Method to get the Validation Type Dropdown values
	 * @param url
	 */
	getValidationTypeList(url: string): Observable<Dropdown[]> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeValidationTypeListObject(<ValidationTypeList>JSON.parse(data._body)));
		});
	}

	/**
	 * Method to modify the Validation Type response
	 * @param validationTypeListResponse
	 */
	serializeValidationTypeListObject(validationTypeListResponse: ValidationTypeList): Dropdown[] {
		return validationTypeListResponse.validation_type;
	}

	/**
	 * Method to Create a UDF Definition record
	 * @param url
	 * @param requestModel
	 */
	createRecord(url: string, requestModel: UDFRequestOrReponse): Observable<any> {
		return this._cyncHttpService.post(url, requestModel);
	}

	/**
	 * Method to get a UDF Definition record
	 * @param url
	 */
	getRecord(url: string): Observable<UDFDefinitionRecord> {
		return this._cyncHttpService.get(url).map(data => {
			return (this.serializeUdfJsonObject(<UDFRequestOrReponse>JSON.parse(data._body)));
		});
	}

	/**
	 * Method to modify the UDF Definition record response
	 * @param response
	 */
	serializeUdfJsonObject(response: UDFRequestOrReponse): UDFDefinitionRecord {
		return response.udf;
	}

	/**
	 * Method to Update a UDF Definition record
	 * @param url
	 * @param requestModel
	 */
	updateRecord(url: string, requestModel: UDFRequestOrReponse): Observable<any> {
		return this._cyncHttpService.patch(url, requestModel);
	}

}
