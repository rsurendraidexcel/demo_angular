import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '@cyncCommon/utils/helper';
import { FileUpload } from 'primeng/primeng';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Subscription } from 'rxjs/Subscription';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-financial-statements-landing',
	templateUrl: './financial-statements-landing.component.html',
	styleUrls: ['./financial-statements-landing.component.scss']
})
export class FinancialStatementsLandingComponent implements OnInit, OnDestroy {

	@ViewChild(FileUpload) FileUploadComponent: FileUpload;
	@ViewChild('myInput') myInputVariable: any;

	assetsPath: string = CyncConstants.getAssetsPath();
	fileNameUploadedByButton = '';
	fileObject: any;
	isFileDragDropped = false;
	isFileUploadedByButton = false;
	fileFormats = ['xls', 'xlsx'];
	headerText = CyncConstants.HEADER_TEXT;
	projectID = '';
	// projectID = CyncConstants.getprojetID();
	selectedRadioBtn = 'finanical_statements';
	enableFinanceStatementComplete = false;
	enableFinanceRatioComplete = false;
	projectName = '';
	clientSelectionSubscription: Subscription;


	constructor(private _router: Router,
		private _message: MessageServices,
		private _helper: Helper,
		private _apiMapper: APIMapper,
		private route: ActivatedRoute,
		private _financialStatementsService: FinancialStatementsService,
		private _commonApiHelper: CommonAPIs,
		private _clientSelectionService: ClientSelectionService,
		private _radioButtonVisible: RadioButtonService) { }

	ngOnInit() {
		this._message.showLoader(true);
		this.getProjectID();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(this.enableFinanceStatementComplete, this.projectID, this.selectedRadioBtn);
	}

	/**
	  * Get Project ID from URL
	  */
	getProjectID() {
		// Getting project-ID from route URL
		this.route.params.subscribe(params => {
			this.projectID = params['id'];
			this.getProjectDetails(this.projectID);
			this._commonApiHelper.getServiceProjectStatus(this.projectID).subscribe(financeProjectStatus => {
				this.enableFinanceStatementComplete = financeProjectStatus.financeStatementComplete;
				this.enableFinanceRatioComplete = financeProjectStatus.financeRatioComplete;
				this._message.showLoader(false);
			});
		});
	}

	/**
	* This method is use to get project details
	* @param projectID
	*/
	getProjectDetails(projectID) {
		this._financialStatementsService.getProjectDetails(this._apiMapper.endpoints[CyncConstants.GET_PROJECT_DETAILS]
			.replace('{projectId}', projectID)).subscribe(res => {
				this.projectName = res.projectName;
			});
	}

	/*
	** File uploaded using drag and drop
	*/
	fileSelectDragDrop(event: any) {
		const fileExtenstion = event.files[0].name.split('.').pop();
		if (fileExtenstion === 'xls' || fileExtenstion === 'xlsx') {
			this.isFileDragDropped = true;
			this.isFileUploadedByButton = false;
			this.fileNameUploadedByButton = '';
			this.fileObject = '';
			this.myInputVariable.nativeElement.value = '';
		} else {
			this._helper.openAlertPoup('warning_msg', 'please select only ' + this.fileFormats + ' file !');
			this.resetUploadFiles();
		}
	}

	/*
	** Uploaded file removed for drag and drop
	*/
	fileRemovedDragDrop() {
		this.isFileDragDropped = false;
	}

	/*
	** Navigate to Financial setup page
	*/
	navigateToSetup() {
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL]
			.replace('{projectId}', this.projectID));
	}

	/*
	** Reset uploaded file while click on cancel button
	*/
	resetUploadFiles() {
		this.FileUploadComponent.clear();
		this.isFileDragDropped = false;
		this.isFileUploadedByButton = false;
		this.fileNameUploadedByButton = '';
		this.fileObject = '';
		this.myInputVariable.nativeElement.value = '';
	}

	/**
	 * Method to navigate back to summary page on click of cancel
	 */
	backToSummary() {
		this.resetUploadFiles();
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_ANALYZER_REDIRECT_URL]);
	}

	/*
	** Onchange event while uploading file using upload file button
	*/
	uploadFileUsingButton(event: any) {
		if (event.target.files.length > 0) {
			if (this._helper.isFileExtensionValid(event.target.files[0], this.fileFormats)) {
				this.fileNameUploadedByButton = event.target.files[0].name;
				this.fileObject = event.target.files[0];
				this.isFileUploadedByButton = true;
			} else {
				this.resetUploadFiles();
			}
		} else {
			this.resetUploadFiles();
		}
	}

	/*
	** Save uploaded file while click on save button
	*/
	saveUploadedFiles() {
		this.FileUploadComponent.upload();
	}

	/*
	** Custom function for drag & drop for file upload
	*/
	myCustomUploader(event) {
		if (event.files.length > 0) {
			this.finalFileUplaod(event.files[0]);
		} else if (this.isFileUploadedByButton) {
			this.finalFileUplaod(this.fileObject);
		}
	}

	/*
	** Upload file API call
	*/
	finalFileUplaod(fileObject) {
		this._message.showLoader(true);
		const formdata = new FormData();
		formdata.append('financeStmtFile', fileObject, fileObject['name']);
		const fileUploadAPIURL = this._apiMapper.endpoints[CyncConstants.FINANCIAL_FILE_UPLOAD_URL].replace('{projectId}', this.projectID);
		this._financialStatementsService.uploadFile(fileUploadAPIURL, formdata).subscribe(res => {
			this._message.showLoader(false);
			if (res.status === 200 || res.status === 201) {
				this._helper.showApiMessages('File uploaded successfully', 'success');
				this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL]
					.replace('{projectId}', this.projectID));
			}
			this.resetUploadFiles();
		});
	}

	/*
	** Save button validation
	*/
	saveButtonValidation() {
		if (this.isFileDragDropped || this.isFileUploadedByButton) {
			return true;
		} else {
			return false;
		}
	}

	/*
	** Download Excel template
	*/
	downloadExcelTemplate() {
		this._message.showLoader(true);
		this._financialStatementsService.downloadExcelTemplate(
			this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENT_DOWNLOAD_TEMPLATE_URL].replace('{projectId}', this.projectID))
			.subscribe(blob => {
				this.downloadFile(blob, 'Financial Statement');
				this._message.showLoader(false);
			});
	}

	/**
	  * This method gets called to download excel file from blob response returned from api
	  */
	downloadFile(blob: Blob, filename: string) {
		const xlsFileName = filename + '.xlsx';
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, xlsFileName);
		} else {
			const link = document.createElement('a');
			document.body.appendChild(link);
			link.href = window.URL.createObjectURL(blob);
			link.download = xlsFileName;
			link.click();
		}
	}


	/**
	 * This method is taken care when user will change the client or borrowers
	 */
	registerReloadGridOnClientSelection() {
		const currObj = this;
		this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
			if (typeof clientId === 'string' && this._helper.compareIgnoreCase(clientId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
				setTimeout(function () {
					window.location.href = '../../';
				}, 2000);
			} else {
				this.navigateToFAList();
			}
		});
	}

	/**
   * Method to navigate back to FA list
   */
	navigateToFAList() {
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
	}

	/**
	   * unsubscribe the observable for client change
	   */
	ngOnDestroy() {
		if (this.clientSelectionSubscription !== undefined) {
			this.clientSelectionSubscription.unsubscribe();
		}
	}
}
