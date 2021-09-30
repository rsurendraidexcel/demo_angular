import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { InterestRateCodesModel, InterestRatesModel } from '../model/interest-rate-codes.model';
import { InterestRateCodesService } from '../service/interest-rate-codes.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { DataTable } from 'primeng/components/datatable/datatable';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { AdvanceSearchPoupService } from '@app/shared/components/advance-search-popup/advance-search-popup.service';
import { OpenPoupService } from '@app/shared/services/open-popups.service';
import { AdvanceSearch, Filters, FilterRules, FiltersModel } from '@app/shared/components/advance-search-popup/advance-search-popup.model';

@Component({
    selector: 'app-list-interest-rate-codes',
    templateUrl: './list-interest-rate-codes.component.html',
    styleUrls: ['./list-interest-rate-codes.component.scss']
})

/**
 * @author Sanjay Gupta
 */

export class ListInterestRateCodesComponent implements OnInit {

    advanceSearchModel: FiltersModel;
    interestRateCodesModel: CustomGridModel;
    interestRatesModel: CustomGridModel;
    coulmnDefinition: ColumnDefinition;
    interestRateCodesResultSet: InterestRateCodesModel[] = [];
    interestRatesResultSet: InterestRatesModel[] = [];
    interestRateLoanTypeList: any = [];

    //Grid Data Variables begin
    isSearchBoxInterestRateCodes: boolean = true;
    isCloseBoxInterestRateCodes: boolean = false;
    isSearchBoxInterestRates: boolean = true;
    isCloseBoxInterestRates: boolean = false;
    searchTermInterestRateCodes: any;
    searchTermInterestRates: any;
    gridData: any = [];
    @ViewChild(DataTable) dataTableComponent: DataTable;
    isAddPermitted: boolean = false;
    dataTableElementId: string = 'intrst_main_contents';
    searchValue: string = '';
    recordCountInterestRateCodes: number = -1;
    recordCountInterestRates: number = -1;
    isEditPermitted: boolean = false;
    isDeletePermitted: boolean = false;
    isExportPermitted: boolean = true;
    selectedRowsInterestRateCodes: any = [];
    selectedRowsInterestRates: any = [];
    toggleEditIconInterestRateCodes: boolean;
    toggleEditIconInterestRates: boolean;
    toggleDeleteIconInterestRateCodes: boolean;
    toggleExportIconInterestRates: boolean;
    toggleDeleteIconInterestRates: boolean;
    toggleReloadIcon: boolean;
    loadCountInterestRateCode = 0;
    loadMoreInterestRateCode = false;
    showCount = 1;
    loadCountInterestRate = 0;
    loadMoreInterestRate = false;
    showCountInterestRate = 1;
    showCountInterestRateCodes = 1;
    isDataLoadingInterestRateCodes: boolean = true;
    isDataLoadingInterestRates: boolean = true;
    recordTotal: number;
    showTotalrecordsInterestRateCodes: number = 0;
    showTotalrecordsInterestRates: number = 0;
    showNotificationMsgPopup: boolean = false;
    notificationMessage: any;
    //Grid Data Variables ends

    isGlobalSearchEnabled: boolean = false;
    searchValues: string = '';
    toogleGlobalSearchBoxSearchIcon: boolean = true; //This is harcoded because initially need to display search icon in global search box.
    toogleGlobalSearchBoxCancelIcon: boolean = false; //This is harcoded because initially no need to display cancel icon in global search box.

    isInterestRateSingleRowSeleted: boolean = false; //Checking condition for interest rates
    selectedInterestRateCodeRowValue: string = ''; //Seleted interest rate code

    //loanType: string = CyncConstants.DefaultLoanType;
    loanType = CyncConstants.getLoanType();
    rowCount: number = CyncConstants.getDefaultRowCount();
    showSpinnerInterestRateCode: boolean = false;
    showSpinnerInterestRate: boolean = false;

    /*Export keys*/
    exportColHeadersArray: any[] = [];
    exportSelectedCheckbox: any[] = [];
    exportDisplayPopup: boolean = false;
    exportDisplayErrorPopup: boolean = false;
    exportHeaderArray: any;
    exportRowArray: any;
    exportPopUpTitle: string = CyncConstants.InterestRateExportTitle;

