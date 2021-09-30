import { Component, OnInit } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MappingDropDownComponent } from './mapping-drop-down/mapping-drop-down.component';
import { ClientParameterService } from '../service/client-parameter.service';
import { Helper } from '@cyncCommon/utils/helper';
import * as moment from 'moment';
import { FileClassficationDropdownComponent } from './file-classfication-dropdown/file-classfication-dropdown.component';
import { CollateralDropDownComponent } from './collateral-drop-down/collateral-drop-down.component';
import { FrequencyDropdownComponent } from './frequency-dropdown/frequency-dropdown.component';
import { JsonPipe } from '@angular/common';
import { TemplateBindingParseResult } from '@angular/compiler';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
  selector: 'app-bbc-files-required',
  templateUrl: './bbc-files-required.component.html',
  styleUrls: ['./bbc-files-required.component.scss']
})
export class BbcFilesRequiredComponent implements OnInit {

  bbcFilesRequiredRowData: any;
  bbcFilesRequiredColdef: any;
  bbcFilesRequiredGridOptions: GridOptions;
  bbcFilesRequiredDefaultColDef: any;
  bbcFileRequiredGridApi: any;
  bbcFileRequiredGridColumnApi: any;
  divisonData: any;
  bbcFileRequiredData: any;
  divisionId: any;
  showDivision: boolean;
  mappingId: any;
  frequency: any;
  fileClassificationId: any;
  collateralId: any;
  mappingIdBasedData:any
  selectedvalue:any;
  excelStyles:any;
  updateRowData: boolean = true;
  clientId:any

  constructor(private _apiMapper: APIMapper,
    private clientParameterService: ClientParameterService,
    private clientSelectSrv: ClientSelectionService,
    private helper: Helper) {
    this.bbcFilesRequiredRowData = [];
    this.bbcFilesRequiredColdef = [
      {
        headerName: '',
        width:40,
         headerCheckboxSelection: true,
        checkboxSelection:true,
        filter:false
      },
      {
        headerName: 'Mapping Group',
        editable: false,
        field: 'mapping_id',
        filter: 'agTextColumnFilter',
       width:200,
        sortable: true,
        
        cellStyle: { 'width':'200px' },
        cellClass: "exportColumnClass",
        cellRendererFramework: CollateralDropDownComponent,
        filterParams: {
          textFormatter: (val) => val,
        },
        
      }, {
        headerName: 'Mapping Name',
        editable: false,
        field: 'mapping_name',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass",

      }, {
        headerName: 'Description',
        editable: true,
        field: 'source_documents_name',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass"
      }, {
        headerName: 'Collateral Name',
        editable: false,
        field: 'data_type',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass"
      }, {
        headerName: 'Select Collateral From',
        editable: true,
        field: 'select_collateral_from',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass",
        cellRendererFramework: MappingDropDownComponent
      }, {
        headerName: 'File Format',
        field: 'file_format',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        editable: false,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass"
      }, {
        headerName: 'Frequency',
        editable: true,
        field: 'frequency',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass",
        cellRendererFramework: FrequencyDropdownComponent
      }, {
        headerName: 'File Classification',
        field: 'file_classification_id',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        editable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass",
        cellRendererFramework: FileClassficationDropdownComponent
      }, {
        headerName: 'Last BBC Date',
        editable: false,
        field: 'last_date',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
        valueFormatter: this.dateFormatter,
        filterParams: {
          comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = moment(cellValue).format('DD/MM/YYYY');
            var dateParts = dateAsString.split("/");
            var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
              return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        },

      }, {
        headerName: 'Next BBC Date',
        editable: false,
        field: 'next_date',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        valueFormatter: this.dateFormatter,
        filterParams: {
          comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = moment(cellValue).format('DD/MM/YYYY');
            var dateParts = dateAsString.split("/");
            var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
              return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        },
        cellClass: "exportColumnClass"
      }, {
        headerName: 'Days To Receipt',
        editable: true,
        field: 'days_to_receipt',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass"
      }, {
        headerName: 'Notification Days',
        editable: true,
        field: 'notification_days',
        filter: 'agTextColumnFilter',
        width: 200,
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
        },
        cellClass: "exportColumnClass"
      }
    ]
    this.bbcFilesRequiredGridOptions = {
      rowData: this.bbcFilesRequiredRowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true
    }
    this.bbcFilesRequiredDefaultColDef = {
      filter: true,
      agSetColumnFilter: true,
      suppressCellSelection: true,
      suppressRowClickSelection: true,
      resizable: true,
       rowSelection: 'multiple',
    }
    this.clientId = CyncConstants.getSelectedClient();
    this.helper.getClientID().subscribe((d) => this.clientId = d);
  }

  ngOnInit() {
    this.helper.getClientID().subscribe((data) => {
      let cltid = data;
      if(cltid!=='null'){
        this.clientId = data;
        this.afterBorrowChangeLoad();
      }
    });
    if(this.clientId !== undefined){
       this.afterBorrowChangeLoad();
    }
  
  }

