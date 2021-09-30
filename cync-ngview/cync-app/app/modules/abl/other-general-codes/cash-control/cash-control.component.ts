import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CashControlService } from './service/cash-control.service';
import { GridOptions } from 'ag-grid-community';
import { CashControlExportStyle } from './model/cash-control.model';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';

@Component({
	selector: 'app-cash-control',
	templateUrl: './cash-control.component.html',
	styleUrls: ['./cash-control.component.scss']
})
export class CashControlComponent {
	cashControlModal: CustomGridModel;
	cashControlRowData: any = [];
	cashControlColumnDefs: any;
	cashControlGridApi: any;
	cashControlGridParams: any;
	cashControlGridOptions: GridOptions;
	cashControlGridColumnApi: any;
	cashControlDefaultColDef: any;
	systemGeneratedRows: any;
	selectedRows: any = [];
	public excelStyles: any;
	globalSearchIcon: boolean = true;
	globalSearchCloseIcon: boolean = false;
	isAddPermitted: boolean;
    isEditPermitted: boolean;
    isDeletePermitted: boolean;
	searchTerm: string = "";

	constructor(private _router: Router,
		private _apiMapper: APIMapper,
		private cashControlService: CashControlService,
		private _helper: Helper,
		private _commonAPIs: CommonAPIs) {

		/*Col Defination*/
		this.cashControlColumnDefs = [
			{
				headerName: 'Cash Control',
				field: 'cash_control',
				filter: 'agTextColumnFilter',
				headerCheckboxSelection: true,
				cellClass: "exportColumnClass",
				checkboxSelection: true
			},
			{
				headerName: 'Description',
				field: 'description',
				filter: 'agTextColumnFilter',
				cellClass: "exportColumnClass"
			},
		];

		this.cashControlDefaultColDef = {
			sortable: true,
			filter: true,
		};

		this.cashControlGridOptions = {
			columnDefs: this.cashControlColumnDefs,
			rowData: this.cashControlRowData,
			enableBrowserTooltips: true
		}
		this.excelStyles = CashControlExportStyle.setGridExportStyle();

	}

	ngOnInit() {
		this.getPermissions();
	 }


    /**
	 * Get Permissions for Exception
	 */
    getPermissions() {
		let userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);/*Logged In User*/
		let userRoleType = localStorage.getItem(CyncConstants.CYNC_USER_ROLE);
        if (!this._helper.compareIgnoreCase(userRoleType, CyncConstants.ADMIN_ROLE_TYPE)) {
            this._commonAPIs.getUserPermission('cash_controls', userRoleId).subscribe(permissions => {
                this.isAddPermitted = this._helper.getAddPermission(permissions);
                this.isDeletePermitted = this._helper.getDeletePermission(permissions);
                this.isEditPermitted = this._helper.getEditPermission(permissions);
                this.getCashControlGridData();
            });
        } else {
            this.isAddPermitted = true;
            this.isDeletePermitted = true;
            this.isEditPermitted = true;
            this.getCashControlGridData();
        }
    }


	/**
	 * Filter Search 
	 */
	onFilterTextBoxChanged(elm: any) {

		let searchText = elm.value;
		this.searchTerm = elm.value;
		this.cashControlGridOptions.api.setQuickFilter(searchText);
		if (searchText === '') {
			this.globalSearchCloseIcon = false;
			this.globalSearchIcon = true;
		}
		else {

			this.globalSearchCloseIcon = true;
			this.globalSearchIcon = false;
		}
	}

	/**
	 * Method to clear the global search
	 */
	clearSearchBox() {
		this.cashControlGridOptions.api.setQuickFilter('');
		this.searchTerm = '';
		this.globalSearchCloseIcon = false;
		this.globalSearchIcon = true;

	}

	cashControlOnGridReady(params: any) {
		this.cashControlGridParams = params;
		this.cashControlGridApi = params.api;
		this.cashControlGridColumnApi = params.columnApi;
		this.cashControlGridOptions.api.sizeColumnsToFit();
		this.getCashControlGridData();

	}

	/**
		* on row selected selected rows will be edited or deleted
		* 
		*/
	onRowSelected(event: any) {
		this.systemGeneratedRows = 0;
		this.selectedRows = this.cashControlGridOptions.api.getSelectedRows()
	}
	/**
	* Method to get all the grid data
	*/
	getCashControlGridData() {

		const url = this._apiMapper.endpoints[CyncConstants.GET_CASH_CONTROL_LIST];
		this.cashControlService.getcashControl(url).subscribe(response => {
			let tempData = <any>JSON.parse(response._body);
			this.cashControlRowData = tempData.data;
			this.cashControlGridOptions.api.setRowData(this.cashControlRowData);
		});
	}

	/**
	 *  Delated row method
	 */
	doDelete() {

		const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to delete selected Cash Controls?' }
		this._helper.openConfirmPopup(popupParams).subscribe(result => {
			if (result == true) {
				let ids = [];
				let deleteRows = this.cashControlGridOptions.api.getSelectedRows();
				deleteRows.forEach(element => {
					ids.push(element.id)
				});
				const url = this._apiMapper.endpoints[CyncConstants.DELETE_CASH_CONTROL_LIST].replace('{ids}', ids);
				this.cashControlService.delateCashControl(url).subscribe(response => {
					const message = 'Record Deleted Successfully';
					this._helper.showApiMessages(message, 'success');
					this.getCashControlGridData();
					this.cashControlGridOptions.api.refreshCells();
				});
			}
		});

	}
	/**
	 * This method gets called on click of Add Icon
	 */
	goToAdd() {
		this._router.navigateByUrl(this._router.url + '/add');
	}

	/**
	 * Method when edit icon is clicked
	 * @param event 
	 */
	goToEdit() {
		if (this.selectedRows !== undefined && this.selectedRows.length == 1) {
			this._router.navigateByUrl(this._router.url + "/" + this.selectedRows[0].id);
		}
	}

	/**
    * Export button enable or disable according to grid data conditions
    */
	isExportButtonDisable() {
		if (this.cashControlRowData && this.cashControlRowData.length > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
     **
	 * This method export the file into excel format
	 */
	exportData() {
		// Get array of ag-grid display header fields
		let gridHeaderKeys = [];
		(this.cashControlGridColumnApi.getAllDisplayedColumns()).forEach((e, i) => {
			if (e.colId != undefined) {
				gridHeaderKeys.push(e.colId);
			}
		});
		let params = {
			columnKeys: gridHeaderKeys,
			fileName: 'cash-control',
			rowHeight: 15,
			headerRowHeight: 20,
			onlySelected: this.booleanSelectedRowsIdentifier(),
			sheetName: 'Sheet1',
			customHeader: [
				[{
					styleId: "excelHeader",
					data: {
						type: "String",
						value: "Cash Controls Summary"
					},
					mergeAcross: gridHeaderKeys.length - 1
				}]
			]
		};
		if (gridHeaderKeys.length > 0) {
			this.cashControlGridApi.exportDataAsExcel(params);
		}
		else {
			this._helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
		}
	}

	booleanSelectedRowsIdentifier(){
		if(this.selectedRows.length > 0){
			return true;
		}
		else {
			return false;
		}
	}

}
