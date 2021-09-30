import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'

@Component({
  selector: 'app-create-user',
  templateUrl: './borrower-guarantors.component.html'
})

/**
 * @author - Lavish
 */
export class BorrowerGuarantorsComponent implements OnInit {

  borrowerguarantorsModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;


  constructor(private _service: CustomHttpService,
    private config: AppConfig,
    private _apiMapper: APIMapper,
    private _helper: Helper) {

    this.borrowerId = CyncConstants.getSelectedClient();
    this.borrowerguarantorsModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: 'Borrower Guarantors',
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_CLIENT_BORROWER_GUARANTORS], deleteApi: this._apiMapper.endpoints[CyncConstants.GET_CLIENT_BORROWER_GUARANTORS], updateApi: '' },
      columnDef: [
        { field: 'company_name', header: 'Company Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'federal_id', header: 'Federal ID', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'country_name', header: 'Country', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'state_name', header: 'State', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'corporate_type', header: 'Corporate Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'naics_code_name', header: 'NAICS', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'percent_owned', header: '% Owned', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },

      ],
      responseKey: 'guarantor_borrower',
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
      reloadGridDataOnClientSelection : true,
      menuName: 'borrower_guarantors'
    };
  }

  /**
   * 
   */
  ngOnInit() {
    console.log("#########################");
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
