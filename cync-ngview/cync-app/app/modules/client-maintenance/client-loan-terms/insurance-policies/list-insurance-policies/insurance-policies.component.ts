import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-insurance-party',
  templateUrl: './insurance-policies.component.html'
})

/**
 * @author - Lavish
 */
export class InsurancePoliciesComponent implements OnInit {

    insurancepoliciesModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;


  constructor(private _service: CustomHttpService, 
    private config: AppConfig,
    private _apiMapper: APIMapper,
    private _helper: Helper) {
    this.borrowerId = CyncConstants.getSelectedClient();

    this.insurancepoliciesModel = {    
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: 'Insurance Policies',
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_INSURANCE_POLICIES], deleteApi:  this._apiMapper.endpoints[CyncConstants.GET_INSURANCE_POLICIES], updateApi: '' },
      columnDef: [
        { field: 'legal_name', header: 'Legal Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'insurance_name', header: 'Insurance Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'amount', header: 'Amount', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }

    ],
      responseKey: 'insurance_policies',
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
   * 
   */
  ngOnInit() {
    console.log("#########################");
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    //this._service.setHeight();
    this._helper.setGuarantorsComponentHeight();
  }

  /**
  * call on change of dropdown value
  * 
  */
  onChangeDropdown(selectedValue:string){
    this._helper.onChangeGuarantorsDropdown(selectedValue);
    }

}