import { Component, OnInit, Inject } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FactoringFeeSetupService } from '../../../service/factoring-fee-setup.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import * as moment from 'moment';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit {
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  gridOptions: GridOptions;
  gridApi:GridApi;
  gridColumnApi: any;
  borrowerId:any;
  frameworkComponents: any;
  constructor(  private feeSetupService: FactoringFeeSetupService,
    private apiMapper: APIMapper,
    private helper: Helper,
    public dialogRef: MatDialogRef<ViewHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 


    this.columnDefs = [
      {
        headerName: 'Fee Status',
        field: 'status',
        filter: 'agTextColumnFilter',
       sortable: true
      },
      {
        headerName: 'Name',
        field: 'name',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Spread %',
        field: 'interest_rate',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        comparator: this.customSort,
      },
      {
        headerName: 'Effective Date',
        field: 'effective_date',
        filter: 'agDateColumnFilter',
        sortable: true,
        floatingFilterComponent: 'agDateInput',
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
        }
      },
      {
        headerName: 'Modified By',
        field: 'modifier_name',
        filter: 'agTextColumnFilter',
        sortable: true
      }
    ]

    this.defaultColDef = {
      filter: true,
      floatingFilter: true,
      resizable: true,
      sortable: true,
      flex: 1
    };

    this.gridOptions = {
      rowData: this.rowData
    };

    this.frameworkComponents = { agDateInput: CustomDatePickerComponent };

  }
  ngOnInit() {

  console.log("FeeID::", this.dialogRef.componentInstance.data.feeID);

  this.getHistoryDetail(this.dialogRef.componentInstance.data.feeID);

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  getHistoryDetail(feeid:any){
    this.borrowerId = CyncConstants.getSelectedClient();
    let url = this.apiMapper.endpoints[CyncConstants.GET_HISTORY_TABLE_DATA].replace('{borrower_id}', this.borrowerId).replace('{fee_id}', feeid);
    
    this.feeSetupService.getHistoryDataService(url).subscribe(response => {
        let temp = <any>JSON.parse(response._body).fee_histories;
      //  let data =  temp.map(ele =>{
      //     ele.interest_rate = Number(ele.interest_rate);
      //     return ele;
      //   });
        this.rowData = temp;
    });
   }


   
  onCloseClick(){
   this.dialogRef.close();
  }
 
 dateFormatter(params: any) {
  return moment(params.value).format('MM/DD/YYYY');
}
    /**
   * # Number Sorting Methods customSort
   * @param valueA 
   * @param valueB 
   */
  customSort(valueA, valueB) {
    var firstNumber = Number(valueA);
    var secondNumber = Number(valueB);
    if (firstNumber === null && secondNumber === null) {
      return 0;
    }
    if (firstNumber === null) {
      return -1;
    }
    if (secondNumber === null) {
      return 1;
    }
    return firstNumber - secondNumber;

  }
}
