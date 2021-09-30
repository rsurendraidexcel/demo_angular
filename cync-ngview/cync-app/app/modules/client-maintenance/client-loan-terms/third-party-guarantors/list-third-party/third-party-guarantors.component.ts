import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'

@Component({
  selector: 'app-third-party',
  templateUrl: './third-party-guarantors.component.html'
})

/**
* @author - Lavish
*
*/
export class ThirdPartyGuarantorsComponent implements OnInit {

  thirdpartyguarantorsModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;


  constructor(private _service: CustomHttpService,
    private config: AppConfig,
    private _apiMapper: APIMapper,
    private _helper: Helper) {
    this.borrowerId = CyncConstants.getSelectedClient();

    this.thirdpartyguarantorsModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: 'Third Party Guarantors',
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_THIRD_PARTY], deleteApi: this._apiMapper.endpoints[CyncConstants.GET_THIRD_PARTY], updateApi: '' },
      columnDef: [
        { field: 'legal_name', header: 'Legal Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'percent_owned', header: '% Owned', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
      ],
      responseKey: 'third_party_guarantors',
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
      menuName: 'borrower_guarantors',
      reloadGridDataOnClientSelection : true
    };
  }

  /**
   * on intialization of component
   */
  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    //this._service.setHeight();
    this._helper.setGuarantorsComponentHeight();
  }

  /**
  * this method will call on change of dropdown value
  *
  */
  onChangeDropdown(selectedValue: string) {
    this._helper.onChangeGuarantorsDropdown(selectedValue);
  }

}