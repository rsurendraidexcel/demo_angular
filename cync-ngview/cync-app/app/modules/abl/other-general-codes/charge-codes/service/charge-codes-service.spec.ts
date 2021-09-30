import { TestBed, inject, async } from '@angular/core/testing';
import { ChargeCodesService } from './charge-codes-service';
import { HttpModule } from '@angular/http';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChargeCodes, AllChargeCodes, AddEditChargeCodes,Dropdown } from '../model/charge-codes.model';
import { AppConfig } from '@app/app.config';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';

let chargeCodesService: ChargeCodesService;
let responsePropertyNames, expectedPropertyNames;
let cyncHttpService: CyncHttpService;

let chargeCodes: ChargeCodes = {
    "id": 2,
    "sequence": 3,
    "frequency": "MA",
    "add_to_borrower": true,
    "natural_sign": "+",
    "charge_type": "E",
    "description": "LEGAL FEE",
    "trans_code": null,
    "posting_type": "in balance",
    "charge_value": 0.0
};

let chargeCodes2: ChargeCodes = {
    "id": 3,
    "sequence": 3,
    "frequency": "MA",
    "add_to_borrower": null,
    "natural_sign": "+",
    "charge_type": "E",
    "description": "LEGAL FEE3",
    "trans_code": null,
    "posting_type": "in balance",
    "charge_value": 0.0
};

let mockChargeCodeByIdUrl = 'general_codes/charge_codes/2';

let allChargeCodes: AllChargeCodes = {
    recordTotal: 2,
    charge_code: [chargeCodes, chargeCodes2]
};

let spyMethodAndReturnDataForMock = (cyncHttpServiceSpy: jasmine.Spy, body: any) => {
    let data = {
        _body : JSON.stringify(body)
    }

    cyncHttpServiceSpy.and.returnValue(Observable.of(data));
};

describe('ChargeCodesService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ChargeCodesService,
                CyncHttpService,
                Helper,
                APIMapper,
                { provide: AppConfig, deps: [] },
                { provide: HttpInterceptor, deps: [] },
                { provide: MatDialog, deps: [Overlay] },
                { provide: APIMessagesService, deps: [] },
                { provide: CookieService, deps: [] }],
            imports: [HttpModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));


    beforeEach(() => {
        chargeCodesService = TestBed.get(ChargeCodesService);
        cyncHttpService = TestBed.get(CyncHttpService);




    });

    it('should get charge code details for the Id provided', () => {

        let cyncHttpServiceSpy = spyOn(cyncHttpService,'get');
        spyMethodAndReturnDataForMock(cyncHttpServiceSpy,chargeCodes);

        chargeCodesService.getChargeCodesById(mockChargeCodeByIdUrl).subscribe(chargeCodesResponse => {
            expect(JSON.stringify(chargeCodesResponse)).toBe(JSON.stringify(chargeCodes));
        });
        expect(cyncHttpServiceSpy.calls.count()).toBe(1);
    });

    it('should get list of all charge codes', () => {
        let mockGetAllChargeCodesUrl = 'general_codes/charge_codes?order_by=updated_at&sort_by=desc&page=1&rows=25&search=';

        let cyncHttpServiceSpy = spyOn(cyncHttpService,'get');

        spyMethodAndReturnDataForMock(cyncHttpServiceSpy,allChargeCodes);

        chargeCodesService.getAllChargeCodes(mockGetAllChargeCodesUrl).subscribe(chargeCodesResponse => {
           if(chargeCodesResponse!=null && chargeCodesResponse.charge_code!=undefined){
            chargeCodesResponse.charge_code.forEach(x => expect(typeof(x.add_to_borrower)).toBe('boolean'));
           }
        });

        expect(cyncHttpServiceSpy.calls.count()).toBe(1);
    });

    it('should update the chargeCode', () => {

        let cyncHttpServiceSpy = spyOn(cyncHttpService,'patch');

        spyMethodAndReturnDataForMock(cyncHttpServiceSpy,{});
        let addEditChargeCodes = new AddEditChargeCodes();
        addEditChargeCodes.charge_code = chargeCodes;
        chargeCodesService.updateChargeCodes(mockChargeCodeByIdUrl,addEditChargeCodes).subscribe(chargeCodesResponse => {
            expect(cyncHttpServiceSpy.calls.count()).toBe(1);
        });
    });

    it('should save the chargeCode', () => {

        let mockChargeCodeSaveUrl = 'general_codes/charge_codes';
        let cyncHttpServiceSpy = spyOn(cyncHttpService,'post');

        spyMethodAndReturnDataForMock(cyncHttpServiceSpy,{});
        let addEditChargeCodes = new AddEditChargeCodes();
        chargeCodes.id = null;
        addEditChargeCodes.charge_code = chargeCodes;
        chargeCodesService.saveChargeCode(mockChargeCodeSaveUrl,addEditChargeCodes).subscribe(chargeCodesResponse => {
            expect(cyncHttpServiceSpy.calls.count()).toBe(1);
        });
    });

    it('should delete the chargeCode', () => {

        let cyncHttpServiceSpy = spyOn(cyncHttpService,'delete');

        spyMethodAndReturnDataForMock(cyncHttpServiceSpy,{});

        chargeCodesService.deleteChargeCodes(mockChargeCodeByIdUrl).subscribe(chargeCodesResponse => {
            expect(cyncHttpServiceSpy.calls.count()).toBe(1);
        });
    });

    it('should export the chargeCodes list', () => {

        let cyncHttpServiceSpy = spyOn(cyncHttpService,'getExportCall');
        let blob = new Blob([JSON.stringify(allChargeCodes.charge_code)], { type: 'text/csv;charset=utf-8;' });
        cyncHttpServiceSpy.and.returnValue(Observable.of(blob));
        let filterString = 'cols[]=description&cols[]=trans_code&cols[]=natural_sign&cols[]=sequence&cols[]=frequency&cols[]=charge_type&cols[]=charge_value&cols[]=posting_type&cols[]=add_to_borrower';
        let mockChargeCodeExportUrl = 'general_codes/charge_codes';
        chargeCodesService.exportChargeCodes(mockChargeCodeExportUrl,filterString).subscribe(chargeCodesResponse => {
            expect(cyncHttpServiceSpy.calls.count()).toBe(1);
        });
    });

    it('should get dropdown values for cahreg codes page', () => {

        let cyncHttpServiceSpy = spyOn(cyncHttpService,'get');
        let mockDropDownValue = {
            natural_sign : [
                {
                    value : '+',
                    text : 'Plus'
                },
                {
                    value : '-',
                    text : 'Minus'
                }
            ]
        }

        spyMethodAndReturnDataForMock(cyncHttpServiceSpy,mockDropDownValue);
        let mockNatSignDropDownUrl = 'general_codes/charge_codes/get_natural_sign';
        chargeCodesService.getDropDownValues(mockNatSignDropDownUrl,'natural_sign').subscribe(chargeCodesResponse => {
            expect(cyncHttpServiceSpy.calls.count()).toBe(1);
        });
    });

});




