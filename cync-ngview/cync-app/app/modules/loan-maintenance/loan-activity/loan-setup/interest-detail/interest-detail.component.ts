import { Component, OnInit, Inject } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment-timezone';
import { Helper } from '@cyncCommon/utils/helper';
import { LoanSetupService } from '../service/loan-setup.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateRendererComponent } from '../date-renderer/date-renderer.component';
import { CellvalueComponent } from '../cellvalue/cellvalue.component';
import { MessageServices } from '@cyncCommon/component/message/message.component';


@Component({
    selector: 'app-interest-detail',
    templateUrl: './interest-detail.component.html',
    styleUrls: ['./interest-detail.component.scss']
})
export class InterestDetailComponent implements OnInit {

    interestDetailsRowData: any;
    interestDetailscolumnDefs: any;
    interestDetailsGridApi: any;
    interestDetailsGridParams: any;
    interestDetailsGridOptions: GridOptions;
    interestDetailsGridColumnApi: any;

    interestDetailResponse: any[];
    loanTypeChangeValue: any;
    loanId: any;
    clientId: any;
    selectedRows: any = [];
    interestDetailId: number = 0;
    disableAddButton: any = true;
    rateAdjustmentID: any;
    defaultColDef: any;

    constructor(
        public dialogRef: MatDialogRef<InterestDetailComponent>,
        public helper: Helper,
        private loanSetupService: LoanSetupService,
        private _apiMapper: APIMapper,
        private message: MessageServices,
        @Inject(MAT_DIALOG_DATA) public data) {

        this.loanTypeChangeValue = this.data.loan_type;
        this.loanId = this.data.load_id;

        this.interestDetailsGridOptions = {
            columnDefs: this.interestDetailscolumnDefs,
            enableBrowserTooltips: true,
            context: {
                componentCheck: this
            }
        }

        this.interestDetailscolumnDefs = [
            
            {
                headerName: 'Effective Date',
                width: 300,
                cellStyle: {  textAlign: 'center', border: "1px solid #A9A9A9", padding: '2px'},
                suppressSizeToFit: true,
                field: 'effective_date',
                filter: 'agDateColumnFilter',
                cellClass: "dateFormat",
                sortable: true,
                valueFormatter: this.dateFormatter,
                checkboxSelection: true,
                cellRendererFramework: DateRendererComponent,
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
                headerName: "Value",
                width: 300,
                cellStyle: { textAlign: 'center', border: "1px solid #A9A9A9", padding: '2px' },
                field: "value",
                filter: 'agTextColumnFilter',
                cellRendererFramework: CellvalueComponent
            }
        ];

        this.defaultColDef = {
            sortable: true,
        };

        // Get the seleccted Client ID
        this.helper.getClientID().subscribe((data) => {
            if (data != null && data != undefined) {
                this.clientId = data;
            }
        });

    }
    
    ngOnInit() {
        if (this.loanTypeChangeValue === 'ABL') {
            this.getInterestDetailAblGridData();
            this.getAblTableData();
        } else {
            this.getInterestDetailMclGridData();
            this.getMclTableData();
        }
    }


    basedOnValueChanged(params: any) {
        let currentNode = params.node.setSelected(true);
    }

    onValueChanged(params: any) {
        let currentNode = params.node.setSelected(true);
    }

    /**
    * on row selected
    *
    */
    onInterestDetailsRowSelected(event: any) {
        this.selectedRows = this.interestDetailsGridOptions.api.getSelectedRows();
        $("i#save, i#delete").removeClass("icon_disabled operation_disabled");
    }

    onGridReady(params: any) {
        this.interestDetailsGridParams = params;
        this.interestDetailsGridApi = params.api;
        this.interestDetailsGridColumnApi = params.columnApi;
    }

    // arBucket aging New Row Data
    addNewRowData(): any {
        this.disableAddButton = false;
        this.interestDetailId++;
        const newRow = {
            id: '',
            effective_date: moment(new Date()).format('MM/DD/YYYY'),
            value: '0.00',
            interestId: this.interestDetailId,
            is_ar_new: true
        };
        return newRow;
    }

    /**
     * This method add new row 
     */
    onClickAddNew() {
        const newItem = this.addNewRowData();
        this.interestDetailsGridApi.updateRowData({ add: [newItem] });
    }

