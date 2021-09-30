import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { Router } from "@angular/router";
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-create-user',
  templateUrl: './guarantors.component.html'
})

/**
* @author - Lavish
*
*/
export class GuarantorsComponent implements OnInit {

  guarantorsModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;


  constructor(private _service: CustomHttpService,
    private config: AppConfig,
    private _apiMapper: APIMapper,
    private _helper: Helper) {
    this.borrowerId = CyncConstants.getSelectedClient();
    this.intializeCustomGrid();
  }

  /**
   * 
   */
  private intializeCustomGrid() {
    this.guarantorsModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: 'Guarantors',
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_CLIENT_LOAN_GUARANTORS], deleteApi: this._apiMapper.endpoints[CyncConstants.GET_CLIENT_LOAN_GUARANTORS], updateApi: '' },
      columnDef: [
        { field: 'company_name', header: 'Company Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'federal_id', header: 'Federal ID', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'country_name', header: 'Country', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'state_name', header: 'State', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'corporate_type', header: 'Corporate Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'naics_code_name', header: 'NAICS', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'percent_owned', header: '% Owned', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },

      ],
      responseKey: 'guarantor',
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
      reloadGridDataOnClientSelection : true,
      deletePopupParameter : 'company_name'
    };
  }

  /**
   * 
   */
  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    // this._service.setHeight();
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