afterBorrowChangeLoad(){
  this.getDivisionData();
  this.getBbcFileRequiredData();
  this.excelStyles = this.setGridExportStyle();
}
  getBbcFileRequiredData() {
    let url = this._apiMapper.endpoints[CyncConstants.GET_BBC_FILE_REQUIRED].replace('{client_Id}', this.clientId);
    this.clientParameterService.getBbcFileRequiredService(url).subscribe(response => {
      this.bbcFileRequiredData = JSON.parse(response._body).addendums;
      this.bbcFilesRequiredRowData = this.bbcFileRequiredData;

    });
  }

  /**
   * This method add new row in apbucket aging
   */
  bbcFileRequiredAddNew() {
    this.updateRowData = false;
    const newItem = this.bbcFileRequiredAddNewRowData();
    this.bbcFilesRequiredGridOptions.api.updateRowData({ add: [newItem] });
    this.bbcFilesRequiredRowData.push(newItem);
  }

  // apBucket aging New Row Data
  bbcFileRequiredAddNewRowData(): any {
    const newRow = {
      mapping_id: '',
      borrower_id: '',
      division_code_id: '',
      file_classification_id: '',
      data_type: '',
      file_format: '',
      source_documents_name: '',
      select_collateral_from: '',
      frequency: '',
      days_to_receipt: '',
      notification_days: '',
      last_date: '',
      next_date: ''
    }
    return newRow;
  }


  /**
  * onGridReady
  * @param params 
  */
  bbcFileRequiredOnGridReady(params: any) {
    this.bbcFileRequiredGridApi = params.api;
    this.bbcFileRequiredGridColumnApi = params.columnApi;
    // this.bbcFilesRequiredGridOptions.api.sizeColumnsToFit();
  }

  onSaveclick() {
    this.bbcFileRequiredGridApi.stopEditing();
    this.bbcFileRequiredGridApi.stopEditing();
    let requestBody = {
      addendums : [{

        borrower_id: '',
        division_code_id: '',
        file_classification_id: '',
        mapping_id: '',
        data_type: '',
        file_format: '',
        source_documents_name: '',
        select_collateral_from: '',
        frequency: '',
        days_to_receipt: '',
        notification_days: '',
        last_date: '',
        next_date: ''
      }]
    }
    let dataObject;
    let arBucketRowData = [];
    // ar bucket aging Save data
    this.bbcFilesRequiredGridOptions.api.forEachNode(nodeData => {
      arBucketRowData.push(nodeData.data);
    });
        if (arBucketRowData.length > 0) {
      if (arBucketRowData[arBucketRowData.length - 1].hasOwnProperty("id")) {
        arBucketRowData.forEach(elm => {
          
    
          dataObject = {
            borrower_id: this.clientId,
            division_code_id: this.divisionId,
            file_classification_id: this.fileClassificationId,
            mapping_id: this.mappingId,
            data_type: elm.data_type,
            file_format: elm.file_format,
            source_documents_name: elm.source_documents_name,
            select_collateral_from: this.collateralId,
            frequency: this.frequency,
            days_to_receipt: elm.days_to_receipt,
            notification_days: elm.notification_days,
            last_date: elm.last_date,
            next_date: elm.next_date,
            id: elm.id
           };
          
        });

    // requestBody.addendum["division_code_id"] = this.divisionId
   
    requestBody.addendums = arBucketRowData;
    let url = this._apiMapper.endpoints[CyncConstants.UPDATE_BBC_FILE_DATA].replace('{client_Id}', this.clientId);
    this.clientParameterService.updateBBCData(url, requestBody).subscribe(res => {
      const message = 'updated successfully'
      this.helper.showApiMessages(message, 'success');
      this.getBbcFileRequiredData();
    });
      } else {
      
        arBucketRowData.forEach((elm, index) => {
          dataObject = {
            borrower_id: this.clientId,
            division_code_id: this.divisionId,
            file_classification_id: this.fileClassificationId,
            mapping_id: this.mappingId,
            data_type: elm.data_type,
            file_format: elm.file_format,
            source_documents_name: elm.source_documents_name,
            select_collateral_from: this.collateralId,
            frequency: this.frequency,
            days_to_receipt: elm.days_to_receipt,
            notification_days: elm.notification_days,
            last_date: elm.last_date,
            next_date: elm.next_datearBucketRowData
          };
          
        });
        let newRowData = arBucketRowData.filter(elm =>{
          if(! elm.hasOwnProperty("id")){
            return elm;
           }
         });
         console.log("newRowData",newRowData)
    // requestBody.addendum["division_code_id"] = this.divisionId
    requestBody.addendums = newRowData;
    // console.log("body", requestBody)
    let url = this._apiMapper.endpoints[CyncConstants.SAVE_BBC_FILE_REQUIRED_DATA].replace('{client_Id}', this.clientId);
    this.clientParameterService.addNewRecordService(url, requestBody).subscribe(res => {
      const message = 'saved successfully'
      this.helper.showApiMessages(message, 'success');
      this.getBbcFileRequiredData();
      this.updateRowData = true;
    });
  }
  }


  }
 /*format activity date
*/
  dateFormatter(params: any) {
    if(params.value !== null)
    return moment(params.value).format('MM/DD/YYYY');
  }

  getDivisionData() {
    let url = this._apiMapper.endpoints[CyncConstants.GET_BBC_DDIVISION_DATA].replace('{client_Id}', this.clientId)
    this.clientParameterService.getBbcFileRequiredService(url).subscribe(res => {
      this.divisonData = JSON.parse(res._body).division;
      if (this.divisonData.length === 1) {
        $("#showDivision").css("display", "none");
      } else {
        $("#showDivision").css("display", "inline-block");
      }
    });
  }

  onChangeDivision(event) {
    this.divisionId = event.target.value;
    if (this.divisionId === 'all') {
      this.bbcFilesRequiredRowData = this.bbcFileRequiredData;
    } else {
      let url = this._apiMapper.endpoints[CyncConstants.LOAD_DIVISION_BASED_DATA].replace('{client_Id}', this.clientId).replace('{division_id}', this.divisionId);
      this.clientParameterService.getBbcFileRequiredService(url).subscribe(res => {
        this.bbcFilesRequiredRowData = JSON.parse(res._body).addendums;
      });
    }
  }
  onCancelClick() {
    this.getBbcFileRequiredData();
  }

  deleteBBCFilegData() {
    const popupParams = { 'title': 'Confirmation', message: 'Are you sure you want to delete?' }
    this.helper.openConfirmPopup(popupParams).subscribe(result => {
      if (result === true) {
        let ids = [];
        let deleteRows = this.bbcFilesRequiredGridOptions.api.getSelectedRows();
        deleteRows.forEach(element => {
          ids.push(element.id)
        });
        const url = this._apiMapper.endpoints[CyncConstants.DELETE_BBC_FILE_DATA].replace('{client_Id}', this.clientId).replace('{ids}', ids);
        this.clientParameterService.deleteBbcService(url).subscribe(response => {
          const message = 'Deleted Successfully';
          this.helper.showApiMessages(message, 'success');
          this.getBbcFileRequiredData();
        });
      }

    });
  }
  
  onCellSelected(event) {
  
   if(event.column.getColId() === 'mapping_Id'){
    this.clientParameterService.setMappingBasedData(true);
   } else {
    this.clientParameterService.setMappingBasedData(false);
   }
   }

   onChangeMappingGroup(data:any){
     let tempData = data.rowdata; 
     tempData.mapping_name =  data.mapData.mapping_name;
     tempData.data_type =  data.mapData.balance_name;
     tempData.frequency = data.mapData.borrower_bbc_frequency;
     tempData.file_format = data.mapData.file_format;
     tempData.mapping_id = data.mappingId;
   
     let rowNode = this.bbcFileRequiredGridApi.getRowNode(data.index)
     rowNode.setData(tempData)
  }

  onChangeCollateral(data:any){
    let rowNode = this.bbcFileRequiredGridApi.getRowNode(data.index)
    rowNode.setDataValue('select_collateral_from', data.collateralId)
  }
    
  onChangeFrequency(data:any){
    let rowNode = this.bbcFileRequiredGridApi.getRowNode(data.index)
    rowNode.setDataValue('frequency', data.frequencyId);
  }  

  onChangeFileClassification(data:any){
    let rowNode = this.bbcFileRequiredGridApi.getRowNode(data.index)
    rowNode.setDataValue('file_classification_id', data.fileClassificationId);
  }

  /**
   *  Export excel
   */
  exportData() {
    let gridHeaderKeys = [];
    this.bbcFileRequiredGridColumnApi.getAllDisplayedColumns().forEach((e, i) => {
      if (e.colId != undefined) {
        gridHeaderKeys.push(e.colId);
      }
      
      
    
    });
    
    gridHeaderKeys.splice(0,1);
    let params = {
      columnKeys: gridHeaderKeys,
      fileName: 'Bbc-Required-file',
      rowHeight: 15,
      headerRowHeight: 20,
      sheetName: 'Bbc-Required-file',
      customHeader: [
        [{
          styleId: "excelHeader",
          data: {
            type: "String",
            value: "Bbc-Required-file report"
          },
          mergeAcross: gridHeaderKeys.length - 1
        }]
      ]
    };

    if (gridHeaderKeys.length > 0) {
      this.bbcFileRequiredGridApi.exportDataAsExcel(params);
    } else {
      this.helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
    }
  }
  
  
  // GridStyle for Export xls 
 setGridExportStyle(): any {
    let excelStyles = [
     
      {
        id: "exportColumnClass",
        alignment: { horizontal: "Left" },
        borders: {
          borderBottom: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderLeft: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderRight: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderTop: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          }
        },
        font: {
          fontName: "Calibri Light",
          color: "#000",
          size: 10,
          bold: false
        }
      },
      {
        id: "header",
        interior: {
          color: "#D9E5F6",
          pattern: "Solid"
        },
        borders: {
          borderBottom: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderLeft: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderRight: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderTop: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          }
        },
        font: {
          fontName: "Calibri Light",
          color: "#000",
          size: 11,
          bold: true
        }
      },
     
      {
        id: "clientId",
        alignment: { horizontal: "Left" },
        borders: {
          borderBottom: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderLeft: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderRight: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderTop: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          }
        },
        font: {
          fontName: "Calibri Light",
          color: "#000",
          size: 10,
          bold: false
        }
      },
      {
        id: "exportDateFormat",
        dataType: "dateTime",
        numberFormat: { format: "mm/dd/yyyy" },
        alignment: { horizontal: "Left" },
        borders: {
          borderBottom: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderLeft: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderRight: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          },
          borderTop: {
            color: "#000",
            lineStyle: "Continuous",
            weight: 1
          }
        },
        font: {
          fontName: "Calibri Light",
          color: "#000",
          size: 10,
          bold: false
        }
      },
    ];
    return excelStyles;
  }

}