    interestRateCodeDataTableElementId: string = 'intrst_main_contents';
    interestRateDataTableElementId: string = 'main_ratest_contents'
    isLoanRowSeleted: boolean = true;
    column_width: string = CyncConstants.InterestRateCodeDefaultWidth;
    calendarYearRange: string = '';

    interestRateFilterDate: Date;
    persistAdvanceSearch: any = [];
    constructor(private _message: MessageServices,
        private _apiMapper: APIMapper,
        private _router: Router,
        private _helper: Helper,
        private _advanceSearchPopupService: AdvanceSearchPoupService,
        private _popupService: OpenPoupService,
        private interest_rate_code_service: InterestRateCodesService) {
    }

    ngOnInit() {
        this._message.showLoader(true);
        this.interestRateCodesModel = {
            infiniteScroll: true,
            multiSelection: true,
            onDemandLoad: true,
            singleSelection: false,
            type: 'interest_rate_codes',
            apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_INTERESTRATECODE_LIST], deleteApi: this._apiMapper.endpoints[CyncConstants.DELETE_INTERESTRATECODE], updateApi: this._apiMapper.endpoints[CyncConstants.GET_INTEREST_RATE_CODE_DETAILS] },
            columnDef: [
                { field: 'rate_code', header: 'Rate Code', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'rate_name', header: 'Rate Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'rate_description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'rate_divisor', header: 'Daily Divisor', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'rate_precision', header: 'Daily Precision', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
            ],
            responseKey: 'interest_rate_code',
            isSearchAvailable: true,
            isAdvanceSearchAvailable: false,
            isAddFunctionalityRequired: true,
            isEditFunctionalityRequired: true,
            isDeleteFunctionalityRequired: true,
            isExportFunctionalityRequired: false,
            isMoreIconsRequired: false,
            isReloadFunctionalityRequired: false,
            onlyListingComponent: false,
            showTotalRecords: true,
            searchViaAPI: true,
            menuName: 'interest_rate_codes'
        };

