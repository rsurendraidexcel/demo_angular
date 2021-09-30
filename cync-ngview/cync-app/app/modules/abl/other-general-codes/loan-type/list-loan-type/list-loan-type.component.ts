import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { CyncConstants } from '@cyncCommon/utils/constants';
import { navbarComponent } from '@app/navbar/navbar.component';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
    selector: 'app-list-loan-type',
    templateUrl: './list-loan-type.component.html'
})

export class ListLoanTypeComponent implements OnInit {

    loanTypeModel: CustomGridModel;
    coulmnDefinition: ColumnDefinition;

    constructor(
        private _apiMapper: APIMapper,
        private _navbar: navbarComponent,
        private _helper: Helper
    ) { }

    ngOnInit() {
        this.loanTypeModel = {
            infiniteScroll: true,
            multiSelection: false,
            onDemandLoad: true,
            singleSelection: false,
            apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_LOAN_TYPE], deleteApi: this._apiMapper.endpoints[CyncConstants.DELETE_LOAN_TYPE_API], updateApi: '' },
            type: 'Loan Type',
            columnDef: [
                { field: 'loan_type_name', header: 'Loan Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'loan_type_desc', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
            ],
            responseKey: 'non_abl_loan_types',
            isSearchAvailable: true,
            isAdvanceSearchAvailable: false,
            isAddFunctionalityRequired: true,
            isEditFunctionalityRequired: true,
            isDeleteFunctionalityRequired: true,
            isExportFunctionalityRequired: false,
            isReloadFunctionalityRequired: false,
            onlyListingComponent: false,
            showTotalRecords: true,
            searchViaAPI: true,
            permissionRequired: true,
            isPaginationRequired: true,
            menuName: 'abl_charge_codes',
            deletePopupParameter: 'loan_type_name',
            reloadGridDataOnClientSelection: true,

        };
        this._helper.adjustUI();
    }
}