    /**
     * This method delete the rows of interest detail
     * 
     */
    onClickDelete() {
        const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to delete?' }
        this.helper.openConfirmPopup(popupParams).subscribe(result => {
            if (result == true) {
                for (let eachobject of this.selectedRows) {
                    if (eachobject.hasOwnProperty('is_ar_new') === false) {
                        // let ids = [];
                        // let deleteRows = this.interestDetailsGridOptions.api.getSelectedRows();
                        // deleteRows.forEach(element => {
                        //     ids.push(element.id)
                        // });
                        if (this.loanTypeChangeValue === 'ABL') {
                            const url = this._apiMapper.endpoints[CyncConstants.DETAIL_INTEREST_DETAIL_ABL_DATA].
                                replace('{clientId}', this.clientId).replace('{rate_adjustment_id}', eachobject.id);
                                this.loanSetupService.deleteAblInterestDetailService(url).subscribe(response => {
                                const message = 'Rate Adjustment deleted successfully';
                                this.helper.showApiMessages(message, 'success');
                                this.getInterestDetailAblGridData();
                                this.getAblTableData();
                                this.interestDetailsGridOptions.api.refreshCells();
                            });
                        } else {

                            const url = this._apiMapper.endpoints[CyncConstants.DETAIL_INTEREST_DETAIL_MCL_DATA].
                                replace('{loanId}', this.loanId).replace('{rate_adjustment_id}',  eachobject.id);
                            this.loanSetupService.deleteMclInterestDetailService(url).subscribe(response => {
                                const message = 'Rate Adjustment deleted successfully';
                                this.helper.showApiMessages(message, 'success');
                                this.getInterestDetailMclGridData();
                                this.getMclTableData();
                                this.interestDetailsGridOptions.api.refreshCells();
                            });

                        }
                    }
                    else {
                        const selectedRow = this.interestDetailsGridApi.getSelectedRows();
                        this.interestDetailsGridApi.updateRowData({ remove: selectedRow });
                        const message = 'Rate Adjustment deleted successfully';
                        this.helper.showApiMessages(message, 'success');
                    }
                }
            }
        });
        this.disableAddButton = true;
    }

