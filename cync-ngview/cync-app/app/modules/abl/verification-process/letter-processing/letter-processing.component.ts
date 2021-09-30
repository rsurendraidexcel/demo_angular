import { AgGridNg2 } from 'ag-grid-angular';
import { TabsetComponent } from 'ngx-bootstrap';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { LetterProcessingService } from './service/letter-processing.service'
import "ag-grid-enterprise";
// import * as _moment from 'moment';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DateRendererComponent } from '@app/modules/abl/verification-process/letter-processing/date-renderer/date-renderer.component';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs/Subscription';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
	selector: 'app-letter-processing',
	templateUrl: './letter-processing.component.html',
	styleUrls: ['./letter-processing.component.scss']
})
export class LetterProcessingComponent implements OnInit {

	clientSelectionSubscription: Subscription;
	gridOfNoticeOfAssginment: any;
	isGridDataLoaded = false;
	getLetterAPIResponse: any;
	gridColumnApi: any;
	gridApi: any;
	defaultColDef: {};
	@ViewChild('agGrid') agGrid: AgGridNg2;
	public rowData: any[];
	public columnDefs: any[];
	isNew: boolean;
	isDataLoaded = false;
	public auditLetterHeaders: any[];
	public noaHeaders: any[];
	borrowerId: string;
	letterType = 'Verification Letter';
	private components;
	letterNamesList: any;
	selectedIdArray = [];
	selectedRowArray = [];
	selectedPreviewRows = [];
	private editType;
	private frameworkComponents;
	gridOptions: any;

	constructor(private _message: MessageServices,
		private letterProcessingService: LetterProcessingService,
		private _apiMapper: APIMapper,
		private _clientSelectionService: ClientSelectionService
	) {
		this.borrowerId = CyncConstants.getSelectedClient();
	}

	ngOnInit() {
		this.borrowerId = CyncConstants.getSelectedClient();
		this.onChangeLetterType("Verification Letter");
		this.registerReloadGridOnClientSelection();
	}

	/**
	 * This method is to get headers for Notice Of Assignment
	 */
	getNoaHeaders() {
		let _this = this;
		this.noaHeaders = [
			{
				headerName: "Account No",
				field: "account_no",
				filter: "agTextColumnFilter",
				checkboxSelection: true,
				headerCheckboxSelection: true
			},
			{
				headerName: "Account Name",
				field: "account_name",
				filter: 'agTextColumnFilter',
				cellStyle: { 'text-align': "center" }
			},
			{
				headerName: 'Letter Name',
				field: 'letter_id',
				editable: true,
				filter: 'agTextColumnFilter',
				cellEditor: "agRichSelectCellEditor",
				cellStyle: { 'text-align': "center" },
				cellEditorParams: function (params) {
					let details = {};
					details = {
						cellHeight: 20,
						useFormatter: true,
						values: _this.extractValues(_this.letterNamesList)
					}
					return details;
				},
				valueFormatter: function (params) {
					return _this.lookupValue(_this.letterNamesList, params.value);
				},
				valueParser: function (params) {
					return _this.lookupKey(_this.letterNamesList, params.newValue);
				}
			},
			{
				headerName: "Ref.No",
				field: "ref_no",
				editable: true,
				filter: "agTextColumnFilter",
				cellStyle: { 'text-align': "right" }
			},
			{
				headerName: "Sent Date",
				field: "sent_date",
				filter: 'agTextColumnFilter',
				cellStyle: { 'text-align': "center" }
			},
			{
				headerName: "Received Date",
				field: "return_date",
				editable: false,
				filter: 'agTextColumnFilter',
				cellRenderer: "dateRenderer",
				cellStyle: { 'text-align': "center" }
			},
			{
				headerName: 'Verification Status',
				field: 'verification_status',
				editable: false,
				cellStyle: { 'text-align': "center" },
				cellRenderer: params => {
					return `<span style="cursor:pointer;"><input style="text-align:center" data-action-type="checkbox" type='checkbox' ${params.value ? 'checked' : ''} /></span>`;
				}
			}
		]
		this.frameworkComponents = {
			dateRenderer: DateRendererComponent
		};

		this.gridOptions = <GridOptions>{
			context: {
				letterProcessingGridContext: this
			}
		};
		// this.editType = "fullRow";
	}

