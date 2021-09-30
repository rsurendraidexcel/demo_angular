import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '@cyncCommon/utils/helper';
import { FileUpload } from 'primeng/primeng';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { FinancialStatementsLandingComponent } from './financial-statements-landing.component';
import { By } from '@angular/platform-browser';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import 'rxjs/add/observable/of';
import { FileUploadModule } from 'primeng/primeng';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

describe('FinancialStatementsLandingComponent', () => {
	let component: FinancialStatementsLandingComponent;
	let fixture: ComponentFixture<FinancialStatementsLandingComponent>;
	let financialStatementsService: FinancialStatementsService;
	let commonService: CommonAPIs;
	let helperService: Helper;
	let debugElement: DebugElement;
	const projectDetails: any = {
		'id': '8d5367cf-a41a-4d5a-8e5e-d6e80812f295',
		'projectName': 'Test Project for test case',
		'description': 'Test Project for test case',
		'clientName': '0000001 CLIENTASSIGNMENTCOPY Q',
		'clientId': 4164,
		'industry': '18018, Description8',
		'balanceSheetYear': 2018,
		'financialPeriod': 'YEARLY',
		'financialTimeline': 2,
		'folder': null
	};
	const financeProjectStatus: any = {
		'financeStatementComplete': false,
		'financeRatioComplete': false
	};

	class MockActivatedRoute {
		params: Observable<any> = Observable.of({});
	}

	class MockRouter {
		url = '/financial/financial-statements';
		navigateByUrl(url: string) { return url; }
	}

	const downloadExcelData: any = {
		'size': 58292,
		'type': 'application/vnd.ms-excel'
	};

	const fileObject = {
		name: 'Financial Statement.xlsx',
		lastModified: 1530694805692,
		lastModifiedDate: 'Wed Jul 04 2018 14:30:05 GMT+0530 (IST)',
		webkitRelativePath: '',
		size: 12049,
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	};
	const uploadFileResponse: any = {
		'status': 200
	};

	const uploadFileElseResponse: any = {
		'status': 201
	};

	const fileArrays = {
		files: [{
			name: 'Financial Statement.xlsx',
			lastModified: 1530694805692,
			lastModifiedDate: 'Wed Jul 04 2018 14:30:05 GMT+0530 (IST)',
			webkitRelativePath: '',
			size: 12049,
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		}]
	};
	const emptyFileArrays = {
		files: []
	};

	const fileArraysWrongFileData = {
		files: [{
			name: 'Financial Statement.jpg',
			lastModified: 1530694805692,
			lastModifiedDate: 'Wed Jul 04 2018 14:30:05 GMT+0530 (IST)',
			webkitRelativePath: '',
			size: 12049,
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		}]
	};

	const uploadFileArrays = {
		target: {
			files: [{
				name: 'Financial Statement.xlsx',
				lastModified: 1530694805692,
				lastModifiedDate: 'Wed Jul 04 2018 14:30:05 GMT+0530 (IST)',
				webkitRelativePath: '',
				size: 12049,
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			}]
		}
	};

	const uploadEmptyFileArrays = {
		target: {
			files: []
		}
	};

	const uploadWrongFilesArrays = {
		target: {
			files: [{
				name: 'Financial_Statement.xlsx',
				lastModified: 1530694805692,
				lastModifiedDate: 'Wed Jul 04 2018 14:30:05 GMT+0530 (IST)',
				webkitRelativePath: '',
				size: 12049,
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			}]
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule,
				FileUploadModule
			],
			declarations: [FinancialStatementsLandingComponent],
			providers: [
				APIMapper,
				Helper,
				MessageServices,
				APIMessagesService,
				FinancialStatementsService,
				ClientSelectionService,
				RadioButtonService,
				CommonAPIs,
				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
				{ provide: Router, useClass: MockRouter },
				{ provide: MessageService, deps: [] },
				{ provide: MatDialog, deps: [Overlay] },
				{ provide: CyncHttpService, deps: [] }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinancialStatementsLandingComponent);
		debugElement = fixture.debugElement;
		component = fixture.componentInstance;
		financialStatementsService = TestBed.get(FinancialStatementsService);
		commonService = TestBed.get(CommonAPIs);
		helperService = TestBed.get(Helper);
	});

	it('should create financial statement landing component', () => {
		expect(component).toBeTruthy();
	});

	it('should execute ngonit function', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.params = Observable.of({ id: 2 });
		const getPeojectDetailsSpy = spyOn(financialStatementsService, 'getProjectDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectDetailsSpy, projectDetails);
		const getPeojectStatusSpy = spyOn(commonService, 'getServiceProjectStatus');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectStatusSpy, financeProjectStatus);
		fixture.detectChanges();
		expect(getPeojectDetailsSpy).toHaveBeenCalled();
		expect(getPeojectStatusSpy).toHaveBeenCalled();
		expect(component.enableFinanceStatementComplete).toBeFalsy();
		expect(component.enableFinanceRatioComplete).toBeFalsy();
	}));

	it('Should navigate to setup page by click on Enter your data button', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		spyOn(component, 'navigateToSetup').and.callThrough();
		component.navigateToSetup();
		expect(component.navigateToSetup).toHaveBeenCalled();
	})
	);

	it('should trigger fileRemovedDragDrop method', () => {
		spyOn(component, 'fileRemovedDragDrop').and.callThrough();
		component.fileRemovedDragDrop();
		expect(component.fileRemovedDragDrop).toHaveBeenCalled();
	});

	it('Should call navigateToFAList method', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		spyOn(component, 'navigateToFAList').and.callThrough();
		component.navigateToFAList();
		expect(component.navigateToFAList).toHaveBeenCalled();
	}));

	it('Should call register Reload Grid On Client Selection', inject([ClientSelectionService],
		(clientSelectionService: ClientSelectionService) => {
		clientSelectionService.clientSelected = Observable.of('Client');
		spyOn(component, 'registerReloadGridOnClientSelection').and.callThrough();
		component.registerReloadGridOnClientSelection();
		expect(component.registerReloadGridOnClientSelection).toHaveBeenCalled();
	}));

	it('Should call saveButtonValidation method', () => {
		component.isFileDragDropped = true;
		spyOn(component, 'saveButtonValidation').and.callThrough();
		component.saveButtonValidation();
		expect(component.saveButtonValidation).toHaveBeenCalled();
	});

	it('Should call backToSummary method', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'backToSummary').and.callThrough();
		component.backToSummary();
		expect(component.backToSummary).toHaveBeenCalled();
	}));

	it('should call downloadExcelTemplate method', () => {
		const downloadExcelTemplateSpy = spyOn(financialStatementsService, 'downloadExcelTemplate');
		ServiceSpy.spyCompServiceAndReturnDataForMock(downloadExcelTemplateSpy, downloadExcelData);
		window.URL.createObjectURL = function () { return downloadExcelData; };
		spyOn(component, 'downloadExcelTemplate').and.callThrough();
		component.downloadExcelTemplate();
		expect(component.downloadExcelTemplate).toHaveBeenCalled();
		expect(downloadExcelTemplateSpy).toHaveBeenCalled();
	});

	it('should call downloadExcelTemplate navigation scenario', () => {
		const downloadExcelTemplateSpy = spyOn(financialStatementsService, 'downloadExcelTemplate');
		ServiceSpy.spyCompServiceAndReturnDataForMock(downloadExcelTemplateSpy, downloadExcelData);
		window.navigator.msSaveOrOpenBlob = function () { return downloadExcelData; };
		spyOn(component, 'downloadExcelTemplate').and.callThrough();
		component.downloadExcelTemplate();
		expect(component.downloadExcelTemplate).toHaveBeenCalled();
		expect(downloadExcelTemplateSpy).toHaveBeenCalled();
	});

	it('Should call finalFileUplaod method', inject([Router], (router: Router) => {
		const uploadFileSpy = spyOn(financialStatementsService, 'uploadFile');
		ServiceSpy.spyCompServiceAndReturnDataForMock(uploadFileSpy, uploadFileResponse);
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'finalFileUplaod').and.callThrough();
		component.finalFileUplaod(fileObject);
		expect(component.finalFileUplaod).toHaveBeenCalled();
		expect(uploadFileSpy).toHaveBeenCalled();
	}));

	it('Should call finalFileUplaod different scenario', inject([Router], (router: Router) => {
		const uploadFileSpy = spyOn(financialStatementsService, 'uploadFile');
		ServiceSpy.spyCompServiceAndReturnDataForMock(uploadFileSpy, uploadFileElseResponse);
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'finalFileUplaod').and.callThrough();
		component.finalFileUplaod(fileObject);
		expect(component.finalFileUplaod).toHaveBeenCalled();
		expect(uploadFileSpy).toHaveBeenCalled();
	}));

	it('Should call fileSelectDragDrop method using correct file', () => {
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'fileSelectDragDrop').and.callThrough();
		component.fileSelectDragDrop(fileArrays);
		expect(component.fileSelectDragDrop).toHaveBeenCalled();
	});

	it('Should call fileSelectDragDrop method using wrong file', () => {
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		const openAlertPoupSpy = spyOn(helperService, 'openAlertPoup');
		ServiceSpy.spyCompServiceAndReturnDataForMock(openAlertPoupSpy, '');
		spyOn(component, 'fileSelectDragDrop').and.callThrough();
		component.fileSelectDragDrop(fileArraysWrongFileData);
		expect(component.fileSelectDragDrop).toHaveBeenCalled();
	});

	it('Should call uploadFileUsingButton method', () => {
		spyOn(component, 'uploadFileUsingButton').and.callThrough();
		component.uploadFileUsingButton(uploadFileArrays);
		expect(component.uploadFileUsingButton).toHaveBeenCalled();
	});

	it('Should call uploadFileUsingButton method without files', () => {
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'uploadFileUsingButton').and.callThrough();
		component.uploadFileUsingButton(uploadEmptyFileArrays);
		expect(component.uploadFileUsingButton).toHaveBeenCalled();
	});

	it('Should call uploadFileUsingButton method without wrong files', () => {
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'uploadFileUsingButton').and.callThrough();
		component.uploadFileUsingButton(uploadWrongFilesArrays);
		expect(component.uploadFileUsingButton).toHaveBeenCalled();
	});

	it('Should call myCustomUploader method', () => {
		const uploadFileSpy = spyOn(financialStatementsService, 'uploadFile');
		ServiceSpy.spyCompServiceAndReturnDataForMock(uploadFileSpy, uploadFileResponse);
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'finalFileUplaod').and.callThrough();
		component.finalFileUplaod(fileObject);
		expect(component.finalFileUplaod).toHaveBeenCalled();
		expect(uploadFileSpy).toHaveBeenCalled();
		spyOn(component, 'myCustomUploader').and.callThrough();
		component.myCustomUploader(fileArrays);
		expect(component.myCustomUploader).toHaveBeenCalled();
	});

	it('Should call myCustomUploader method using empty files array', () => {
		component.isFileUploadedByButton = true;
		const uploadFileSpy = spyOn(financialStatementsService, 'uploadFile');
		ServiceSpy.spyCompServiceAndReturnDataForMock(uploadFileSpy, uploadFileResponse);
		component.myInputVariable = {
			nativeElement: { value: '' }
		};
		spyOn(component, 'finalFileUplaod').and.callThrough();
		component.finalFileUplaod(fileObject);
		expect(component.finalFileUplaod).toHaveBeenCalled();
		expect(uploadFileSpy).toHaveBeenCalled();
		spyOn(component, 'myCustomUploader').and.callThrough();
		component.myCustomUploader(emptyFileArrays);
		expect(component.myCustomUploader).toHaveBeenCalled();
	});

	// it('Should call saveUploadedFiles method', () => {
	//   spyOn(component, 'saveUploadedFiles').and.callThrough();
	//   component.saveUploadedFiles();
	//   expect(component.saveUploadedFiles).toHaveBeenCalled();
	// });

});