    /**
     * This method reset the rows of ARbucket aging
     */
    onClickCancel() {

        if (this.loanTypeChangeValue === 'ABL') {
            let url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_DETAIL_ABL_GRID_DATA].replace('{clientId}', this.clientId);
            this.loanSetupService.getInterestDetailAblData(url).subscribe(response => {
                let rawData = <any>JSON.parse(response._body);
                this.interestDetailsRowData = rawData.rate_adjustments;
            });
            this.interestDetailsRowData = [];
        } else {
            let url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_DETAIL_MCL_GRID_DATA].replace('{loanId}', this.loanId);
            this.loanSetupService.getInterestDetailMclData(url).subscribe(response => {
                let rawData = <any>JSON.parse(response._body);
                this.interestDetailsRowData = rawData.rate_adjustments;
            });
            this.interestDetailsRowData = [];
        }
        this.disableAddButton = true;
    }

    onClickSave() {
        this.interestDetailsGridApi.stopEditing();
        // body Object
        var requestBody = {
            rate_adjustment: {
                effective_date: '',
                value: ''
            }
        };

        for (let eachobject of this.selectedRows) {

            // update method  
            if (eachobject.hasOwnProperty('is_ar_new') === false) {
                let selectedRows = this.interestDetailsGridOptions.api.getSelectedRows();
                this.rateAdjustmentID = selectedRows[0].id;
                selectedRows.forEach((elm, index) => {                  
                        let dataObject = {
                            rate_adjustment: {
                                effective_date: elm.effective_date==="" ? '' : moment(elm.effective_date).format("MM/DD/YYYY"),
                                value: elm.value
                            }
                        };
                        requestBody = dataObject;
                });

               
                if (this.loanTypeChangeValue === 'ABL') {
                    let url = `borrowers/${this.clientId}/rate_adjustments/${this.rateAdjustmentID}`;
                    this.loanSetupService.updateInterestDetailAblService(url, requestBody).subscribe(response => {

                        if (response.status === 204) {
                            const message = 'Rate Adjustment was successfully updated';
                            this.helper.showApiMessages(message, 'success');
                            this.getInterestDetailAblGridData();
                            this.getAblTableData();
                            $("i#save, i#delete").addClass(" icon_disabled operation_disabled");
                        }
                    }, (error) => {
                        let tempErrorResponse=JSON.parse(error._body);
                        this.message.cync_notify("error", `${tempErrorResponse.error}`, 3000);

                    });
                } else {
                    let url = `loan_numbers/${this.loanId}/rate_adjustments/${this.rateAdjustmentID}`;
                    this.loanSetupService.updateInterestDetailMclService(url, requestBody).subscribe(response => {
                        if (response.status === 200) {
                            const message = 'Rate Adjustment was successfully updated';
                            this.helper.showApiMessages(message, 'success');
                            this.getInterestDetailMclGridData();
                            this.getMclTableData();
                            $("i#save, i#delete").addClass(" icon_disabled operation_disabled");
                        }
                    }, (error) => {
                        let tempErrorResponse=JSON.parse(error._body);
                        this.message.cync_notify("error", `${tempErrorResponse.error}`, 3000);
                       
                    });
                }
            }

            // save method 
            else {

                let selectedRows = this.interestDetailsGridOptions.api.getSelectedRows();
                this.rateAdjustmentID = selectedRows[0].id;

                selectedRows.forEach((elm, index) => {
                    let dataObject = {
                        rate_adjustment: {
                            effective_date: elm.effective_date==="" ? '': moment(elm.effective_date).format("MM/DD/YYYY"),
                            value: elm.value
                        }
                    };
                    requestBody = dataObject;
                });

                if(Number(requestBody.rate_adjustment.value) < 0 ){
                    let message = 'Value must be greater than or equal to 0';
                   // this.helper.showApiMessages(message, 'error');
                    this.message.cync_notify("error", `${message}`, 3000);

                }else {

                if (this.loanTypeChangeValue === 'ABL') {
                    let url = `borrowers/${this.clientId}/rate_adjustments`;
                    this.loanSetupService.saveInterestDetailAblService(url, requestBody).subscribe(response => {
                        if (response.status === 201) {
                            const message = 'Rate Adjustment was successfully created';
                            this.helper.showApiMessages(message, 'success');
                            this.getInterestDetailAblGridData();
                            this.getAblTableData();
                            $("i#save, i#delete").addClass(" icon_disabled operation_disabled");
                        }
                    }, (error) => {
                        let tempErrorResponse=JSON.parse(error._body);
                        this.message.cync_notify("error", `${tempErrorResponse.error}`, 3000);
                    });
                } else {
                    let url = `loan_numbers/${this.loanId}/rate_adjustments`;
                    this.loanSetupService.saveInterestDetailMclService(url, requestBody).subscribe(response => {
                        if (response.status === 200) {
                            const message = 'Rate Adjustment was successfully created';
                            this.helper.showApiMessages(message, 'success');
                            this.getInterestDetailMclGridData();
                            this.getMclTableData();
                            $("i#save, i#delete").addClass("icon_disabled operation_disabled");
                        }
                    }, (error) => {
                        let tempErrorResponse=JSON.parse(error._body);
                        this.message.cync_notify("error", `${tempErrorResponse.error}`, 3000);
                    });
                }

             }   
                
            }
        }
        this.disableAddButton = true;
    }

    onCellValueChanged(params) {
        params.data.edited = true;
    }

    /**
     * this method is used to get data of interest detail grid data for abl loan
     */
    getInterestDetailAblGridData() {
        let url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_DETAIL_ABL_GRID_DATA].replace('{clientId}', this.clientId);
        this.loanSetupService.getInterestDetailAblData(url).subscribe(response => {
            let rawData = <any>JSON.parse(response._body);
            this.interestDetailsRowData = rawData.rate_adjustments;
        });
    }

    /**
    * this method is used to get data of interest detail grid data for mcl loan
    */
    getInterestDetailMclGridData() {
        const url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_DETAIL_MCL_GRID_DATA].replace('{loanId}', this.loanId);
        this.loanSetupService.getInterestDetailMclData(url).subscribe(response => {
            let rawData = <any>JSON.parse(response._body);
            this.interestDetailsRowData = rawData.rate_adjustments;
        });
    }

    /**
    * this method is used to get data of interest detail table data for abl loan
    */
    getAblTableData() {
        const url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_DETAIL_ABL_TABLE_DATA].replace('{clientId}', this.clientId);
        this.loanSetupService.getInterestDetailAblTableData(url).subscribe(response => {
            let intrestData = <any>JSON.parse(response._body);
            this.interestDetailResponse = intrestData.rate_with_interest;
        });
    }

    /**
    * this method is used to get data of interest detail table data for mcl loan
    */
    getMclTableData() {
        const url = this._apiMapper.endpoints[CyncConstants.GET_INTEREST_DETAIL_MCL_TABLE_DATA].replace('{loanId}', this.loanId);
        this.loanSetupService.getInterestDetailMclTableData(url).subscribe(response => {
            let intrestData = <any>JSON.parse(response._body);
            this.interestDetailResponse = intrestData.rate_with_interest;
        });
    }

    closeModal() {
        this.dialogRef.close();
    }

    dateFormatter(params: any) {
        return moment(params.value).format('MM/DD/YYYY');
    }

    decimalFormateNumber( num:  any): string {
        let result = this.helper.CurrencyCellRendererRoundOff( Number(num));
        return result;
    }
}
