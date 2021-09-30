import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { ChargeCodes, Dropdown, AllChargeCodes, AddEditChargeCodes } from '../model/charge-codes.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';


@Injectable()
export class ChargeCodesService {
    constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper) { }

    /**
     * This method is for getting Charge Code By Id
     * @param url
     * @returns ChargeCodes
     */
    getChargeCodesById(url: string): Observable<ChargeCodes> {
        return this._cyncHttpService.get(url).map(data => (<ChargeCodes>JSON.parse(data._body)));
    }

    /***
     * This method is used to get all the chargecodes
     */
    getAllChargeCodes(url: string): Observable<AllChargeCodes> {
        return this._cyncHttpService.get(url).map(data => (this.customizeListChargeCodesData(<AllChargeCodes>JSON.parse(data._body))));
    }

    /**
     *
     * @param response
     */
    private customizeListChargeCodesData(response: AllChargeCodes): AllChargeCodes {
        response.charge_code.forEach(eachRecord => {
            if (eachRecord.add_to_borrower == null) {
                eachRecord.add_to_borrower = false;
            }
        })
        return response;
    }


    /**
     * This method updates existing Charge Codes
     * @param url
     */
    updateChargeCodes(url: string, model: AddEditChargeCodes): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }

    /**
     * This method saves the new Charge Codes
     * @param url
     * @param model
     */
    saveChargeCode(url: string, model: AddEditChargeCodes): Observable<any> {
        return this._cyncHttpService.post(url, model);
    }

    /**
     * Call APIs for dropdown values
     * @param url
     */
	getDropDownValues(url: string, key: string): Observable<Dropdown[]> {
		return this._cyncHttpService.get(url).map(data => {
			return <Dropdown[]>JSON.parse(data._body)[key];
		});
	}

    /**
     * Service Method to delete ChargeCodes
     * @param url
     */
    deleteChargeCodes(url: string): Observable<any> {
        return this._cyncHttpService.delete(url);
    }

    /**
     * Method to export the charge codes to an excel sheet
     * @param url
     * @param filter
     */
    exportChargeCodes(url: string, filter: string): Observable<Blob> {
        return this._cyncHttpService.getExportCall(url, filter);
    }
}