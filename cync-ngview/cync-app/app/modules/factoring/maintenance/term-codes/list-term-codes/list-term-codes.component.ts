import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { TabsetComponent } from 'ngx-bootstrap';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { TermCodesService } from '../service/term-codes.service';
import { TermCodeModel } from '../model/term-codes.model';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
    selector: 'app-list-term-codes',
    templateUrl: './list-term-codes.component.html',
    styleUrls: ['./list-term-codes.component.scss']
})
export class ListTermCodesComponent implements OnInit {
    @ViewChild('agGrid') agGrid: AgGridNg2;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    public gridOptions: GridOptions;
    public rowData: any[];
    public columnDefs: any[];
    isNew: boolean;
    termCodesListAPIResponse: any;
    selectedDropDownValue = "active";
    isDataLoaded = false;
    ADD_NEW_HEADING_STRING = 'Add New Term Code';
    EDIT_HEADING_STRING = 'Edit Term Code';
    namingOfTab = this.ADD_NEW_HEADING_STRING;
    gridApi: any;
    defaultColDef: any;
    frameworkComponents:any;
    constructor(
        private _apiMapper: APIMapper,
        private _helper: Helper,
        private _commonAPIs: CommonAPIs,
        private _message: MessageServices,
        private _termCodesService: TermCodesService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this._message.showLoader(true);
        this.initializeColumnDefination();
        this.initializeTermCodesListData();
    }

    /**
    * Initialized grid column defination
    */
    initializeColumnDefination() {
        this.columnDefs = [
            { headerName: 'ID', field: 'id', hide: true },
            { headerName: 'Name', field: 'name', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: true, headerCheckboxSelection: true },
            // { headerName: 'Description', field: 'description', sortable: true, filter: 'agTextColumnFilter' },
            { headerName: 'Days', field: 'days', sortable: true, filter: 'agNumberColumnFilter' },
            { headerName: 'Status', field: 'status', sortable: true, filter: 'agTextColumnFilter', valueFormatter: this.statusValueFormatter },
            {
                headerName: "Actions",
                suppressMenu: true,
                suppressSorting: false,
                cellClass: 'action-class',
                width: 90,
                tooltipField: 'edit' ,
                template: `<i class="fa fa-pencil-square-o fa-2x custom-icon-size-ingrid" 
                aria-hidden="true" data-action-type="view" title="Edit"></i>`

            }
        ];

    }

    /**
	* Initialize Term Codes List data
	*/
    initializeTermCodesListData() {
        let url = this._apiMapper.endpoints[CyncConstants.TERM_CODES_LIST].replace('{status}', this.selectedDropDownValue);
        this._termCodesService.getTermCodesList(url).subscribe(res => {
            this.isDataLoaded = true;
            this.rowData = res.term_codes;
            this.termCodesListAPIResponse = res;
            this._message.showLoader(false);
        }, error => {
            this.isDataLoaded = false;
            this._message.showLoader(false);
        });
    };

     /**
   * binding data to ag-grid table
   * @param params 
   */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

	/**
	* Select Tab event
	* @param tabId 
	*/
    selectTab(tabId: number) {
        this.isNew = true;
        this.namingOfTab = this.ADD_NEW_HEADING_STRING;
        setTimeout(() => {
            this.staticTabs.tabs[tabId].active = true;
        }, 100);
    };

    /**
    * On Row click event method
    * @param e 
    */
    public onRowClicked(e) {
        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute("data-action-type");
            switch (actionType) {
                case "view":
                    this.namingOfTab = this.EDIT_HEADING_STRING;
                    return this.editButtonClick(data);
            }
        }
    };

    /**
    * Edit button click method
    * @param data 
    */
    public editButtonClick(data: any) {
        this.isNew = true;
        setTimeout(() => {
            this.staticTabs.tabs[1].active = true;
        }, 100);
        CyncConstants.setTermCodeRowData(data);
    }

    /**
    * Delete button click event
    */
    onDeleteButtonClick() {
        let selectedRowArray = this.getSelectedRows();
        if (selectedRowArray.length > 0) {
            const selectedRowIDS = selectedRowArray.map(node => node.id).join(',');
            const selectedRowNames = selectedRowArray.map(node => node.name).join(', ');
            const popupParam = { 'title': CyncConstants.CONFIRMATION_POPUP_TITLE, 'message': CyncConstants.DELETE_RECORDS_POPUP_MESSAGE + selectedRowNames + '?', 'msgType': 'warning' };
            this._helper.openConfirmPopup(popupParam).subscribe(result => {
                if (result) {
                    this.deleteSelectedRows(selectedRowIDS);
                }
            });
        }
    }

    /**
     * Export button click event
     */
    onExportButtonClick(){
        var params = {
            fileName: "Term-Code",
            sheetName:"sheet-1",
            columnKeys: ["name","days","status"]
          };
          console.log()
          this.gridApi.exportDataAsExcel(params);
    }

    /**
    * Final delete selected rows
    * @param idsToBeDeleted
    */
    deleteSelectedRows(idsToBeDeleted: any) {
        this._message.showLoader(true);
        let url = this._apiMapper.endpoints[CyncConstants.DELETE_TERM_CODES].replace('{ids}', idsToBeDeleted);
        this._termCodesService.deleteTermCodes(url, '').subscribe(deleteResponse => {
            if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
                this._helper.showApiMessages(CyncConstants.DELETE_MESSAGE, 'success');
                this.initializeTermCodesListData();
            } else {
                this._message.showLoader(false);
            }
        }, error => {
            console.log("Inside delete error block: ", error);
            this.initializeTermCodesListData();
        });
    }

    /**
    * Get selected rows details
    */
    getSelectedRows() {
        const selectedNodes = this.agGrid.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData;
    }

    /**
    * Change status type dropdown event
    * @param value 
    */
    changeStatusType(value: string) {
        this._message.showLoader(true);
        this.selectedDropDownValue = value;
        this.initializeTermCodesListData();
    }

    /**
    * Reload grid data
    */
    reloadGrid() {
        this._message.showLoader(true);
        this.initializeTermCodesListData();
    }

    /**
    * Status value first letter of a string uppercase
    * @param params
    */
    statusValueFormatter(params) {
        if (params.value.length > 0) {
            return (params.value).charAt(0).toUpperCase() + (params.value).slice(1);
        } else {
            return params.value;
        }
    }
}
