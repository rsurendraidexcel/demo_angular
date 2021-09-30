import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, DebugElement } from '@angular/core';

import { DataTableModule, DialogModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { MatDialog } from '@angular/material';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { ChargeCodesService } from '../service/charge-codes-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ListChargeCodesComponent } from './list-charge-codes.component';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { Overlay } from '@angular/cdk/overlay';
import { AppConfig } from '@app/app.config';
import { CookieService } from 'ngx-cookie-service';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';
import { Observable } from 'rxjs/Observable';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';


describe('ListChargeCodesComponent', () => {

  let component: ListChargeCodesComponent;
  let fixture: ComponentFixture<ListChargeCodesComponent>;
  let commonAPIs: CommonAPIs;
  let commonAPIsSpy;
  let chargeCodesService: ChargeCodesService;
  let debugElement: DebugElement;

  let menuPermissions = [
    {
      "action_id": 532,
      "action_label": "Summary",
      "action": "index",
      "enabled": true,
      "role_permission_id": 1944
    },
    {
      "action_id": 533,
      "action_label": "Create",
      "action": "create",
      "enabled": true,
      "role_permission_id": 1945
    },
    {
      "action_id": 534,
      "action_label": "Edit",
      "action": "update",
      "enabled": true,
      "role_permission_id": 1946
    },
    {
      "action_id": 535,
      "action_label": "Delete",
      "action": "destroy",
      "enabled": true,
      "role_permission_id": 1947
    },
    {
      "action_id": 867,
      "action_label": "View",
      "action": "show",
      "enabled": false,
      "role_permission_id": 1067
    }
  ];



  let allChargeCodes = {
    "recordTotal": 26,
    "currentPage": 1,
    "pagesTotal": 2,
    "charge_code": []
  };

  let chargeCodeToAppend = {
    "id": 1,
    "name": "CHARGECODE",
    "trans_code": "Trans",
    "natural_sign": "-",
    "sequence": 2,
    "frequency_desc": "Daily",
    "frequency": "DA",
    "charge_type": "Loan",
    "charge_value": "3.0",
    "posting_type": "Accrue To Loan",
    "description": "ChargeCode",
    "add_to_borrower": null
  }

  class MockRouter {
    url: string = '/otherGeneralCodes/charge-codes';
    navigateByUrl(url: string) { return url; }
  }
  let arrChargeCodes = []

  let id = 0;

  for (let i = 0; i <= 24; i++) {
    id = id + 1;
    let obj = JSON.parse(JSON.stringify(chargeCodeToAppend));
    obj.id = id;
    obj.name = obj.name + id;
    obj.description = obj.description + id;

    arrChargeCodes.push(obj);
  }
  allChargeCodes.charge_code = arrChargeCodes;
  // Initializing object to be pushed to grid data when page 2 is loaded
  let chargeCodesSecondPage = JSON.parse(JSON.stringify(allChargeCodes));
  let secondPageChargeCode = JSON.parse(JSON.stringify(chargeCodeToAppend));
  secondPageChargeCode.charge_code = JSON.parse(JSON.stringify(arrChargeCodes));
  secondPageChargeCode.charge_code.id = 26;
  secondPageChargeCode.charge_code.description = 'ChargeCode26';
  secondPageChargeCode.charge_code.name = 'CHARGECODE26';
  chargeCodesSecondPage.charge_code.push(secondPageChargeCode);
  chargeCodesSecondPage.currentPage = 2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        DataTableModule,
        DialogModule,
        CheckboxModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpModule
      ],
      declarations: [ListChargeCodesComponent],
      providers: [
        APIMapper, Helper, MatDialog, APIMessagesService, CommonAPIs, AppConfig, CyncHttpService, CookieService, HttpInterceptor, MessageServices, MessageService, ChargeCodesService,
        { provide: MatDialog, deps: [Overlay] },
        { provide: Router, useClass: MockRouter },
        { provide: CustomHttpService, deps: [Http] }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ListChargeCodesComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    chargeCodesService = TestBed.get(ChargeCodesService);
    commonAPIs = TestBed.get(CommonAPIs);
   
    spyOn(chargeCodesService, 'getAllChargeCodes').and.callFake((url) => {
      if (url.includes('page=1')) {
        return Observable.of(allChargeCodes);
      } else {
        return Observable.of(chargeCodesSecondPage);
      }
    })
    commonAPIsSpy = spyOn(commonAPIs, 'getUserPermission').and.returnValue(Observable.of(menuPermissions));

  });

  afterEach(() => {
    localStorage.setItem('cyncUserRoleId', '');
    localStorage.setItem('cyncUserRole', '');
  });

  it('should create list-charge-code-component with Non-Admin Role', () => {
    expect(component).toBeTruthy();
  });


  it('should create list-charge-code-component with Admin Role', () => {
    localStorage.setItem('cyncUserRoleId', CyncConstants.ADMIN_ROLE_ID);
    localStorage.setItem('cyncUserRole', CyncConstants.ADMIN_ROLE_TYPE);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should perform the global search operation with search term not blank', () => {
    fixture.detectChanges();
    spyOn(component, 'onKey').and.callThrough();
    component.searchTerm = 'sdf';
    debugElement
      .query(By.css('#globalSearch'))
      .triggerEventHandler('keyup', null);

    expect(component.globalSearchCloseIcon).toBeTruthy()
    expect(component.globalSearchIcon).toBeFalsy();
    expect(component.onKey).toHaveBeenCalled();

  });

  it('should perform the global search operation with search term blank', () => {
    fixture.detectChanges();
    spyOn(component, 'onKey').and.callThrough();
    debugElement
      .query(By.css('#globalSearch'))
      .triggerEventHandler('keyup', null);
    expect(component.globalSearchCloseIcon).toBeFalsy()
    expect(component.globalSearchIcon).toBeTruthy();
    expect(component.onKey).toHaveBeenCalled();
  });


  it('should load more data based on scroll operation', () => {

    let originalPageNumber = component.pageNumber;
    fixture.detectChanges();
    AppComponent.ResponsiveHeight();
    const onScrollSpy = spyOn(component, 'onScroll').and.callThrough();
    let main_content_obj = debugElement
      .query(By.css('#cync_main_contents')).nativeElement;
    let scrollTopValue = main_content_obj.scrollHeight - main_content_obj.clientHeight;
    main_content_obj.scrollTop = scrollTopValue;
    debugElement
      .query(By.css('#cync_main_contents'))
      .triggerEventHandler('scroll', { target: main_content_obj });
    expect(component.pageNumber).toEqual(originalPageNumber + 1);
    expect(component.onScroll).toHaveBeenCalled();
    fixture.detectChanges();

  });

  it('should not load more data on scroll as the scrollTop value is not as required', () => {
    let originalPageNumber = component.pageNumber;
    fixture.detectChanges();
    AppComponent.ResponsiveHeight();
    const onScrollSpy = spyOn(component, 'onScroll').and.callThrough();
    let main_content_obj = debugElement
      .query(By.css('#cync_main_contents')).nativeElement;
    debugElement
      .query(By.css('#cync_main_contents'))
      .triggerEventHandler('scroll', { target: main_content_obj });
    expect(component.pageNumber).toEqual(originalPageNumber);
    expect(component.onScroll).toHaveBeenCalled();
  });

  it('should load more data based on scroll operation and search variable', () => {

    let originalPageNumber = component.pageNumber;
    component.searchTerm = 'sdf';
    fixture.detectChanges();
    AppComponent.ResponsiveHeight();
    const onScrollSpy = spyOn(component, 'onScroll').and.callThrough();
    let main_content_obj = debugElement
      .query(By.css('#cync_main_contents')).nativeElement;
    let scrollTopValue = main_content_obj.scrollHeight - main_content_obj.clientHeight;
    main_content_obj.scrollTop = scrollTopValue;
    debugElement
      .query(By.css('#cync_main_contents'))
      .triggerEventHandler('scroll', { target: main_content_obj });
    expect(component.pageNumber).toEqual(originalPageNumber + 1);
    expect(component.onScroll).toHaveBeenCalled();

  });

  it('should navigate to add', inject([Router], (router: Router) => {
    fixture.detectChanges();
    const addSpy = spyOn(component, 'goToAdd').and.callThrough();
    const spy = spyOn(router, 'navigateByUrl');

    debugElement
      .query(By.css('#New'))
      .triggerEventHandler('click', null);

    const url = spy.calls.first().args[0];
    expect(url).toBe('/otherGeneralCodes/charge-codes/add');
    expect(router.navigateByUrl).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
  }));


  it('should not navigate to edit when row is not selected', inject([Router], (router: Router) => {
    fixture.detectChanges();
    const editSpy = spyOn(component, 'goToEdit').and.callThrough();
    const spy = spyOn(router, 'navigateByUrl');
    let editIconDebugElement = debugElement.query(By.css('#Edit'));

    editIconDebugElement.triggerEventHandler('click', null);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();

  }));

  it('should navigate to edit url when checkbox for one row is selected', inject([Router], (router: Router) => {
    fixture.detectChanges();
    const editSpy = spyOn(component, 'goToEdit').and.callThrough();
    const spy = spyOn(router, 'navigateByUrl');
    let rowToBeSelected = debugElement.queryAll(By.css('.ui-datatable-odd p-dtcheckbox .ui-chkbox-box'))[0];
    rowToBeSelected.triggerEventHandler('click', null);

    let editIconDebugElement = debugElement.query(By.css('#Edit'));

    editIconDebugElement.triggerEventHandler('click', null);

    const url = spy.calls.first().args[0];
    expect(url).toBe('/otherGeneralCodes/charge-codes/' + component.selectedRows[0].id);
    expect(router.navigateByUrl).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  }));

  it('should navigate to edit url when row is selected', inject([Router], (router: Router) => {
    fixture.detectChanges();
    const gotoViewSpy = spyOn(component, 'goToView').and.callThrough();
    const spy = spyOn(router, 'navigateByUrl');
    let rowToBeSelected = debugElement.queryAll(By.css('.ui-datatable-odd .ng-star-inserted'))[0].nativeElement;
    rowToBeSelected.click();
    const url = spy.calls.first().args[0];
    let selectedRow = gotoViewSpy.calls.first().args[0];
    
    expect(url).toBe('/otherGeneralCodes/charge-codes/' + selectedRow.data.id);
    expect(router.navigateByUrl).toHaveBeenCalled();
    expect(gotoViewSpy).toHaveBeenCalled();
  }));

  it('should unselect a row on click of select checkbox secondtime', () => {
    fixture.detectChanges();

    const gotoViewSpy = spyOn(component, 'goToView').and.callThrough();
    const unSelectChkBoxSpy = spyOn(component, 'unSelectChkBox').and.callThrough();


    let rowToBeSelected = debugElement.queryAll(By.css('.ui-datatable-odd p-dtcheckbox .ui-chkbox-box'))[0];
    rowToBeSelected.triggerEventHandler('click', null);
    expect(gotoViewSpy).toHaveBeenCalled();
    let selectRowLengthOnSelection = component.selectedRows.length;


    let rowToBeUnSelected = debugElement.queryAll(By.css('.ui-datatable-odd p-dtcheckbox .ui-chkbox-box'))[0];
    rowToBeUnSelected.triggerEventHandler('click', null);
    
    expect(component.selectedRows.length).toBe(selectRowLengthOnSelection-1);
    expect(unSelectChkBoxSpy).toHaveBeenCalled();

    
  });

  it('should select all the rows', () => {
    fixture.detectChanges();
    spyOn(component, 'selectAllChkBox').and.callThrough();
    debugElement.query(By.css('th .ui-chkbox .ui-chkbox-icon')).nativeElement.click();;
    
    expect(component.selectedRows.length).toBe(allChargeCodes.charge_code.length);
    expect(component.selectAllChkBox).toHaveBeenCalled();
  });

  it('should delete the selected rows when user selects Yes option in confirmation pop up', inject([Helper], (helper : Helper) => {
    fixture.detectChanges();
    spyOn(component, 'delete').and.callThrough();
    
    let rowToBeSelected = debugElement.queryAll(By.css('.ui-datatable-odd p-dtcheckbox .ui-chkbox-box'))[0];
    rowToBeSelected.triggerEventHandler('click', null);

    spyOn(component,'deleteSelectedRows').and.callThrough();
    spyOn(chargeCodesService, 'deleteChargeCodes').and.callFake((url) => {
      return Observable.of({status:204});
    })
    spyOn(helper , 'openConfirmPopup').and.returnValue(Observable.of(true));
    let deleteDebugElement = debugElement.query(By.css('#Delete'));

    deleteDebugElement.triggerEventHandler('click', null);
    expect(component.delete).toHaveBeenCalled();
    expect(component.deleteSelectedRows).toHaveBeenCalled();
  }));

  it('should not delete the selected rows when user selects Cancel option in confirmation pop up', inject([Helper], (helper : Helper) => {
    fixture.detectChanges();
    spyOn(component, 'delete').and.callThrough();
    
    let rowToBeSelected = debugElement.queryAll(By.css('.ui-datatable-odd p-dtcheckbox .ui-chkbox-box'))[0];
    rowToBeSelected.triggerEventHandler('click', null);

    spyOn(component,'deleteSelectedRows').and.callThrough();
    spyOn(chargeCodesService, 'deleteChargeCodes').and.callFake((url) => {
      return Observable.of({status:204});
    });
    spyOn(helper , 'openConfirmPopup').and.returnValue(Observable.of(false));
    let deleteDebugElement = debugElement.query(By.css('#Delete'));

    deleteDebugElement.triggerEventHandler('click', null);
    expect(component.delete).toHaveBeenCalled();
    expect(component.deleteSelectedRows).not.toHaveBeenCalled();
  }));

  it('should enable the pop up for exporting the grid data', () => {
    fixture.detectChanges();
    spyOn(component, 'showDialogForExport').and.callThrough();
    let exportDebugElement = debugElement.query(By.css('#Export'));

    exportDebugElement.triggerEventHandler('click', null);
    expect(component.showDialogForExport).toHaveBeenCalled();
    expect(component.toggleExportModal).toBeTruthy();
  });

  it('should export data for selected columns and rows to excel sheet', () => {
    fixture.detectChanges();
    spyOn(component, 'exportSelectedColumns').and.callThrough();
    spyOn(component, 'downloadFile').and.callThrough();

    //Code to trigger click of the export Icon
    let exportDebugElement = debugElement.query(By.css('#Export'));
    exportDebugElement.triggerEventHandler('click', null);
    //let csvFile = "a,b,c";
    let blob = new Blob([JSON.stringify(allChargeCodes.charge_code)], { type: 'text/csv;charset=utf-8;' });
    spyOn(chargeCodesService, 'exportChargeCodes').and.callFake((url) => {
      return Observable.of(blob);
    })

    let rowToBeSelected = debugElement.query(By.css('#exportDataConfirmButton'));
    rowToBeSelected.triggerEventHandler('click', component.exportColumns);
    
    expect(component.exportSelectedColumns).toHaveBeenCalled();
    expect(component.downloadFile).toHaveBeenCalled();
  });

  it('should not export data if no columns are selected for export operation', () => {
    fixture.detectChanges();
    spyOn(component, 'exportSelectedColumns').and.callThrough();
    spyOn(component, 'downloadFile').and.callThrough();

    //Code to trigger click of the export Icon
    let exportDebugElement = debugElement.query(By.css('#Export'));
    exportDebugElement.triggerEventHandler('click', null);
    
    component.exportColumns = [];
    let rowToBeSelected = debugElement.query(By.css('#exportDataConfirmButton')).triggerEventHandler('click',[]); 
    expect(component.exportSelectedColumns).toHaveBeenCalled();
    expect(component.downloadFile).not.toHaveBeenCalled();
  });

  it('should perform column search', () => {
    fixture.detectChanges();
    spyOn(component, 'printFilteredData').and.callThrough();  
    let columnFilterTextBox = debugElement.queryAll(By.css('.ui-datatable th .ui-column-filter'))[0];
    fixture.detectChanges();
    columnFilterTextBox.nativeElement.value = 'abc';
    fixture.detectChanges();
   // columnFilterTextBox.dispatchEvent(new Event('click'));
    //columnFilterTextBox.dispatchEvent(new Event('input'));
    columnFilterTextBox.triggerEventHandler('input',{target:{value : 'abc'}});
    
    
   //expect(component.printFilteredData).toHaveBeenCalled();
  });


	it('should clear the global search textbox', () => {
    fixture.detectChanges();
    component.searchTerm = 'abc';
    debugElement
      .query(By.css('#globalSearch'))
      .triggerEventHandler('keyup', null);
    expect(component.globalSearchCloseIcon).toBeTruthy();
    spyOn(component, 'clearSearchBox').and.callThrough();
    fixture.detectChanges();
    debugElement.query(By.css('.grid-search .icon-input-field')).triggerEventHandler('click',null); 
		expect(component.clearSearchBox).toHaveBeenCalled();
	});


});
