import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTableModule, DialogModule } from 'primeng/primeng';
import { CheckboxModule} from 'primeng/components/checkbox/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { Http, ConnectionBackend, HttpModule } from '@angular/http';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { MatDialog  } from '@angular/material';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, DebugElement } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { ExceptionService } from '../service/exceptions.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ListExceptionsComponent } from './list-exceptions.component';
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

describe('ListExceptionsComponent', () => {

  let component: ListExceptionsComponent;
  let fixture: ComponentFixture<ListExceptionsComponent>;
  let commonAPIs: CommonAPIs;
  let commonAPIsSpy: any ;
  let exceptionService : ExceptionService;
  let debugElement : DebugElement;

  let menuPermissions = [
  {
    "action_id": 569,
    "action_label": "Summary",
    "action": "index",
    "enabled": true,
    "role_permission_id": 1940
  },
  {
    "action_id": 570,
    "action_label": "Create",
    "action": "create",
    "enabled": true,
    "role_permission_id": 1941
  },
  {
    "action_id": 571,
    "action_label": "Edit",
    "action": "update",
    "enabled": true,
    "role_permission_id": 1942
  },
  {
    "action_id": 572,
    "action_label": "Delete",
    "action": "destroy",
    "enabled": true,
    "role_permission_id": 1943
  },
  {
    "action_id": 866,
    "action_label": "View",
    "action": "show",
    "enabled": false,
    "role_permission_id": 1067
  }
  ];

  let exceptionData = {
    "recordTotal": 57,
    "currentPage": 1,
    "pagesTotal": 3,
    "lender_exception": [
    {
      "id": 104,
      "display_label": "mytest4",
      "description": "mytest4",
      "operator": null,
      "value_type": null,
      "value_type_name": null,
      "exception_value": null,
      "system_defined": false,
      "add_to_all_clients": false
    },
    {
      "id": 101,
      "display_label": "mytest2",
      "description": "mytest2",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "5.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 100,
      "display_label": "mytest1",
      "description": "mytest1",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 99,
      "display_label": "testing9",
      "description": "testing9",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": false
    },
    {
      "id": 98,
      "display_label": "clients1",
      "description": "clients1",
      "operator": "<=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "4.5",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 97,
      "display_label": "testl1",
      "description": "testl1",
      "operator": "<=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "7.5",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 96,
      "display_label": "testin6",
      "description": "testin6",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "2.8",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 95,
      "display_label": "testin4",
      "description": "testin4",
      "operator": null,
      "value_type": null,
      "value_type_name": null,
      "exception_value": null,
      "system_defined": null,
      "add_to_all_clients": true
    },
    {
      "id": 94,
      "display_label": "testing7",
      "description": "testing7",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "1.8",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 93,
      "display_label": "testin5",
      "description": "testin5",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 92,
      "display_label": "testing4",
      "description": "testing4",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 91,
      "display_label": "testin1",
      "description": "testin1",
      "operator": null,
      "value_type": null,
      "value_type_name": null,
      "exception_value": null,
      "system_defined": null,
      "add_to_all_clients": true
    },
    {
      "id": 90,
      "display_label": "testing0",
      "description": "testing0",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "1.8",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 89,
      "display_label": "testin",
      "description": "testin",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 88,
      "display_label": "testing8",
      "description": "testing8",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 87,
      "display_label": "testin7",
      "description": "testin7",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 86,
      "display_label": "testing86",
      "description": "testing86",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 85,
      "display_label": "testin85",
      "description": "testin85",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 84,
      "display_label": "testing84",
      "description": "testing8",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 83,
      "display_label": "testin83",
      "description": "testin83",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 82,
      "display_label": "testing82",
      "description": "testing8",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 81,
      "display_label": "testin81",
      "description": "testin",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 80,
      "display_label": "testing80",
      "description": "testing8",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 79,
      "display_label": "testin",
      "description": "testin",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 78,
      "display_label": "testing8",
      "description": "testing8",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 77,
      "display_label": "testin",
      "description": "testin",
      "operator": "<=",
      "value_type": "P",
      "value_type_name": "Percentage",
      "exception_value": "1.2",
      "system_defined": true,
      "add_to_all_clients": true
    },
    {
      "id": 76,
      "display_label": "testing8",
      "description": "testing8",
      "operator": "=",
      "value_type": "A",
      "value_type_name": "Amount",
      "exception_value": "2.0",
      "system_defined": true,
      "add_to_all_clients": true
    }
    ]
  };

  class MockRouter {
    url: string = '/otherGeneralCodes/exceptions';
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports :[
      FormsModule,
      RouterTestingModule, 
      DataTableModule, 
      DialogModule ,
      CheckboxModule,
      HttpClientModule,
      BrowserAnimationsModule,
      HttpModule
      ],
      declarations: [ ListExceptionsComponent ],
      providers: [
      APIMapper, Helper, MatDialog, APIMessagesService, CommonAPIs, AppConfig, CyncHttpService, CookieService, HttpInterceptor, MessageServices,MessageService,ExceptionService,
      { provide: MatDialog, deps: [Overlay] },
      { provide: Router, useClass: MockRouter },
      { provide: CustomHttpService, deps: [Http] }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ListExceptionsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    exceptionService = TestBed.get(ExceptionService);
    commonAPIs = TestBed.get(CommonAPIs);
    spyOn(exceptionService, 'getExceptionList').and.returnValue(Observable.of(exceptionData));
    commonAPIsSpy = spyOn(commonAPIs, 'getUserPermission').and.returnValue(Observable.of(menuPermissions));
  });


  afterEach(() =>{
    localStorage.setItem('cyncUserRoleId','');
    localStorage.setItem('cyncUserRole','');
  });


  it('should create list-exceptions-component with Non-Admin Role', () => { 
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should create list-exception-component with Admin Role', () => { 
    localStorage.setItem('cyncUserRoleId',CyncConstants.ADMIN_ROLE_ID);
    localStorage.setItem('cyncUserRole',CyncConstants.ADMIN_ROLE_TYPE);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should perform the global search operation by using search parameter', () => {
    fixture.detectChanges();

    debugElement
    .query(By.css('#exception_global_search'))
    .triggerEventHandler('keyup',  {target : {value:'xyz'}});
    expect(component.globalSearchIcon).toBeFalsy();
    expect(component.globalSearchCloseIcon).toBeTruthy(); 
    //expect(component.onKey).toHaveBeenCalled();
  });


  it('should perform the global search operation without using search parameter', () => {
    fixture.detectChanges();    

    debugElement
    .query(By.css('#exception_global_search'))
    .triggerEventHandler('keyup', {target : {value:''}});
    expect(component.globalSearchIcon).toBeTruthy();
    expect(component.globalSearchCloseIcon).toBeFalsy(); 
    //expect(component.onKey).toHaveBeenCalled();
  });


  it('should append the search term with empty value', () => {
    fixture.detectChanges();
    component.searchTerm = '';

    let url = component.exceptionModel.apiDef.getApi;
    let finalUrlActual = component.appendSearchTerm(url,component.searchTerm);
    let finalUrlExpected = 'general_codes/lender_exceptions?order_by=code&sort_by=desc&page=1&rows=25&search='; 
    expect(finalUrlActual).toEqual(finalUrlExpected);
  });


  it('should append the search term with searched value', () => {

    fixture.detectChanges();
    component.searchTerm = 'xyz';

    let url = component.exceptionModel.apiDef.getApi;
    let finalUrlActual = component.appendSearchTerm(url,component.searchTerm);
    let finalUrlExpected = 'general_codes/lender_exceptions?order_by=code&sort_by=desc&page=1&rows=25&search=xyz'; 
    expect(finalUrlActual).toEqual(finalUrlExpected);
  });


  it('should replace the query parameters from get api before search', () => {
    fixture.detectChanges();
    component.searchTerm = '';
    let url = component.exceptionModel.apiDef.getApi;

    let finalUrlActual = component.getExcetionAPIUrl(url);
    let finalUrlExpected = 'general_codes/lender_exceptions?order_by=code&sort_by=desc&page=1&rows=25&search=';
    expect(finalUrlActual).toEqual(finalUrlExpected);
  });


  it('should replace the query parameters from get api after search', () => {
    fixture.detectChanges();
    component.searchTerm = 'xyz';
    let url = component.exceptionModel.apiDef.getApi;

    let finalUrlActual = component.getExcetionAPISearchUrl(url);
    let finalUrlExpected = 'general_codes/lender_exceptions?order_by=code&sort_by=desc&page=1&rows=25&search=';
    expect(finalUrlActual).toEqual(finalUrlExpected);
  });

  it('should navigate to add', inject([Router], (router: Router) => {
    fixture.detectChanges();
    const addSpy = spyOn(component, 'goToAdd').and.callThrough();
    const spy = spyOn(router, 'navigateByUrl');

    debugElement
    .query(By.css('#New'))
    .triggerEventHandler('click', null);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/otherGeneralCodes/exceptions/add');
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
    expect(url).toBe('/otherGeneralCodes/exceptions/' + component.selectedRows[0].id);
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
    
    expect(url).toBe('/otherGeneralCodes/exceptions/' + selectedRow.data.id);
    expect(router.navigateByUrl).toHaveBeenCalled();
    expect(gotoViewSpy).toHaveBeenCalled();
  }));

  it('should select all the rows', () => {
    fixture.detectChanges();
    spyOn(component, 'selectAllChkBox').and.callThrough();
    debugElement.query(By.css('th .ui-chkbox .ui-chkbox-icon')).nativeElement.click();;
    
    expect(component.selectedRows.length).toBe(exceptionData.lender_exception.length);
    expect(component.selectAllChkBox).toHaveBeenCalled();
  });


  it('should delete the selected rows when user selects Yes option in confirmation pop up', inject([Helper], (helper : Helper) => {
    fixture.detectChanges();
    spyOn(component, 'delete').and.callThrough();
    
    let rowToBeSelected = debugElement.queryAll(By.css('.ui-datatable-odd p-dtcheckbox .ui-chkbox-box'))[0];
    rowToBeSelected.triggerEventHandler('click', null);

    spyOn(component,'deleteSelectedRows').and.callThrough();
    spyOn(exceptionService, 'deleteException').and.callFake((url) => {
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
    spyOn(exceptionService, 'deleteException').and.callFake((url) => {
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

  it('should export data for selected columns and rows to excel sheet', inject ([Helper] , (helper : Helper) => {
    fixture.detectChanges();
    spyOn(component, 'exportSelectedColumns').and.callThrough();

    //Code to trigger click of the export Icon
    spyOn(helper, 'downloadFile').and.returnValue(Observable.of(true));
    let exportDebugElement = debugElement.query(By.css('#Export'));
    exportDebugElement.triggerEventHandler('click', null);
    //let csvFile = "a,b,c";
    let blob = new Blob([JSON.stringify(exceptionData.lender_exception)], { type: 'text/csv;charset=utf-8;' });
    spyOn(exceptionService, 'exportException').and.callFake((url) => {
      return Observable.of(blob);
    })


    let rowToBeSelected = debugElement.query(By.css('#exportDataConfirmButton'));
    rowToBeSelected.triggerEventHandler('click', component.exportColumns);
    
    expect(helper.downloadFile).toHaveBeenCalled();
    expect(component.exportSelectedColumns).toHaveBeenCalled();

  }));

  it('should not export data if no columns are selected for export operation',inject ([Helper] , (helper : Helper) => {
    fixture.detectChanges();
    spyOn(component, 'exportSelectedColumns').and.callThrough();
    spyOn(helper, 'downloadFile').and.returnValue(Observable.of(true));

    //Code to trigger click of the export Icon
    let exportDebugElement = debugElement.query(By.css('#Export'));
    exportDebugElement.triggerEventHandler('click', null);
    
    component.exportColumns = [];
    let rowToBeSelected = debugElement.query(By.css('#exportDataConfirmButton')).triggerEventHandler('click',[]); 
    expect(helper.downloadFile).not.toHaveBeenCalled();
    expect(component.exportSelectedColumns).toHaveBeenCalled();
    
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

  it('should perform column search', () => {
    fixture.detectChanges();
    spyOn(component, 'printFilteredData').and.callThrough();  
    let columnFilterTextBox = debugElement.queryAll(By.css('#exceptionFilter'))[0];
   
    columnFilterTextBox.nativeElement.value = 'abc';
   
   // columnFilterTextBox.dispatchEvent(new Event('click'));
    //columnFilterTextBox.dispatchEvent(new Event('input'));
   // let columnFilterTextBox = debugElement.query(By.css('#exceptionFilter'));

    columnFilterTextBox.triggerEventHandler('onFilter',{target:{value : 'abc'}});
    
    
    expect(component.printFilteredData).toHaveBeenCalled();
  });


  it('should clear the global search textbox', () => {
    fixture.detectChanges();
    component.searchTerm = 'abc';
    debugElement
    .query(By.css('#exception_global_search'))
    .triggerEventHandler('keyup', null);
    expect(component.globalSearchCloseIcon).toBeFalsy();
    spyOn(component, 'clearSearchBox').and.callThrough();
    fixture.detectChanges();
    debugElement.query(By.css('.grid-search .icon-input-field')).triggerEventHandler('click',null); 
    expect(component.clearSearchBox).toHaveBeenCalled();
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

  it('should not load more data on scroll as the scrollTop value is not as required', () => {
    fixture.detectChanges();
    AppComponent.ResponsiveHeight();
    fixture.detectChanges();
    let originalPageNumber = component.pageNumber;
   
    const onScrollSpy = spyOn(component, 'onScroll').and.callThrough();
    let main_content_obj = debugElement
    .query(By.css('#cync_main_contents')).nativeElement;

    debugElement
    .query(By.css('#cync_main_contents'))
    .triggerEventHandler('scroll', { target: main_content_obj });


    expect(component.pageNumber).toEqual(originalPageNumber);
    expect(component.onScroll).toHaveBeenCalled();
  });



});