	/**
	 * This method is to get headers for Audit Letters & Verification letter
	 */
	getAuditHeaders() {
		let _this = this;
		this.auditLetterHeaders = [
			{
				headerName: "Account No",
				field: "account_no",
				sortable: true,
				filter: "agTextColumnFilter",
				checkboxSelection: true,
				headerCheckboxSelection: true
			},
			{
				headerName: "Account Name",
				field: "account_name",
				filter: 'agTextColumnFilter',
				cellStyle: { 'text-align': "center" }
			},
			{
				headerName: "Invoice No",
				sortable: true,
				filter: "agTextColumnFilter",
				field: "invoice_no",
				cellStyle: { 'text-align': "right" }
				//   "width": 150,
			},
			{
				headerName: "Invoice Amount",
				field: "invoice_amount",
				filter: "agTextColumnFilter",
				cellStyle: { 'text-align': "right" }
				//   "width": 200,
			},
			{
				headerName: 'Letter Name',
				field: 'letter_id',
				editable: true,
				filter: 'agTextColumnFilter',
				cellEditor: "agRichSelectCellEditor",
				cellStyle: { 'text-align': "center" },
				cellEditorParams: function (params) {
					let details = {};
					details = {
						cellHeight: 20,
						useFormatter: true,
						values: _this.extractValues(_this.letterNamesList)
					}
					return details;
				},
				valueFormatter: function (params) {
					return _this.lookupValue(_this.letterNamesList, params.value);
				},
				valueParser: function (params) {
					return _this.lookupKey(_this.letterNamesList, params.newValue);
				}
			},
			{
				headerName: "Ref.No",
				field: "ref_no",
				filter: "agTextColumnFilter",
				editable: true,
				cellStyle: { 'text-align': "right" }
				//    "width": 120
			},
			{
				headerName: "Sent Date",
				field: "sent_date",
				filter: 'agTextColumnFilter',
				cellStyle: { 'text-align': "center" }
				//    "width": 140
			},
			{
				headerName: "Received Date",
				field: "return_date",
				editable: false,
				filter: 'agTextColumnFilter',
				cellRenderer: "dateRenderer",
				cellStyle: { 'text-align': "left" },
				"width": 220
			},
			{
				headerName: 'Verification Status',
				field: 'verification_status',
				editable: false,
				cellStyle: { 'text-align': "center" },
				cellRenderer: params => {
					return `<span style="cursor:pointer;"><input style="text-align:center" data-action-type="checkbox" type='checkbox' ${params.value ? 'checked' : ''} /></span>`;
				}
			}
		]
		this.frameworkComponents = {
			dateRenderer: DateRendererComponent
		};

		this.gridOptions = <GridOptions>{
			context: {
				letterProcessingGridContext: this
			}
		};
		// this.editType = "fullRow";
	}

