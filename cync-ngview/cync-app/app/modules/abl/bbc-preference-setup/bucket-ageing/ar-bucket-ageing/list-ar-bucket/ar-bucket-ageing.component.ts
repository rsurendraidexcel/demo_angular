import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { CyncConstants } from '@cyncCommon/utils/constants';
import { navbarComponent } from '@app/navbar/navbar.component';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-create-user',
  templateUrl: './ar-bucket-ageing.component.html'
})

/**
 * @class ARBucketAgeingComponent
 */
export class ARBucketAgeingComponent implements OnInit {

  listARBucketAgeingModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;


  constructor(
    private _helper: Helper,
    private _apiMapper: APIMapper, private _navbar: navbarComponent) {
    this.borrowerId = CyncConstants.getSelectedClient();

    this.listARBucketAgeingModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: 'AR Bucket Ageing',
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_AR_BUCKET_AGEING], deleteApi: this._apiMapper.endpoints[CyncConstants.GET_AR_BUCKET_AGEING], updateApi: '' },
      columnDef: [
        { field: 'bucket_number', header: 'Bucket Number', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'bucket_days', header: 'Bucket Days', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'bucket_name', header: 'Bucket Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
      ],
      responseKey: 'bucket_ageings',
      isSearchAvailable: true,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: true,
      isEditFunctionalityRequired: true,
      isDeleteFunctionalityRequired: true,
      isExportFunctionalityRequired: true,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: true,
      searchViaAPI: false,
      menuName: 'bucket_aging',
      permissionRequired: true,
      isPaginationRequired: false,
      reloadGridDataOnClientSelection: true,
      isMoreIconsRequired: false,
      deletePopupParameter: 'bucket_number'
    };
  }

  /**
   * set window height on init
   */
  ngOnInit() {
    this._helper.adjustUI();
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();

  }

}
