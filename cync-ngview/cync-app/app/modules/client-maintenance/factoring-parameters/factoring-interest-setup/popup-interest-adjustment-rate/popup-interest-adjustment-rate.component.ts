import { Component, Inject, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { FactoringInterestSetupService } from '../service/factoring-interest-setup.service';
@Component({
    selector: 'app-popup-interest-adjustment-rate',
    templateUrl: './popup-interest-adjustment-rate.component.html',
    styleUrls: ['./popup-interest-adjustment-rate.component.scss']
})
export class PopupInterestAdjustmentRateComponent implements OnInit {

    adjustmentRateGridOptions: GridOptions;
    cyncColumnDefs: any;
    AdjustmentRateService: any;
    cyncRowData: any;

    cyncRowDataHistory: any;
    // cyncColumnDefsHistory: any;

    gridApi: any;
    gridColumnApi: any;
    showSpinner: boolean;
    isDataLoaded: boolean;
    selectedRows: any;
    defaultColDef: any;
    disableAddButton: boolean;

    clientId: number;
    interestRateCodeId: number;
    adjustmentId: number;
    adjustmentRate: any;
    effectiveDate: any;
    rateCodeName: string;
    @ViewChild("addPanel") addPanel: ElementRef;

    constructor(
        private interestService: FactoringInterestSetupService,
        private _message: MessageServices,
        private helper: Helper,
        private renderer: Renderer2,
        public dialogRef: MatDialogRef<PopupInterestAdjustmentRateComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.clientId = this.data.client_id;
        this.interestRateCodeId = this.data.selected_rate_code.id;
        this.rateCodeName = this.data.selected_rate_code.rate_code;

        this.cyncColumnDefs = [
            {
                headerName: 'Adjustment Effective Date',
                field: 'adjustment_effective_date',
                width: 230,
                headerCheckboxSelection: false,
                valueFormatter: this.dateFormatter,
                checkboxSelection: false,
                headerCheckboxSelectionFilteredOnly: true,
                editable: false,
                cellEditor: 'cyncDatePicker',
                cellStyle: { 'text-align': 'left' },
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
                headerName: 'Rate Adjustment',
                field: 'adjustment_rate',
                width: 230,
                valueFormatter: this.helper.currencyFormateSixDecimal,
                cellStyle: { 'text-align': 'right' },
                resizable: true,
                editable: false
            }
        ];

        this.defaultColDef = {
            sortable: true,
        };

        this.adjustmentRateGridOptions = <GridOptions>{
            editType: "fullRow",
            rowData: this.cyncRowData,
            columnDefs: this.cyncColumnDefs,
            defaultColDef: this.defaultColDef,
            components: {
                cyncDatePicker: this.cynDatePickerComponent()
            },
            onCellEditingStarted: (event) => {
                console.log('start cell Editing');
            },
            onCellEditingStopped: (event) => {
                console.log(this);
                this.editAdjustmentRate(event);
            }
        };

        // this.cyncColumnDefsHistory = [
        //     {
        //         headerName: 'Date',
        //         field: 'date',
        //         colType: 'date',
        //         valueFormatter: this.dateFormatter,
        //         cellStyle: { 'text-align': 'left' },
        //         resizable: true
        //     },
        //     {
        //         headerName: 'Interest Code Rate',
        //         field: 'interest_code_rate',
        //         colType: 'currency',
        //         valueFormatter: this.helper.currencyFormateSixDecimal,
        //         cellStyle: { 'text-align': 'right' },
        //         resizable: true
        //     },
        //     {
        //         headerName: 'Rate Adjustment %',
        //         field: 'adjustment_rate',
        //         valueFormatter: this.helper.currencyFormateSixDecimal,
        //         cellStyle: { 'text-align': 'right' },
        //         resizable: true
        //     },
        //     {
        //         headerName: 'Total Interest Rate',
        //         field: 'total_interest_rate',
        //         colType: 'currency',
        //         valueFormatter: this.helper.currencyFormateSixDecimal,
        //         cellStyle: { 'text-align': 'right' },
        //         resizable: true
        //     },
        // ];

    }
    ngOnInit() {
        console.log(`client id: ${this.clientId},  interest code id: ${this.interestRateCodeId} `);
        //this.getHistroyAdjustment();
    }

    getHistroyAdjustment() {
        let url = `/factoring/interest/adjustment-rate/history?rate_code_id=${this.interestRateCodeId}`;
        this.interestService.getService(url).subscribe(resdata => {
            this.cyncRowDataHistory = resdata;
        });
    }

    getAdjustmentRate() {
        let url = `factoring/interest/adjustment-rate?client_id=${this.clientId}`;
        this.interestService.getService(url).subscribe(resdata => {
            console.log("resData::", resdata);
            this.cyncRowData = resdata;
            //this.getHistroyAdjustment();
        });
    };

    editAdjustmentRate(params: any) {
        let id = params.data.adjustment_rate_id;
        if (params.data.adjustment_effective_date === "" || params.data.adjustment_rate === "") {
            this._message.cync_notify("error", `Please fill effective date and Rate Adjusment`, 3000);
        } else if (params.data.adjustment_rate > 100) {
            this._message.cync_notify("error", `Please fill adjument Rate only less then 100 nunber`, 3000);
        } else {
            let model = {
                "adjustment_effective_date": moment(params.data.adjustment_effective_date).format('MM/DD/YYYY'),
                "adjustment_rate": params.data.adjustment_rate
            };
            let url = `factoring/interest/adjustment-rate/edit/${id}`;
            this.interestService.updateService(url, model).subscribe(resdata => {
                const message = 'Interest Adjustment Rate has Successfull update';
                this.helper.showApiMessages(message, 'success');
                this.getAdjustmentRate();
                this.adjustmentRateGridOptions.api.redrawRows();
            }, error => {
                this._message.cync_notify("error", `${error.error.message}`, 3000);
            });
        }

    }

    //cync DatePiker Methods
    cynDatePickerComponent(): any {
        function Datepicker() { }
        Datepicker.prototype.init = function (params: any) {
            this.eInput = document.createElement('input');
            this.eInput.type = 'date';
            this.eInput.value = moment(params.value).format('YYYY-MM-DD');
            this.eInput.classList.add('cync-cell-date-picker-input-style');
            this.eInput.style.height = '100%';
            //$(this.eInput).datepicker({ dateFormat: 'dd/mm/yy' });
        };
        Datepicker.prototype.getGui = function () {
            return this.eInput;
        };
        Datepicker.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        Datepicker.prototype.getValue = function () {
            return this.eInput.value;
        };
        Datepicker.prototype.destroy = function () { };
        Datepicker.prototype.isPopup = function () {
            return false;
        };
        return Datepicker;
    }

    /**
     * This method add new row 
     */
    onClickAddNew() {
        this.addPanel.nativeElement.style.display = 'block';
        let saveAction = document.querySelector("#action_save");
        this.renderer.removeClass(saveAction, 'icon_disabled');
    }
    onDeleteRow() {
        let tempDelEl= document.querySelector("#Delete");
        const popupParam = {
            'title': 'Confirmation',
            message: 'Do you want to delete ?',
            'msgType': 'warning'
        };
        if((!tempDelEl.classList.contains("icon_disabled"))){

            this.helper.openConfirmPopup(popupParam).subscribe(result => {
                if (result) {
                    this._message.showLoader(true);
                    let url = `factoring/interest/adjustment-rate/delete/${this.adjustmentId}`;
                    this.interestService.deleteService(url).subscribe(data => {
                        this.disabledBtn();
                        this.helper.showApiMessages("Interest Adjustment Rate Deleted Successfully", 'success');
                        this.getAdjustmentRate();
                        this._message.showLoader(false);
                    });
                } else {
                    return false;
                }
            });

        } else{
            return false;
        }

    }
    postAdjustmentRate() {
        let saveEl= document.querySelector("#action_save");
        if(!saveEl.classList.contains("icon_disabled")){

            if (!this.effectiveDate || !this.adjustmentRate) {
                this._message.cync_notify("error", `Please fill effective date and Rate Adjusment`, 3000);
            } else if (this.adjustmentRate > -100 && this.adjustmentRate <= 100) {
                this._message.showLoader(true);
                let tempdate = moment(this.effectiveDate).format("MM/DD/YYYY");
                let payloadBody = {
                    "client_id": this.clientId,
                    "interest_rate_code_id": this.interestRateCodeId,
                    "adjustment_effective_date": tempdate,
                    "adjustment_rate": this.adjustmentRate
                };
                let url = `factoring/interest/adjustment-rate/create`;
                this.interestService.postService(url, payloadBody).subscribe(response => {
                    this.addPanel.nativeElement.style.display = 'none';
                    this._message.showLoader(false);
                    const message = 'Interest Adjustment Rate has been successfully updated';
                    this.helper.showApiMessages(message, 'success');
                    this.getAdjustmentRate();
                    this.cleanAddForm();
                }, (error) => {
                    this._message.showLoader(false);
                });
    
            } else {
                this._message.cync_notify("error", `Please fill adjument Rate only less then 100 nunber`, 3000);
            }

        } else{
            return false;
        }
    
    }

    cleanAddForm() {
        this.adjustmentRate = '';
        this.effectiveDate = '';
        this.disabledBtn();
        
    }

    disabledBtn(){
        let saveAction = document.querySelector("#action_save");
        let delElm=document.querySelector("#Delete");
        delElm.classList.add('icon_disabled');
        saveAction.classList.add('icon_disabled');
    }
    /**
   * on row selected
   *
   */
    onAdjustmentRateRowSelected(eventParams: any) {
        this.adjustmentId = eventParams.data.adjustment_rate_id;
        let delElm=document.querySelector("#Delete");
        delElm.classList.remove('icon_disabled');
    }

    cyncGridReady(params: any) {
        this.gridApi = params;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        this.getAdjustmentRate();
        this.adjustmentRateGridOptions.rowData = this.cyncRowData;
    }
    onCellValueChanged(params) {
        params.data.edited = true;
    }

    dateFormatter(params: any) {
        return moment(params.value).format('MM/DD/YYYY');
    }

    closeAddPanel() {
        this.addPanel.nativeElement.style.display = 'none';
        let saveAction = document.querySelector("#action_save");
        saveAction.classList.add('icon_disabled');
        this.cleanAddForm();
    }

    doClosed() {
        this.dialogRef.close();
    }
}