        this.interestRatesModel = {
            infiniteScroll: true,
            multiSelection: false,
            onDemandLoad: true,
            singleSelection: false,
            apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_INTERESTRATES_LIST], deleteApi: this._apiMapper.endpoints[CyncConstants.DELETE_INTERESTRATE], updateApi: this._apiMapper.endpoints[CyncConstants.UPDATE_INTERESTRATE] },
            type: 'interest_rates',
            columnDef: [
                { field: 'rate_date', header: 'Interest Rate Date', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'rate_value', header: 'Interest Rate Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
            ],
            responseKey: 'interest_rate',
            isSearchAvailable: true,
            isAdvanceSearchAvailable: false,
            isAddFunctionalityRequired: true,
            isEditFunctionalityRequired: true,
            isDeleteFunctionalityRequired: true,
            isExportFunctionalityRequired: true,
            isMoreIconsRequired: false,
            isReloadFunctionalityRequired: false,
            onlyListingComponent: false,
            showTotalRecords: true,
            searchViaAPI: true,
            menuName: 'interest_rate_codes'
        }

        this.initCalendarYearRange();
        this.getLoanTypeDropDown();
        this.getPermissions();
        this.loadDefaultInterestRateCodeData();
        CyncConstants.setLoanType(this.loanType);
        this.setHeightInterestRateCodes();
        this.setHeightInterestRate();
    }

    /**
    * Get calendar year range list
    */
    initCalendarYearRange() {
        this.interest_rate_code_service.getCalendarYearRange(this._apiMapper.endpoints[CyncConstants.GET_CALENDAR_YEAR_RANGE]).subscribe(result => {
            this.calendarYearRange = result.start_year + ':' + result.end_year;
        })
    }

    /**
    * Get a list of loan types
    */
    getLoanTypeDropDown() {
        this.interest_rate_code_service.getLoanTypes(this._apiMapper.endpoints[CyncConstants.GET_INTERESTRATECODE_LOANTYPES]).subscribe(results => {
            this.interestRateLoanTypeList = results;
        });
    }

    /**
    * Get a list of Interest rate code roles and permission
    */
    getPermissions() {
        let userRole = localStorage.getItem('cyncUserRole');/*Logged In User role*/
        if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
            this.interest_rate_code_service.getUserMenuPermissions().subscribe(permissionsResponse => {
                let permissionsArray: any[] = permissionsResponse;
                this.isAddPermitted = this.interest_rate_code_service.getAddPermission(permissionsArray);
                this.isEditPermitted = this.interest_rate_code_service.getEditPermission(permissionsArray);
                this.isDeletePermitted = this.interest_rate_code_service.getDeletePermissions(permissionsArray);
            });
        } else {
            this.isAddPermitted = true;
            this.isDeletePermitted = true;
            this.isEditPermitted = true;
        }
    }

    /**
    * Get a list of Interest rate codes data 
    */
    loadDefaultInterestRateCodeData() {
        var loanValue = this.loanType;
        this.interest_rate_code_service.getInterestRateCodes(this._apiMapper.endpoints[CyncConstants.GET_INTERESTRATECODE_LIST] + loanValue + '&page=' + this.showCountInterestRateCodes + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY).subscribe(results => {
            this.interestRateCodesResultSet = results[this.interestRateCodesModel.responseKey];
            this.showTotalrecordsInterestRateCodes = results['recordTotal'];
            this._message.showLoader(false);
        });
    }

    /**
    * Change loan type method while selecting loan type dropdown value
    * @param moduleName (selected dropdown value)
    */
    changeLoanType(moduleName: string) {
        if (moduleName != 'null') {
            this.isLoanRowSeleted = true;
            this._message.showLoader(true);
            CyncConstants.setLoanType(moduleName);
            this.selectedRowsInterestRateCodes = [];
            this.selectedRowsInterestRates = [];
            this.isInterestRateSingleRowSeleted = false;
            this.column_width = CyncConstants.InterestRateCodeDefaultWidth;
            this.showCountInterestRate = 1;
            this.showCountInterestRateCodes = 1;
            this.loanType = moduleName;
            //Clearing search box content and update icons start
            this.searchTermInterestRateCodes = '';
            this.searchTermInterestRates = '';
            this.isSearchBoxInterestRateCodes = true;
            this.isCloseBoxInterestRateCodes = false;
            this.isSearchBoxInterestRates = true;
            this.isCloseBoxInterestRates = false;
            this.updateGridIconsInterestRateCodes();
            this.updateGridIconsInterestRates();
            //Clearing search box content and update icons end
            this.interest_rate_code_service.getInterestRateCodes(this._apiMapper.endpoints[CyncConstants.GET_INTERESTRATECODE_LIST] + this.loanType + '&page=' + this.showCountInterestRateCodes + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY).subscribe(results => {
                this.interestRateCodesResultSet = results[this.interestRateCodesModel.responseKey];
                this.showTotalrecordsInterestRateCodes = results['recordTotal'];
                this.setHeightInterestRateCodes();
                this._message.showLoader(false);
            });
        } else {
            this.isLoanRowSeleted = false;
        }
    }


    /**
    * Get a list of Interest rates according to Interest Rate Code selection
    * @param id (Selected Interest Rate Code ID)
    */
    loadInterestRatesData(id) {
        this.interest_rate_code_service.getInterestRates(this._apiMapper.endpoints[CyncConstants.GET_INTERESTRATES_LIST].replace('{interestRateCodeId}', id) + '?page=' + this.showCountInterestRate + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.INTEREST_RATE_DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY).subscribe(rateResults => {
            this.interestRatesResultSet = rateResults[this.interestRatesModel.responseKey];
            this.isInterestRateSingleRowSeleted = true;
            this.column_width = CyncConstants.InterestRateCodeUpdatedWidth;
            if (this.interestRatesResultSet.length > 0) {
                this.toggleExportIconInterestRates = true;
            } else {
                this.toggleExportIconInterestRates = false;
            }
            this.showCountInterestRate = 1;
            this.showTotalrecordsInterestRates = rateResults['recordTotal'];
            this.setHeightInterestRate();
            this._message.showLoader(false);
        });
    }

    /*--------------------------------------------- (Interest Rate Codes) Code Start ------------------------------- */
    /**
    * Add new Interest rate code
    */
    addInterestRateCode() {
        this._message.showLoader(true);
        this._router.navigateByUrl(this._router.url + '/add');
    }

    /**
    * Edit existing Interest rate code
    */
    editInterestRateCode() {
        if (this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length == 1) {
            this._message.showLoader(true);
            this._router.navigateByUrl(this._router.url + '/' + this.selectedRowsInterestRateCodes[0].id);
        }
    }

    /**
    * Delete Interest rate code showing confirmation popup window
    */
    deleteInterestRateCode() {
        if (this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length > 0) {
            this.showConfirmationPopup(this.selectedRowsInterestRateCodes, CyncConstants.InterestRateCodeStaticKey);
        }
    }

    /**
    * Interest Rates Codes Search method while onkey press
    * @param event
    */
    interestRateCodesOnKey(event: any) {
        this.interestRateCodesModel.isAdvanceSearchAvailable = false;
        this.interest_rate_code_service.interestRateCodesOnKey(event, this, this.interestRateCodesModel);
    }

    /**
    * Clear Interest rate code search input box
    */
    clearSearchBoxInterestRateCodes() {
        this.interest_rate_code_service.clearSearchBoxInterestRateCodes(this);
    }

    /**
    * Interest rate codes scroll
    */
    onScrollInterestRateCodes(event) {
        //call helper method to fix the table header
        this._helper.fixTableHeader(event.target, this.interestRateCodesModel.isAdvanceSearchAvailable);
        this.loadCountInterestRate = this.loadCountInterestRate + 1;
        let endpoint = '';
        if (this._helper.isScollbarAtBottom(this.interestRateCodeDataTableElementId)) {
            this.loadMoreInterestRate = true;
        } else {
            this.loadMoreInterestRate = false;
        }
        if (this.loadMoreInterestRate == true && (this.interestRateCodesResultSet.length < this.showTotalrecordsInterestRateCodes)) {
            this.showSpinnerInterestRateCode = true;
            this.showCountInterestRateCodes = this.showCountInterestRateCodes + 1;
            if (this.interestRateCodesModel.isAdvanceSearchAvailable) {
                let filterEndPoint = this._apiMapper.endpoints[CyncConstants.GET_SEARCH_DATA_INTEREST_RATE_CODE];
                filterEndPoint = filterEndPoint.replace('{loanType}', this.loanType.toString()).replace('{page}', this.showCountInterestRateCodes.toString()).replace('{rows}', this.rowCount.toString());
                this._advanceSearchPopupService.getAdvanceSearchData(filterEndPoint, this.advanceSearchModel).subscribe(res => {
                    let apiResponce = JSON.parse(res._body);
                    this.interestRateCodesResultSet = this.interestRateCodesResultSet.concat(apiResponce[this.interestRateCodesModel.responseKey]);
                    this.showTotalrecordsInterestRateCodes = apiResponce['recordTotal'];
                    this.showSpinnerInterestRateCode = false;
                });
            } else {
                if (this.searchTermInterestRateCodes != undefined && this.searchTermInterestRateCodes.length > 0) {
                    endpoint = this._apiMapper.searchAPIs[CyncConstants.SEARCH_INTEREST_RATE_CODES]
                        + this.searchTermInterestRateCodes + '&loan_type=' + this.loanType + '&page=' + this.showCountInterestRateCodes + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY;
                } else {
                    endpoint = this.interestRateCodesModel.apiDef.getApi + this.loanType + '&page=' + this.showCountInterestRateCodes + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY;
                }
                this.interest_rate_code_service.getInterestRateCodes(endpoint).subscribe(results => {
                    this.interestRateCodesResultSet = this.interestRateCodesResultSet.concat(results[this.interestRateCodesModel.responseKey]);
                    this.showSpinnerInterestRateCode = false;
                });
            }
        }
    }

    /**
    * Interest rate code select row method
    * @param result
    */
    interestRateCodeRowSelect(result: any) {
        if (this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length == 1) {
            this._message.showLoader(true);
            this.isInterestRateSingleRowSeleted = true;
            this.column_width = CyncConstants.InterestRateCodeUpdatedWidth;
            this.selectedInterestRateCodeRowValue = this.selectedRowsInterestRateCodes[0].rate_code;
            this.loadInterestRatesData(this.selectedRowsInterestRateCodes[0].id);
            this.updateGridIconsInterestRates();
        } else {
            this.isInterestRateSingleRowSeleted = false;
            this.column_width = CyncConstants.InterestRateCodeDefaultWidth;
            this.selectedRowsInterestRates = [];
        }
        //Clearing search box content and update icons start
        this.searchTermInterestRates = '';
        this.isSearchBoxInterestRates = true;
        this.isCloseBoxInterestRates = false;
        //Clearing search box content and update icons end
        this.updateGridIconsInterestRateCodes();
    }

    /**
    * Interest rate code unselect row method
    * @param result
    */
    interestRateCodeUnSelectRow(result: any) {
        if (this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length == 1) {
            this._message.showLoader(true);
            this.isInterestRateSingleRowSeleted = true;
            this.column_width = CyncConstants.InterestRateCodeUpdatedWidth;
            this.selectedInterestRateCodeRowValue = this.selectedRowsInterestRateCodes[0].rate_code;
            this.loadInterestRatesData(this.selectedRowsInterestRateCodes[0].id);
            this.updateGridIconsInterestRates();
        } else {
            this.isInterestRateSingleRowSeleted = false;
            this.column_width = CyncConstants.InterestRateCodeDefaultWidth;
            this.selectedRowsInterestRates = [];
        }
        this.updateGridIconsInterestRateCodes();
    }

    /**
    * Interest rate code select all checkbox method
    */
    selectAllChkBoxInterestRateCodes() {
        this.isInterestRateSingleRowSeleted = false;
        this.column_width = CyncConstants.InterestRateCodeDefaultWidth;
        this.selectedRowsInterestRates = [];
        this.updateGridIconsInterestRateCodes();
    }

    /**
    * Update Interest rate codes grid icons
    */
    updateGridIconsInterestRateCodes() {
        if (this.isDeletePermitted) {
            this.toggleDeleteIconInterestRateCodes = this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length > 0;
        }

        if (this.isEditPermitted) {
            this.toggleEditIconInterestRateCodes = this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length == 1;
        }
    }

    /**
    * Auto adjust height for interest rate codes
    */
    setHeightInterestRateCodes() {
        var appbody_cont = window.innerHeight;
        $(window).resize(function () {
            appbody_cont = window.innerHeight;
            if (document.getElementById("intrst_app-body-container")) { document.getElementById('intrst_app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
            if (document.getElementById("intrst_main_contents")) { document.getElementById('intrst_main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 36) + 'px'; }
        })
        if (document.getElementById("intrst_app-body-container")) { document.getElementById('intrst_app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
        setTimeout(function () {
            if (document.getElementById("intrst_main_contents")) { document.getElementById('intrst_main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 36) + 'px'; }
        }, 50);
    }

    /*--------------------------------------------- (Interest Rate Codes) Code End ------------------------------- */

    /*--------------------------------------------- (Interest Rates) Code Start ------------------------------- */
    /**
    * Add new Interest rate
    */
    addInterestRate() {
        if (this.selectedRowsInterestRateCodes != undefined && this.selectedRowsInterestRateCodes.length == 1) {
            this._message.showLoader(true);
            this._router.navigateByUrl(this._router.url + '/' + this.selectedRowsInterestRateCodes[0].id + '/interest-rate/add');
        }
    }

    /**
    * Edit interest rate
    */
    editInterestRate() {
        if (this.selectedRowsInterestRates != undefined && this.selectedRowsInterestRates.length == 1) {
            this._message.showLoader(true);
            this._router.navigateByUrl(this._router.url + '/' + this.selectedRowsInterestRateCodes[0].id + '/interest-rate/' + this.selectedRowsInterestRates[0].id);
        }
    }

    /**
    * Delete interest rate
    */
    deleteInterestRate() {
        if (this.selectedRowsInterestRates != undefined && this.selectedRowsInterestRates.length > 0) {
            this.showConfirmationPopup(this.selectedRowsInterestRates, CyncConstants.InterestRateStaticKey);
        }
    }

    /**
    * Interest rate row select
    * @param result
    */
    interestRateRowSelect(result: any) {
        this.updateGridIconsInterestRates();
    }

    /**
    * Interest rate row unselect
    * @param result
    */
    interestRatesUnSelectRow(result: any) {
        this.updateGridIconsInterestRates();
    }

    /**
    * Interest rate select all checkbox
    */
    selectAllChkBoxInterestRates() {
        this.updateGridIconsInterestRates();
    }

    /**
    * Interest rate search method while onkey press
    * @param event
    */
    interestRatesOnKey(event: any) {
        this.interest_rate_code_service.interestRatesOnKey(event, this, this.interestRatesModel, this.selectedRowsInterestRateCodes[0].id);
    }

    /**
    * Clear Interest Rate search input box
    */
    clearSearchBoxInterestRate() {
        this.interest_rate_code_service.clearSearchBoxInterestRate(this);
    }

    /**
    * Interest rate scroll
    */
    onScrollInterestRates(event) {
        //call helper method to fix the table header
        this._helper.fixTableHeader(event.target, this.interestRatesModel.isAdvanceSearchAvailable);

        this.loadCountInterestRateCode = this.loadCountInterestRateCode + 1;
        if (this._helper.isScollbarAtBottom(this.interestRateDataTableElementId)) {
            this.loadMoreInterestRateCode = true;
        } else {
            this.loadMoreInterestRateCode = false;
        }
        let endpoint = '';
        if (this.loadMoreInterestRateCode && (this.interestRatesResultSet.length < this.showTotalrecordsInterestRates)) {
            this.showCountInterestRate = this.showCountInterestRate + 1;
            this.showSpinnerInterestRate = true;
            if (this.searchTermInterestRates != undefined && this.searchTermInterestRates.length > 0) {
                endpoint = this._apiMapper.searchAPIs[CyncConstants.SEARCH_INTEREST_RATE]
                    + this.searchTermInterestRates + '&page=' + this.showCountInterestRate + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.INTEREST_RATE_DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY;
                endpoint = endpoint.replace('{interestRateCodeId}', this.selectedRowsInterestRateCodes[0].id);
            } else {
                endpoint = this.interestRatesModel.apiDef.getApi + '?page=' + this.showCountInterestRate + '&rows=' + this.rowCount + '&order_by=' + CyncConstants.INTEREST_RATE_DEFAULT_ORDER_BY + '&sort_by=' + CyncConstants.DEFAULT_SORT_BY;
                endpoint = endpoint.replace('{interestRateCodeId}', this.selectedRowsInterestRateCodes[0].id);
            }
            this.interest_rate_code_service.getInterestRates(endpoint).subscribe(rateResults => {
                this.interestRatesResultSet = this.interestRatesResultSet.concat(rateResults['interest_rate']);
                this.showSpinnerInterestRate = false;
            });
        }
    }

    /**
    * Update Interest rates grid icons
    */
    updateGridIconsInterestRates() {
        if (this.isDeletePermitted) {
            this.toggleDeleteIconInterestRates = this.selectedRowsInterestRates != undefined && this.selectedRowsInterestRates.length > 0;
        }

        if (this.isEditPermitted) {
            this.toggleEditIconInterestRates = this.selectedRowsInterestRates != undefined && this.selectedRowsInterestRates.length == 1;
        }

        // if (this.isExportPermitted) {
        //     this.toggleExportIconInterestRates = this.selectedRowsInterestRates != undefined && this.selectedRowsInterestRates.length > 0;
        // }
    }

    /**
    * Auto set height for Interest rate
    */
    setHeightInterestRate() {
        var appbody_cont = window.innerHeight;
        $(window).resize(function () {
            appbody_cont = window.innerHeight;
            if (document.getElementById("intrst_app-body-container")) { document.getElementById('intrst_app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
            if (document.getElementById("main_ratest_contents")) { document.getElementById('main_ratest_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 75) + 'px'; }
        })
        if (document.getElementById("intrst_app-body-container")) { document.getElementById('intrst_app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
        setTimeout(function () {
            if (document.getElementById("main_ratest_contents")) { document.getElementById('main_ratest_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 75) + 'px'; }
        }, 50);
    }
    /*--------------------------------------------- (Interest Rates) Code End ------------------------------- */

    /**
    * Delete confirm popup window 
    * @param filterResultSet (selected rows)
    * @param type (interest rate code or interest rate)
    */
    showConfirmationPopup(filterResultSet, type) {
        if (type == CyncConstants.InterestRateCodeStaticKey) {
            this._helper.openConfirmPopup({ "title": CyncConstants.CONFIRMATION_POPUP_TITLE, "message": this.interest_rate_code_service.getConfirmationPopupMessage(filterResultSet, 'rate_code', type), "msgType": "warning" }).subscribe(result => {
                if (result) {
                    this._message.showLoader(true);
                    this.deleteSelectedRows(filterResultSet, type);
                } else {
                    this.selectedRowsInterestRateCodes = [];
                    this.updateGridIconsInterestRateCodes();
                }
            });
        } else if (type == CyncConstants.InterestRateStaticKey) {
            this._helper.openConfirmPopup({ "title": CyncConstants.CONFIRMATION_POPUP_TITLE, "message": this.interest_rate_code_service.getConfirmationPopupMessage(filterResultSet, 'rate_date', type), "msgType": "warning" }).subscribe(result => {
                if (result) {
                    this._message.showLoader(true);
                    this.deleteSelectedRows(filterResultSet, type);
                } else {
                    this.selectedRowsInterestRates = [];
                    this.updateGridIconsInterestRates();
                }
            });
        }
    }

    /**
    *  Make final request for delete after click on yes button in delete popup
    * @param filterResultSet (selected rows)
    * @param type (interest rate code or interest rate)
    */
    deleteSelectedRows(filterResultSet, type) {
        if (type == CyncConstants.InterestRateCodeStaticKey) {
            this.interest_rate_code_service.deleteInterestRateCodes(filterResultSet, 'id').subscribe(deleteResponse => {
                if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
                    this.fireSuccessMsg(CyncConstants.DELETE_SUCCESS_MSG);
                    this.showCountInterestRateCodes = 1;
                    this.loadDefaultInterestRateCodeData();
                    this.selectedRowsInterestRateCodes = [];
                    this.updateGridIconsInterestRateCodes();
                    this.isInterestRateSingleRowSeleted = false;
                    this.column_width = CyncConstants.InterestRateCodeDefaultWidth;
                    this._message.showLoader(false);
                } else {
                    this._message.showLoader(false);
                }
            });
        } else if (type == CyncConstants.InterestRateStaticKey) {
            this.interest_rate_code_service.deleteInterestRates(filterResultSet, 'id', this.selectedRowsInterestRateCodes[0].id).subscribe(deleteResponse => {
                if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
                    this.fireSuccessMsg(CyncConstants.DELETE_SUCCESS_MSG);
                    this.showCountInterestRate = 1;
                    this.loadInterestRatesData(this.selectedRowsInterestRateCodes[0].id);
                    this.selectedRowsInterestRates = [];
                    this.updateGridIconsInterestRates();
                    this._message.showLoader(false);
                } else {
                    this._message.showLoader(false);
                }
            });
        }
    }

    /**
    *  Success messsage after delete records
    * @param successMsg 
    */
    fireSuccessMsg(successMsg: string) {
        this.interest_rate_code_service.showSuccessMessage(successMsg);
    }
    //Export code starts

    // array to display the export columns
    exportColumns: ExportColumn[] = [];

	/**
	 * Show pop up for export with column selection
	 */
    showDialogForExport() {
        if (this.interestRatesResultSet != undefined && this.interestRatesResultSet.length > 0) {
            this.toogleExportConfirmPoupupFlag();
            this.exportColumns = [];
            this.exportColumns = this._helper.getExportColumns(this.interestRatesModel.columnDef);
        }
    }

    /**
    *  Toogle for Export Confirm Poupup Flag
    */
    toogleExportConfirmPoupupFlag() {
        this.exportDisplayPopup = !(this.exportDisplayPopup);
    }

    /**
    *  Export and download file
    * @param selectedColumns 
    */
    exportSelectedColumns(selectedColumns: ExportColumn[]) {
        let queryParam: string = this._helper.getExportQueryParam(this.selectedRowsInterestRates, selectedColumns);
        if (queryParam != undefined && queryParam.length > 0) {
            var apiEndpoint = this.interestRatesModel.apiDef.getApi.replace('{interestRateCodeId}', this.selectedRowsInterestRateCodes[0].id);
            this.toogleExportConfirmPoupupFlag();
            this._message.showLoader(true);
            this.interest_rate_code_service.exportData(apiEndpoint, queryParam).subscribe(blob => {
                this.exportColumns = [];
                this._helper.downloadFile(blob, this.interestRatesModel.type);
                this._message.showLoader(false);
            });
        } else {
            this.exportDisplayPopup = true;
            this.exportDisplayErrorPopup = true;
        }
    }

    //Export code ends
    /**
    *  Print filter data count on according to column search Interest Rate Code
    * @param event 
    */
    printFilteredDataCountInterestRateCode(event) {
        if (event.filteredValue != undefined) {
            this.recordCountInterestRateCodes = event.filteredValue.length;
            if (this.recordCountInterestRateCodes == this.interestRateCodesResultSet.length) {
                this.recordCountInterestRateCodes = -1;
            }
        }
    }

    /**
     *  Print filter data count on according to column search Interest Rate
     * @param event 
     */
    printFilteredDataCountInterestRate(event) {
        if (event.filteredValue != undefined) {
            this.recordCountInterestRates = event.filteredValue.length;
            if (this.recordCountInterestRates == this.interestRatesResultSet.length) {
                this.recordCountInterestRates = -1;
            }
        }
    }

    /**
     *Interest Rate Date column search:
    *On change of Date, filter the columns 
    */
    filterColumnOnInterestRateDateChange($event, dt, col) {
        /*Converting Date to String and passing the string value to filter() method*/
        let inputDate: Date = $event;
        let tempDate: any = inputDate.getDate();
        let tempMonth: any = inputDate.getMonth() + 1;
        let year: any = inputDate.getFullYear();
        let date: string;
        let month: string;
        let inputDateInString: string;
        if (tempDate < 10) {
            date = "0" + tempDate;
        } else {
            date = tempDate;
        }

        if (tempMonth < 10) {
            month = "0" + tempMonth;
        } else {
            month = tempMonth;
        }

        //inputDateInString = year + "-" + month + "-" + date;
        inputDateInString = month + "/" + date + "/" + year;
        dt.filter(inputDateInString, col.field, col.filterMatchMode);
    }

    /**
    * Open advance search popup
    */

    openAdvanceSearchPoup() {
        this._helper.scrollTopDataTable(this.dataTableElementId);
        let getColumnEndPoint = this._apiMapper.endpoints[CyncConstants.GET_COLUMNS];
        getColumnEndPoint = getColumnEndPoint.replace('{model}', 'InterestRateCode');

        let getOperatorEndPoint = this._apiMapper.endpoints[CyncConstants.GET_OPERATORS];

        let getDropdownEndPoint = this._apiMapper.endpoints[CyncConstants.GET_DROPDOWN_VALUES];
        getDropdownEndPoint = getDropdownEndPoint.replace('{model}', 'InterestRateCode');

        let apiModel = { 'columnAPI': getColumnEndPoint, 'operatorAPI': getOperatorEndPoint, 'dropdownAPI': getDropdownEndPoint };
        const requestParam = { 'apiModel': apiModel, 'persistedAdvanceSearch': this.persistAdvanceSearch };
        this._popupService.openAdvanceSearchPoup(requestParam).subscribe(data => {
            this.persistAdvanceSearch = data;

            if (data.get('allowSearch').value) {
                this.getAdvanceSearchData(data.get('advanceSearchForms').value, data.get('groupOp').value);
            }
        });
    }

    /**
    * return search data based on the search criteria
    */
    private getAdvanceSearchData(model: AdvanceSearch[], groupOp: string) {
        this.showCountInterestRateCodes = 1;
        this._message.showLoader(true);
        this.interestRateCodesModel.isAdvanceSearchAvailable = true;
        let filters = new Filters();
        let filterRules = [];
        model.forEach(element => {
            let filterRule = new FilterRules();
            filterRule.data = element.data;
            filterRule.field = element.field;
            filterRule.op = element.op;
            filterRules.push(filterRule);
        });
        filters.groupOp = groupOp;
        filters.rules = filterRules;
        let requestBody = new FiltersModel();
        requestBody.filters = filters;
        this.advanceSearchModel = requestBody;
        let filterEndPoint = this._apiMapper.endpoints[CyncConstants.GET_SEARCH_DATA_INTEREST_RATE_CODE];
        filterEndPoint = filterEndPoint.replace('{loanType}', this.loanType.toString()).replace('{page}', this.showCountInterestRateCodes.toString()).replace('{rows}', this.rowCount.toString());
        this._advanceSearchPopupService.getAdvanceSearchData(filterEndPoint, requestBody).subscribe(res => {
            let apiResponce = JSON.parse(res._body);
            this.interestRateCodesResultSet = apiResponce[this.interestRateCodesModel.responseKey];
            this.showTotalrecordsInterestRateCodes = apiResponce['recordTotal'];
            this._message.showLoader(false);
        });
    }
}
