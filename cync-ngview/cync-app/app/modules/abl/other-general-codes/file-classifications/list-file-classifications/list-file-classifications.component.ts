import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { CyncConstants } from '@cyncCommon/utils/constants';
import { navbarComponent } from '@app/navbar/navbar.component';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
    selector: 'app-list-file-classifications',
    templateUrl: './list-file-classifications.component.html'
})

/**
 * @author : Lavish
 */
export class ListFileClassificationsComponent implements OnInit {

    fileclassificationsModel: CustomGridModel;
    coulmnDefinition: ColumnDefinition;

    constructor(
        private _apiMapper: APIMapper, private _navbar: navbarComponent, private _helper:Helper) {

    }

    /**
     * Initializing filclassification list model
     */
    ngOnInit() {
        this.fileclassificationsModel = {
            infiniteScroll: true,
            multiSelection: false,
            onDemandLoad: true,
            singleSelection: false,
            apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_FILE_CLASSIFICATION], deleteApi: this._apiMapper.endpoints[CyncConstants.GET_FILE_CLASSIFICATION], updateApi: '' },
            type: 'File Classification',
            columnDef: [
                { field: 'name', header: 'Classification Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
            ],
            responseKey: 'file_classification',
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
            permissionRequired: true,
            isPaginationRequired: true,
            menuName: 'file_classification',
            deletePopupParameter: 'name',
            reloadGridDataOnClientSelection : true,

        };
        this._helper.adjustUI();
    }

}