	/**
	 * This method will set the grid size
	 */
	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.gridApi.sizeColumnsToFit();
	}

	/**
	 * This method will call on change of letter type
	 */
	onChangeLetterType(event: any) {
		const value = event;
		this.getLetterProcessingRecords(value);
	}

	/**
	 * This method is to get letter processing records
	 */
	getLetterProcessingRecords(type: string) {
		this.borrowerId = CyncConstants.getSelectedClient();
		this.isGridDataLoaded = false;
		this._message.showLoader(true);
		this.letterProcessingService.getLetterProcessingRecords(this.borrowerId, this.letterType).subscribe(response => {
			this.getLetterAPIResponse = response;
			this.letterNamesList = this.getLetterAPIResponse.letter_names;
			this.columnDefs = [];
			if (type == "Notice of Assignment") {
				this.getNoaHeaders();
				this.columnDefs = this.noaHeaders;
				this.gridOfNoticeOfAssginment = true;
				this.defaultColDef = { resizable: true };
				this.rowData = this.getLetterAPIResponse.processed_letters;
				this.isGridDataLoaded = true;
			} else {
				this.getAuditHeaders();
				this.columnDefs = this.auditLetterHeaders;
				this.gridOfNoticeOfAssginment = false;
				this.defaultColDef = { resizable: true };
				this.rowData = this.getLetterAPIResponse.processed_letters;
				this.isGridDataLoaded = true;
			}
			this._message.showLoader(false);
		});
	}

	/**
	 * This method will call on click of save button
	 */
	saveButtonClick() {
		var selectedRows = this.gridApi.getSelectedRows();
		if (selectedRows.length == 0) {
			this._message.addSingle("Please select edited Row to Save", "error");
		} else {
			this.selectedRowArray = [];
			for (let i = 0; i < selectedRows.length; i++) {
				this.selectedRowArray.push({
					"id": selectedRows[i].id,
					"ref_no": selectedRows[i].ref_no,
					"verification_status": selectedRows[i].verification_status,
					"return_date": selectedRows[i].return_date,
					"letter_id": selectedRows[i].letter_id,
					"sent_date": selectedRows[i].sent_date
				})
			}
			const letterModel = {
				'processed_letters': this.selectedRowArray,
				"letter_type": this.letterType
			}
			this._message.showLoader(true);
			this.letterProcessingService.sendLetters("borrowers/" + this.borrowerId + "/verification_letter_processes/save", letterModel).subscribe(res => {
				this._message.addSingle("Record has been saved successfully", "success");
				this.getLetterProcessingRecords(this.letterType);
			});
		}
	}


 /**
  * On Row click event method
  * @param e 
  */
	public onRowClicked(e) {
		if (e.event.target !== undefined) {
			let data = e.data;
			let actionType = e.event.target.getAttribute("data-action-type");
			let myArray = this.rowData;
			let objIndex = myArray.findIndex((obj => obj.id == data.id));
			if (actionType == 'checkbox') {
				myArray[objIndex].verification_status = e.event.target.checked;
			}
			this.rowData = myArray;
		}
	};

	/**
	 * This method will call on click of send letter button
	 */
	sendLetterButtonClick() {
		var selectedRows = this.gridApi.getSelectedRows();
		if (selectedRows.length == 0) {
			this._message.addSingle("Please select Row to send letter", "error");
		} else {
			this.selectedIdArray = [];
			for (let i = 0; i < selectedRows.length; i++) {
				this.selectedIdArray.push(selectedRows[i].id)
			}
			const letterModel = {
				'processed_letters': { "ids": this.selectedIdArray },
				"letter_type": this.letterType
			}
			this._message.showLoader(true);
			this.letterProcessingService.sendLetters("borrowers/" + this.borrowerId + "/verification_letter_processes/send_letter", letterModel).subscribe(res => {
				this._message.addSingle("Letter has been sent successfully", "success");
				this.getLetterProcessingRecords(this.letterType);
			});
		}
	}

	/**
	 * This method will call on click of cancel button
	 */
	cancelButtonClick() {
		this.getLetterProcessingRecords(this.letterType);
	}

	/**
	 * This method will call on click of preview letter button
	 */
	previewLetterButtonClick() {
		var selectedRows = this.gridApi.getSelectedRows();
		if (selectedRows.length == 0) {
			this._message.addSingle("Please select Row to preview letter", "error");
		} else {
			this.selectedPreviewRows = [];
			for (let i = 0; i < selectedRows.length; i++) {
				this.selectedPreviewRows.push(selectedRows[i].id)
			}
			const letterModel = {
				'processed_letters': { "ids": this.selectedPreviewRows },
				"letter_type": this.letterType,
				"borrower_id": this.borrowerId
			}
			this._message.showLoader(true);
			this.letterProcessingService.exportLetters("borrowers/" + this.borrowerId + "/verification_letter_processes/preview_letter", letterModel).subscribe(
				(blob: any) => {
					this.downloadFile(blob);
					this._message.showLoader(false);
				},
				error => {
					//TODO
				},
				() => {
					//TODO 
				});
		}


	}

	/**
	 * This method is to download pdf file
	 */
	downloadFile(blob: Blob) {
		let FileName = 'verification_letter_process.pdf';
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, FileName);
		} else {
			var link = document.createElement('a');
			document.body.appendChild(link);
			link.href = window.URL.createObjectURL(blob);
			link.download = FileName; //changed to xls as per Anoop's review
			link.click();
		}
	}

	/**
	* Extract object keys
	* @param mappings 
	*/
	extractValues(mappings) {
		return Object.keys(mappings);
	}

	/**
	* Map object value according to key 
	* @param mappings 
	* @param key 
	*/
	lookupValue(mappings, key) {
		return mappings[key];
	}

	/**
	* Map object key
 	* @param mappings 
	* @param name 
	*/
	lookupKey(mappings, name) {
		for (var key in mappings) {
			if (mappings.hasOwnProperty(key)) {
				if (name === mappings[key]) {
					return key;
				}
			}
		}
	}

	/**
	 * This method will call on change of date in grid
	 */
	public onChangeDate(value: any, rowIndex: number) {
		this.rowData[rowIndex].return_date = value;
	}

	/**
 * This method is taken care when user will change the client or borrowers
 */
	registerReloadGridOnClientSelection() {
		this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
			this._message.showLoader(true);
			this.letterType = "Verification Letter";
			this.getLetterProcessingRecords("Verification Letter")
		});
	}



	// scrambleAndRefreshAll() {
	// 	this.gridApi.refreshCells();
	// }

}



