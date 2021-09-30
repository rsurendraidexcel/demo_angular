import { Component, OnInit } from '@angular/core';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { UdfMappingService } from '@app/Administration/user-defined-field/udf-mapping/service/udf-mapping.service';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';

@Component({
	selector: 'app-list-udf-mapping',
	templateUrl: './list-udf-mapping.component.html',
	styleUrls: ['./list-udf-mapping.component.scss']
})

/**
 * @author : Saakshi Sharma
 */
export class ListUdfMappingComponent implements OnInit {
	assetsPath = CyncConstants.getAssetsPath();

	listUdfMappingModel: CustomGridModel;
	// Grid Variables
	globalSearchIcon: boolean = true;
	//globalSearchCloseIcon: boolean = false;
	searchTerm: string = '';
	gridData: any = [];
	loadCount = 0;
	pageNumber = 1;
	rowcount: number = 25;
	showmoreData: any = [];
	isAddPermitted: boolean;
	isEditPermitted: boolean;
	isDeletePermitted: boolean;
	// recordTotal: number;
	selectedRows: any = [];
	toggleDeleteIcon: boolean;
	toggleEditIcon: boolean;
	dataTableElementId: string = 'cync_main_contents';
	toggleExportModal: boolean;
	toggleExportErrorModal: boolean;
	exportHeaderArray: any;
	exportRowArray: any;
	isGridDataLoaded: boolean = false;
	sortKey = CyncConstants.ORDER_BY_UPDATED_AT;
	sortOrder = CyncConstants.DESC_ORDER;
	// filterRecordCount: number = -1;

	// array to display the export columns
	exportColumns: ExportColumn[] = [];
	filteredData: any[] = [];
	isFilterPresent = false;
	showNoRecords = false;

	// show loader on scroll event
	// showSpinner: boolean;

	// Constant variables for list UDF Mapping page
	public static UDF_MAPPING_MODEL_TYPE = 'UDF Mapping - Summary';
	public static UDF_MAPPING_API = 'udf-mapping-api';
	public static DELETE_UDF_MAPPING_API = 'delete-udf-mapping';
	public static PROGRAM_COL_HEADER = 'Program';
	public static USER_DEFINED_FIELD_HEADER = 'User Defined Field';
	public static USER_DEFINED_KEY_FIELD = 'user_defined_field';


	/**
	 * Constructor to inject all the dependencies required for list-udf-mapping component
	 */
	constructor(private _apiMapper: APIMapper,
		private _helper: Helper,
		private _commonAPIs: CommonAPIs,
		private _message: MessageServices,
		private udfMappingService: UdfMappingService,
		private _router: Router) {

	}

	/**
	 * Method to initialize all the data required for this list-udf-mapping page to load
	 */
	ngOnInit() {
		this.initializeUdfMappingModel();
		this.getPermissions();
	}

	/**
	 * This method is used to validat eif the colheader is Progrma
	 * then display programs as vertical list in Data Table
	 * @param colHeader
	 */
	isColHeaderUdf(colHeader: string): boolean {
		return this._helper.compareIgnoreCase(colHeader, ListUdfMappingComponent.USER_DEFINED_FIELD_HEADER);
	}

	/**
	 * Method to initialize the UDF Mapping listing model
	 */
	initializeUdfMappingModel() {
		this.listUdfMappingModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			type: ListUdfMappingComponent.UDF_MAPPING_MODEL_TYPE,
			apiDef: { getApi: this._apiMapper.endpoints[ListUdfMappingComponent.UDF_MAPPING_API], deleteApi: this._apiMapper.endpoints[ListUdfMappingComponent.DELETE_UDF_MAPPING_API], updateApi: '' },
			columnDef: [
				{ field: ListUdfMappingComponent.USER_DEFINED_KEY_FIELD, header: ListUdfMappingComponent.USER_DEFINED_FIELD_HEADER, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'program', header: ListUdfMappingComponent.PROGRAM_COL_HEADER, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
			],
			responseKey: 'udf_mappings',
			isSearchAvailable: true,
			isAdvanceSearchAvailable: false,
			isAddFunctionalityRequired: true,
			isEditFunctionalityRequired: true,
			isDeleteFunctionalityRequired: true,
			isExportFunctionalityRequired: true,
			isReloadFunctionalityRequired: false,
			onlyListingComponent: false,
			showTotalRecords: true,
			searchViaAPI: true,
			menuName: 'udf_mapping',
			permissionRequired: true,
			isMoreIconsRequired: false
		}
	}

