import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { ChargeCodesService } from '../service/charge-codes-service';


import { ManageChargeCodesComponent } from './manage-charge-codes.component';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { Observable } from 'rxjs/Observable';
import { CheckboxModule } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeCodes } from '@app/modules/abl/other-general-codes/charge-codes/model/charge-codes.model';
import { AppComponent } from '@app/app.component';
import { By } from '@angular/platform-browser';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Dropdown } from '../model/charge-codes.model';


describe('ManageChargeCodesComponent', () => {
  let component: ManageChargeCodesComponent;
  let fixture: ComponentFixture<ManageChargeCodesComponent>;
  let chargeCodesService: ChargeCodesService;
  let debugElement: DebugElement;

  class MockActivatedRoute {
    params: Observable<any> = Observable.of({});
  }

  class MockRouter {
    url: string = '/otherGeneralCodes/charge-codes';
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule
      ],
      declarations: [ManageChargeCodesComponent],
      providers: [
        FormBuilder,
        Validators,
        APIMapper,
        Helper,
        APIMessagesService,
        ChargeCodesService,
        MessageServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: MatDialog, deps: [Overlay] },
        { provide: Router, useClass: MockRouter },
        { provide: MessageService, deps: [] },
        { provide: CustomHttpService, deps: [Http] },
        { provide: CyncHttpService, deps: [] }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageChargeCodesComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    chargeCodesService = TestBed.get(ChargeCodesService);
    spyOn(chargeCodesService, 'getDropDownValues').and.callFake((url, param) => {
      switch (param) {
        case 'natural_sign': {
          return Observable.of([{'value':'+', 'text':'Plus'}, {'value':'-', 'text':'Minus'}])
        }
        case 'frequency': {
          return Observable.of([{'value':'AN', 'text':'Annually', 'show':true}, {'value':'SD', 'text':'System', 'show':false}])
        }
        case 'charge_type': {
          return Observable.of([{'value':'E', 'text':'Value', 'show':'true'}, {'value':'OAD', 'text':'OVER_ADVANCE', 'show':'false'}])
        }
        case 'posting_type': {
          return Observable.of([{'value':'in balance', 'text':'In Balance'}, {'value':'accrue to loan', 'text':'Accrue To Loan'}])
        }
      }
    });
    AppComponent.ResponsiveHeight();
  });

  it('should create manage-charge-codes component', () => {
    expect(component).toBeTruthy();
  });

  it('should show the edit page when route param id is present', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {

    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      let chargeCodes = {
        "id": 2,
        "sequence": 3,
        "frequency_desc": "Manual",
        "frequency": "MA",
        "add_to_borrower": true,
        "natural_sign": "+",
        "charge_type": "E",
        "description": "LEGAL FEE",
        "trans_code": null,
        "posting_type": "in balance",
        "charge_value": "0.0",
        "name": "LEGAL FEE"
      };

      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
  }));

  it('should show add page when route param is not present', () => {
    fixture.detectChanges();
  });

  it('should retain Save and Save & New buttons in disabled state until the form becomes valid', () => {
    fixture.detectChanges();
    spyOn(component, "saveChargeCode").and.callThrough();
    let saveButton = debugElement.query(By.css('#action_save'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();

    let saveAndNewButton = debugElement.query(By.css('#action_save_new'));
    expect(saveAndNewButton.nativeElement.disabled).toBeTruthy();

    saveButton.triggerEventHandler('click', null);

    expect(component.saveChargeCode).not.toHaveBeenCalled();
  });

  it('should save the charge code details and reset the form when form is valid and \'Save & New\' button is clicked', inject([Router], (router: Router) => {
    fixture.detectChanges();

    let chargeCodes = {
      "id": 2,
      "sequence": 3,
      "frequency_desc": "Manual",
      "frequency": "MA",
      "add_to_borrower": true,
      "natural_sign": "+",
      "charge_type": "E",
      "description": "LEGAL FEE",
      "trans_code": null,
      "posting_type": "in balance",
      "charge_value": "0.0",
      "name": "LEGAL FEE"
    };

    component.chargeCodesForm.patchValue(chargeCodes);

    fixture.detectChanges();
    spyOn(router,'navigateByUrl');
    spyOn(component, "saveChargeCode").and.callThrough();
    spyOn(component, "createChargeCode").and.callThrough();
    let saveButton = debugElement.query(By.css('#action_save'));
    expect(saveButton.nativeElement.disabled).toBeFalsy()
    let saveAndNewButton = debugElement.query(By.css('#action_save_new'));
    expect(saveAndNewButton.nativeElement.disabled).toBeFalsy();

    spyOn(chargeCodesService, 'saveChargeCode').and.callFake((url) => {
      return Observable.of({ status: 201 });
    });

    saveAndNewButton.triggerEventHandler('click', null);

    expect(component.saveChargeCode).toHaveBeenCalled();
    expect(component.createChargeCode).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  }));


  it('should save the charge code details and navigate to listing page when form is valid and \'Save\' button is clicked', inject([Router], (router: Router) => {
    fixture.detectChanges();

    let chargeCodes = {
      "id": 2,
      "sequence": 3,
      "frequency_desc": "Manual",
      "frequency": "MA",
      "add_to_borrower": true,
      "natural_sign": "+",
      "charge_type": "E",
      "description": "LEGAL FEE",
      "trans_code": null,
      "posting_type": "in balance",
      "charge_value": "0.0",
      "name": "LEGAL FEE"
    };

    component.chargeCodesForm.patchValue(chargeCodes);

    fixture.detectChanges();
    let urlSpy = spyOn(router,'navigateByUrl');
    spyOn(component, "saveChargeCode").and.callThrough();
    spyOn(component, "createChargeCode").and.callThrough();
    let saveButton = debugElement.query(By.css('#action_save'));
    expect(saveButton.nativeElement.disabled).toBeFalsy()
    let saveAndNewButton = debugElement.query(By.css('#action_save_new'));
    expect(saveAndNewButton.nativeElement.disabled).toBeFalsy();

    spyOn(chargeCodesService, 'saveChargeCode').and.callFake((url) => {
      return Observable.of({ status: 201 });
    });

    saveButton.nativeElement.click();
    const url = urlSpy.calls.first().args[0];
    expect(url).toBe(MenuPaths.CHARGE_CODES_PATH);
    expect(component.saveChargeCode).toHaveBeenCalled();
    expect(component.createChargeCode).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  }));

  it('should update the charge code details and navigate to listing page when form is valid and \'Save\' button is clicked', inject([Router, ActivatedRoute], (router: Router, activatedRoute : ActivatedRoute) => {
    let chargeCodes = {
      "id": 2,
      "sequence": 3,
      "frequency_desc": "Manual",
      "frequency": "MA",
      "add_to_borrower": true,
      "natural_sign": "+",
      "charge_type": "E",
      "description": "LEGAL FEE",
      "trans_code": null,
      "posting_type": "in balance",
      "charge_value": null,
      "name": "LEGAL FEE"
    };


    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
    chargeCodes.description = 'CHARGE CODES';
    debugElement.query(By.css('#charge_code_desc')).triggerEventHandler('input',{target:{value : 'CHARGE CODES'}});
    //columnFilterTextBox.triggerEventHandler('input',{target:{value : 'abc'}});
    component.chargeCodesForm.patchValue(chargeCodes);

    fixture.detectChanges();
    let urlSpy = spyOn(router,'navigateByUrl');
    spyOn(component, "saveChargeCode").and.callThrough();
    spyOn(component, "updateChargeCode").and.callThrough();
    let saveButton = debugElement.query(By.css('#action_save'));
    expect(saveButton.nativeElement.disabled).toBeFalsy();

    //Save and New Button should not come for Edit Page
    let saveAndNewButton = debugElement.query(By.css('#action_save_new'));
    expect(saveAndNewButton).toBeNull();

    spyOn(chargeCodesService, 'updateChargeCodes').and.callFake((url) => {
      return Observable.of({ status: 201 });
    });

    saveButton.nativeElement.click();
    const url = urlSpy.calls.first().args[0];
    expect(url).toBe(MenuPaths.CHARGE_CODES_PATH);
    expect(component.saveChargeCode).toHaveBeenCalled();
    expect(component.updateChargeCode).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  }));

  it('should not update the charge code details if form is invalid', inject([Router, ActivatedRoute], (router: Router, activatedRoute : ActivatedRoute) => {

    let originalValue = CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY;
    //If this property is set to true then do not disable the Save button based on criteria if form is valid/invalid
    CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY = false;

    let chargeCodes = {
      "id": 2,
      "sequence": 3,
      "frequency_desc": "Manual",
      "frequency": "MA",
      "add_to_borrower": true,
      "natural_sign": "+",
      "charge_type": "E",
      "description": "LEGAL FEE",
      "trans_code": null,
      "posting_type": "in balance",
      "charge_value": "0.0",
      "name": "LEGAL FEE"
    };


    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
    chargeCodes.description = '';
    debugElement.query(By.css('#charge_code_desc')).triggerEventHandler('input',{target:{value : ''}});

    component.chargeCodesForm.patchValue(chargeCodes);

    fixture.detectChanges();
    let urlSpy = spyOn(router,'navigateByUrl');
    spyOn(component, "saveChargeCode").and.callThrough();
    spyOn(component, "updateChargeCode").and.callThrough();


    let saveButton = debugElement.query(By.css('#action_save'));
    expect(saveButton.nativeElement.disabled).toBeFalsy();

    //Save and New Button should not come for Edit Page
    let saveAndNewButton = debugElement.query(By.css('#action_save_new'));
    expect(saveAndNewButton).toBeNull();

    // spyOn(chargeCodesService, 'updateChargeCodes').and.callFake((url) => {
    //   return Observable.of({ status: 201 });
    // });

    saveButton.nativeElement.click();
    //const url = urlSpy.calls.first().args[0];
    //expect(url).toBe(MenuPaths.CHARGE_CODES_PATH);
    expect(component.saveChargeCode).toHaveBeenCalled();
    expect(component.updateChargeCode).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY = originalValue;

  }));

  it('should disable the required fields for system defined frequency',
    inject([Router, ActivatedRoute], (router: Router, activatedRoute : ActivatedRoute) => {
    let chargeCodes = {
      'id': 2,
      'sequence': 3,
      'frequency_desc': 'System',
      'frequency': 'SD',
      'add_to_borrower': true,
      'natural_sign': '+',
      'charge_type': 'E',
      'description': 'LEGAL FEE',
      'trans_code': null,
      'posting_type': 'in balance',
      'charge_value': '0.0',
      'name': 'LEGAL FEE'
    };

    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(component,'disableChargeCodesParams').and.callThrough();
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
    expect(component.disableChargeCodesParams).toHaveBeenCalled();
    expect(debugElement.query(By.css('#charge_code_desc')).nativeElement.disabled).toBeFalsy();
    expect(debugElement.query(By.css('#posting_type')).nativeElement.disabled).toBeTruthy();
  }));

  it('should disable the required fields for AI charge type',
    inject([Router, ActivatedRoute], (router: Router, activatedRoute : ActivatedRoute) => {
    let chargeCodes = {
      'id': 2,
      'sequence': 3,
      'frequency_desc': 'System',
      'frequency': 'SD',
      'add_to_borrower': true,
      'natural_sign': '+',
      'charge_type': 'AI',
      'description': 'LEGAL FEE',
      'trans_code': null,
      'posting_type': 'in balance',
      'charge_value': '0.0',
      'name': 'LEGAL FEE'
    };

    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(component,'disableChargeCodesParams').and.callThrough();
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
    expect(component.disableChargeCodesParams).toHaveBeenCalled();
    expect(debugElement.query(By.css('#charge_code_desc')).nativeElement.disabled).toBeFalsy();
    expect(debugElement.query(By.css('#posting_type')).nativeElement.disabled).toBeTruthy();
  }));

  it('should disable the required fields for Over Advance charge type and system frequency',
    inject([Router, ActivatedRoute], (router: Router, activatedRoute : ActivatedRoute) => {
    let chargeCodes = {
      'id': 2,
      'sequence': 3,
      'frequency_desc': 'System',
      'frequency': 'SD',
      'add_to_borrower': true,
      'natural_sign': '+',
      'charge_type': 'OAD',
      'description': 'LEGAL FEE',
      'trans_code': null,
      'posting_type': 'in balance',
      'charge_value': '0.0',
      'name': 'LEGAL FEE'
    };

    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(component,'disableChargeCodesParams').and.callThrough();
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
    expect(component.disableChargeCodesParams).toHaveBeenCalled();
    expect(debugElement.query(By.css('#charge_code_desc')).nativeElement.disabled).toBeFalsy();
    expect(debugElement.query(By.css('#posting_type')).nativeElement.disabled).toBeFalsy();
  }));

  it('should disable the required fields for New Sales charge type',
    inject([Router, ActivatedRoute], (router: Router, activatedRoute : ActivatedRoute) => {
    let chargeCodes = {
      'id': 2,
      'sequence': 3,
      'frequency_desc': 'Manual',
      'frequency': 'MA',
      'add_to_borrower': true,
      'natural_sign': '+',
      'charge_type': 'NS',
      'description': 'LEGAL FEE',
      'trans_code': null,
      'posting_type': 'in balance',
      'charge_value': null,
      'name': 'LEGAL FEE'
    };

    activatedRoute.params = Observable.of({ id: 2 });
    spyOn(component,'disableChargeCodesParams').and.callThrough();
    spyOn(chargeCodesService, 'getChargeCodesById').and.callFake((url) => {
      return Observable.of(chargeCodes);
    });
    fixture.detectChanges();
    expect(component.disableChargeCodesParams).toHaveBeenCalled();
    expect(debugElement.query(By.css('#charge_code_desc')).nativeElement.disabled).toBeFalsy();
    expect(debugElement.query(By.css('#posting_type')).nativeElement.disabled).toBeTruthy();
  }));

});
