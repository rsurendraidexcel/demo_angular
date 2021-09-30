import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { TabsetComponent } from 'ngx-bootstrap';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { AgGridNg2 } from 'ag-grid-angular';
import { LetterNamesService } from '@app/Administration/general-codes/content/letter-names/service/letter-names.service';

@Component({
  selector: 'app-list-letter-names',
  templateUrl: './list-letter-names.component.html',
  styleUrls: ['./list-letter-names.component.scss']
})
export class ListLetterNamesComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridNg2;
  //@ViewChild('staticTabs') staticTabs: TabsetComponent;
  public gridOptions: GridOptions;
  public rowData: any[];
  public columnDefs: any[];
  isNew: boolean;
  isDataLoaded = false;
  ADD_NEW_HEADING_STRING = 'Add New Term Code';
  EDIT_HEADING_STRING = 'Edit Term Code';
  namingOfTab = this.ADD_NEW_HEADING_STRING;
  constructor(
    private _apiMapper: APIMapper,
    private _helper: Helper,
    private _commonAPIs: CommonAPIs,
    private _message: MessageServices,
    private _letterNamesService: LetterNamesService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this._message.showLoader(true);
    this.initializeColumnDefination();
    this.initializeLetterNamesListData();

  }

  /**
  * Initialized grid column defination
  */
  initializeColumnDefination() {
    this.columnDefs = [
      { headerName: 'ID', field: 'id', hide: true },
      { headerName: 'Lender', field: 'lender_name', sortable: true, filter: 'agTextColumnFilter' ,width:150},
      { headerName: 'Product Types', field: 'reference', sortable: true, filter: 'agTextColumnFilter' ,width:150},
      { headerName: 'Letter Types', field: 'letter_type', sortable: true, filter: 'agTextColumnFilter' },
      { headerName: 'Letter Name', field: 'letter_name', sortable: true, filter: 'agTextColumnFilter' },
      { headerName: 'Description', field: 'description', sortable: true, filter: 'agTextColumnFilter' },
      {
        headerName: "Actions",
        suppressMenu: true,
        suppressSorting: false,
        width:120,
        template: `<i class="fa fa-pencil-square-o" style="cursor: pointer;" aria-hidden="true" data-action-type="Edit"></i>
        &nbsp;&nbsp;<i class="fa fa-trash" style="cursor: pointer;" aria-hidden="true" data-action-type="Delete"></i> `
      }
    ];
  }

  /**
* Initialize Term Codes List data
*/
  initializeLetterNamesListData() {
    let url = '/letter_names';
    this._letterNamesService.getDetails(url).subscribe(res => {
      this.isDataLoaded = true;
      this.rowData = res.letter_names;
      this._message.showLoader(false);
    }, error => {
      this.isDataLoaded = false;
      this._message.showLoader(false);
    });
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
        case "Edit":
          this.namingOfTab = this.EDIT_HEADING_STRING;
          return this.editButtonClick(data);
        case "Delete":
          return this.onDeleteButtonClick();
      }
    }
  };

  /**
  * Edit button click method
  * @param data 
  */
  public editButtonClick(data: any) {
    let selectedRowArray = this.getSelectedRows();
    if (selectedRowArray.length > 0) {
      const selectedRowIDS = selectedRowArray.map(node => node.id).join(',');
      //this._message.showLoader(true);
      this._router.navigateByUrl(this._router.url + "/" + selectedRowIDS);
    }
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

  addLetterNames() {
    this._router.navigateByUrl(this._router.url + "/add");
  }

  /**
  * Final delete selected rows
  * @param idsToBeDeleted
  */
  deleteSelectedRows(idsToBeDeleted: any) {
    this._message.showLoader(true);
    let url = '/letter_names/' + idsToBeDeleted
    this._letterNamesService.deleteLetterName(url).subscribe(deleteResponse => {
      if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
        this._helper.showApiMessages(CyncConstants.DELETE_MESSAGE, 'success');
        this.initializeLetterNamesListData();
      } else {
        this._message.showLoader(false);
      }
    }, error => {
      this.initializeLetterNamesListData();
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

  // /**
  // * Change status type dropdown event
  // * @param value 
  // */
  // changeStatusType(value: string) {
  //   this._message.showLoader(true);
  //   this.initializeLetterNamesListData();
  // }

  // /**
  // * Reload grid data
  // */
  // reloadGrid() {
  //   this._message.showLoader(true);
  //   this.initializeLetterNamesListData();
  // }

  // 	/**
  // * Select Tab event
  // * @param tabId 
  // */
  // selectTab(tabId: number) {
  //   this.isNew = true;
  //   this.namingOfTab = this.ADD_NEW_HEADING_STRING;
  //   setTimeout(() => {
  //     this.staticTabs.tabs[tabId].active = true;
  //   }, 100);
  // };

}
