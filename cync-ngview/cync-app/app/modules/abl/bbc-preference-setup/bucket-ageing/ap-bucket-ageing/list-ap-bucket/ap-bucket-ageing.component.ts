import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { navbarComponent } from '@app/navbar/navbar.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-create-user1',
  templateUrl: './ap-bucket-ageing.component.html'
})

/**
 * 
 */
export class APBucketAgeingComponent implements OnInit {

  listAPBucketAgeingModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;


  constructor(
    private _apiMapper: APIMapper, private _navbar: navbarComponent,
    private _helper: Helper) {
    this.borrowerId = CyncConstants.getSelectedClient();

    this.listAPBucketAgeingModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: 'AP Bucket Ageing',
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_AP_BUCKET_AGEING], deleteApi: this._apiMapper.endpoints[CyncConstants.GET_AP_BUCKET_AGEING], updateApi: '' },
      columnDef: [
        { field: 'bucket_number', header: 'Bucket Number', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'bucket_days', header: 'Bucket Days', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'bucket_name', header: 'Bucket Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
      ],
      responseKey: 'payable_bucket_aging',
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
   * 
   */
  ngOnInit() {
    this._helper.adjustUI();
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();
  }

}