	/**
	 * This method replaces the request params with original value
	 * @param url
	 * @returns Final url for get UDF Mapping API with all the request params replaced
	 */
	getAllUDFMappingUrl(url: string): string {
		let getAllApiUrl = url.replace(CyncConstants.SORT_BY_PARAM_VALUE, this.sortOrder)
			.replace(CyncConstants.ORDER_BY_PARAM_VALUE, this.sortOrder);
		// .replace(CyncConstants.PAGE_PARAM_VALUE, this.pageNumber.toString())
		// .replace(CyncConstants.ROWS_PARAM_VALUE, this.rowcount.toString());
		// if (!(this.searchTerm != null && this.searchTerm != undefined && this.searchTerm.length > 0)) {
		// 	this.searchTerm = '';
		// }
		// getAllApiUrl = getAllApiUrl + this.searchTerm;
		return getAllApiUrl;
	}

	/**
	 * Get Permissions for Udf Mapping
	 */
	getPermissions() {
		let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
		let roleType = localStorage.getItem('cyncUserRole');
		if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
			this._commonAPIs.getUserPermission(this.listUdfMappingModel.menuName, userRoleId).subscribe(permissions => {
				this.isAddPermitted = this._helper.getAddPermission(permissions);
				this.isDeletePermitted = this._helper.getDeletePermission(permissions);
				this.isEditPermitted = this._helper.getEditPermission(permissions);
				this.getGridData();
			});
		} else {
			this.isAddPermitted = true;
			this.isDeletePermitted = true;
			this.isEditPermitted = true;
			this.getGridData();
		}
	}



	/**
	 * Method to get all the grid data
	 */
	getGridData() {
		this._message.showLoader(true);
		const url = this.getAllUDFMappingUrl(this.listUdfMappingModel.apiDef.getApi);
		this.udfMappingService.getAllUdfMappingData(url).subscribe(udfMappingData => {
			// this.recordTotal = udfMappingData.recordTotal;
			this.gridData = udfMappingData[this.listUdfMappingModel.responseKey];
			// if(this.recordTotal === undefined && this.gridData!==undefined){
			// 	this.recordTotal = this.gridData.length;
			// }
			let isUdfsPresent = false;
			if (this.gridData !== undefined && this.gridData.length > 0) {
				this.gridData = this.gridData.filter(u => (u.user_defined_field !== undefined && u.user_defined_field.length > 0));
				// for(let i=0; i<this.gridData.length; i++){
				// 	let element = this.gridData[i];
				// 	if(element.user_defined_field!==undefined && element.user_defined_field.length>0){
				// 		isUdfsPresent = true;
				// 		break;
				// 	}
				// }
			}

			// Initialize gridData to blank array if getting no records
			if (this.gridData === null || this.gridData === undefined) {
				this.gridData = [];
			}
			this.isGridDataLoaded = true;
			this._message.showLoader(false);
		});
	}

	/**
	 * Method that gets called for global search
	 * @param event
	 * Commenting this code as currently only two programs and global search not required
	 */
	// onKey(event: any) {
	// 	if (this.searchTerm == CyncConstants.BLANK_STRING || this.searchTerm == undefined || this.searchTerm == null) {
	// 		this.searchTerm = '';
	// 		this.globalSearchCloseIcon = false;
	// 		this.globalSearchIcon = true;
	// 	}
	// 	else {
	// 		this.globalSearchCloseIcon = true;
	// 		this.globalSearchIcon = false;
	// 	}


	// 	if (this.listUdfMappingModel.searchViaAPI) {
	// 		// Make entry for search api
	// 		this.pageNumber = 1;
	// 		this._helper.scrollTopDataTable(this.dataTableElementId);
	// 		this.udfMappingService.getAllUdfMappingData(this.getAllUDFMappingUrl
	// 			(this.listUdfMappingModel.apiDef.getApi)).subscribe(udfMappingData => {
	// 				this.gridData = udfMappingData[this.listUdfMappingModel.responseKey];
	// 				this.recordTotal = udfMappingData.recordTotal;
	// 			});
	// 	}
	// }

	/**
	 * Method to clear the global search
	 * Commenting this method because currently only two programs, hence global search is not required
	 */
	clearSearchBox() {
		this.searchTerm = '';
		this.globalSearchIcon = true;
		this.isFilterPresent=false;
		this.showNoRecords=false;
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
		if (this.isEditPermitted && this.selectedRows !== undefined && this.selectedRows.length == 1) {
			this._router.navigateByUrl(this._router.url + "/" + this.selectedRows[0].program_id);
		}
	}

	/**
	 * Method when delete icon is clicked
	 */
	delete() {
		const idsToBeDeleted = [];
		const udfsForSelectedIds = [];
		for (let ids of this.selectedRows) {
			idsToBeDeleted.push(ids.program_id);
			udfsForSelectedIds.push(ids.program);
		}
		const popupParam = { 'title': 'Confirmation', 'message': '' + ClientValidationMessages.DELETE_UDF_MAPPINGS + '' + udfsForSelectedIds + '?', 'msgType': 'warning' };
		this._helper.openConfirmPopup(popupParam).subscribe(result => {
			if (result) {
				this.deleteSelectedRows(idsToBeDeleted);
			} else {
				// unselect all checkbox
				this.selectedRows = [];
				this.updateGridIcons();
			}
		});
	}

	/**
	 * this method will take selected rows id and will call api to delete thoese records   *
	 * @param idsToBeDeleted
	 */
	deleteSelectedRows(idsToBeDeleted: any[]) {
		this._message.showLoader(true);
		const deleteEndpoint = this.listUdfMappingModel.apiDef.deleteApi + idsToBeDeleted;
		this.udfMappingService.deleteUDFMapping(deleteEndpoint).subscribe(response => {
			this._helper.showApiMessages(CyncConstants.DELETE_MESSAGE, 'success');
			this.selectedRows = [];
			this.updateGridIcons();
			this.getGridData();
			this._message.showLoader(false);
		});
	}

	/**
	 * Method to update add/edit icons
	 */
	updateGridIcons() {
		if (this.isDeletePermitted) {
			this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
		}
		if (this.isEditPermitted) {
			this.toggleEditIcon = this.selectedRows != undefined && this.selectedRows.length == 1;
		}
	}

	/**
	 * This method enables the export dialog which has checkboxes for the columns to be exported
	 */
	showDialogForExport() {
		this.exportColumns = [];
		this.exportColumns = this._helper.getExportColumns(this.listUdfMappingModel.columnDef);
		this.toggleExportModal = true;
	}

	/**
	 * This method gets called to export the columns
	 * @param exportedCol
	 */
	exportSelectedColumns(selectedColumns: ExportColumn[]) {

		let queryParam: string = this.getExportQueryParam(this.selectedRows, selectedColumns);
		if (queryParam != undefined && queryParam.length > 0) {
			// set the api endpoint

			// hide the export popup
			this.toggleExportModal = false;
			this._message.showLoader(true);
			this.udfMappingService.exportUdfMappingData(this.listUdfMappingModel.apiDef.getApi.split('?')[0], queryParam).subscribe(blob => {
				// unselect all checkboxes
				this.selectedRows = [];
				//empty all  columns in the popup
				this.exportColumns = [];
				// download the xls file
				this.updateGridIcons();
				this._helper.downloadFile(blob, this.listUdfMappingModel.type);
				this._message.showLoader(false);
			});
		} else {
			//If all the columns are unchecked show warning msg to select atleast one column
			this.toggleExportErrorModal = true;
			this.toggleExportModal = true;
		}
	}

	/**
     * Method to get the query params for export API
     * @param selectedRows
     * @param selectedColumns
     */
    getExportQueryParam(selectedRows: any[], selectedColumns: ExportColumn[]): string {
        let queryParam: string = CyncConstants.BLANK_STRING;
        let rowParam: string = this.getRowSearchParam(selectedRows);
        let colParam: string = this.getColumnSearchParam(selectedColumns);
        if (colParam.length > 0) {
            if (rowParam.length > 0) {
                queryParam = rowParam + '&' + colParam;
            } else {
                queryParam = colParam;
            }
        }
        if (queryParam.length > 0) {
            return queryParam;
        }
    }

    /**
     * Method to get column query params for export API
     * @param selectedColumns
     */
    getColumnSearchParam(selectedColumns: ExportColumn[]): string {
        let selectedColSearchParam = [];
        selectedColumns.forEach(colData => {
            if (colData.isChecked) {
                selectedColSearchParam.push(colData.searchParam);
            }
        });
        if (selectedColSearchParam.length > 0) {
            return selectedColSearchParam.join('&');
        }
        return CyncConstants.BLANK_STRING;
    }

    /**
     * Method to get row query params for export API
     * @param selectedRows
     */
    getRowSearchParam(selectedRows: any[]): string {

        let selectedRowSearchParam = [];
        selectedRows.forEach(rowData => {
            let rowParam: string = CyncConstants.EXPORT_ROW_PARAM + rowData.program_id;
            selectedRowSearchParam.push(rowParam);
        });
        if (selectedRowSearchParam.length > 0) {
            return selectedRowSearchParam.join('&');
        }
        return CyncConstants.BLANK_STRING;
    }

	/**
	 *
	 * @param selectedRow
	 */
	goToView(selectedRow: any) {
		let event: any = selectedRow.originalEvent;
		if (selectedRow.type == 'checkbox') {
			this.updateGridIcons();
		} else if (selectedRow.type == 'row' && this.isEditPermitted) {
			this.selectedRows = '';
			let rowId = selectedRow.data.program_id;
			this._router.navigateByUrl(this._router.url + "/" + rowId);
		}

	}

	/**
	 * Method gets called when all the checkboxes are checked
	 */
	selectAllChkBox() {
		if (this.isDeletePermitted) {
			this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
		}
	}

	/**
	 * Method when we uncheck a checkbox
	 */
	unSelectChkBox() {
		this.updateGridIcons();
	}

	/**
	 * This method gets called on global search
	 * @param event
	 */
	globalSearchMethod(event) {
		if (event != undefined) {
			if (event.target !== undefined && event.target.value !== undefined && event.target.value.length > 0) {
				this.globalSearchIcon = false;
				this.udfColumnFilterMethod(event);

			} else {
				this.globalSearchIcon = true;
				this.isFilterPresent = false;
			}
		}


	}

	/**
	 * This method is used to update the record count when column filter is used
	 * @param event
	 * Commenting this method as Pagination is not required beacuse only two programs are there
	 */
	udfColumnFilterMethod(event) {

		if (event != undefined) {
			if (event.target !== undefined && event.target.value !== undefined && event.target.value.length > 0) {
				this.isFilterPresent = true;
				const searchText = event.target.value;

				this.filteredData = this.gridData.filter(e => {
					let flag = false;

					if (!this.globalSearchIcon) {
						const programName = e.program;
						if (programName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1) {
							return true;
						}

					}
					let udf_values = JSON.parse(JSON.stringify(e.user_defined_field));
					if (udf_values !== undefined && udf_values.length > 0) {
						for (let i = 0; i < udf_values.length; i++) {
							let gridDataValue: string = udf_values[i].udf_name;

							if (gridDataValue.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1) {
								flag = true;
								break;
							}
						}
					}
					return flag;
				});

				if (this.filteredData !== undefined && this.filteredData.length === 0) {
					this.showNoRecords = true;
				}

			} else {
				this.isFilterPresent = false;
			}

		} else {
			this.isFilterPresent = false;
		}
	}

	/**
	 * This method gets called on column filter for Program Column
	 * @param event
	 */
	onFilterUdfMapping(event){
		if(event!=undefined && event.filteredValue!==undefined && event.filteredValue.length>0){
			this.showNoRecords = false;
		}else{
			this.showNoRecords = true;
		}
	}
}
